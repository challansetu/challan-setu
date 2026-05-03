import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { RedisService } from '../config/redis.service';
import { ChallanProviderService } from './provider/challan-provider.service';
import { ChallanNormalizer } from './provider/challan-normalizer';
import { VehiclesService } from '../vehicles/vehicles.service';
import { SearchChallanDto } from './dto/search-challan.dto';
import { Prisma, SupportedRegion } from '@prisma/client';
import {
  CHALLAN_CACHE_TTL_FOUND_SECONDS,
  CHALLAN_CACHE_TTL_NOT_FOUND_SECONDS,
  SupportedRegionName,
} from '../common/constants';
import { classifyRegion } from './challan-region.util';

// Shape stored in Redis and returned to the client
export interface ChallanCacheEntry {
  challans: any[];
  searchId: string;
  vehicleNumber: string;
  totalFound: number;
  /** false on a live fetch; true when returned from Redis */
  cached: boolean;
  /** ISO timestamp of when the provider was last called */
  lastFetchedAt: string;
  /** ISO timestamp of when this cache entry will expire */
  cacheExpiresAt: string;
}

@Injectable()
export class ChallansService {
  private readonly logger = new Logger(ChallansService.name);

  /**
   * In-flight request deduplication.
   * Key: normalized vehicle number.
   * Value: the Promise that is already fetching from the provider.
   *
   * If a second request arrives while one is still in-flight for the same
   * vehicle, it waits on the same Promise instead of making a second paid
   * API call.
   */
  private readonly inFlight = new Map<string, Promise<ChallanCacheEntry>>();

  // Cost tracking (in-memory, resets on restart — use Redis counters for prod)
  private stats = { hits: 0, misses: 0, apiCalls: 0, deduplicated: 0 };

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly provider: ChallanProviderService,
    private readonly normalizer: ChallanNormalizer,
    private readonly vehiclesService: VehiclesService,
  ) {}

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Canonical vehicle number:
   *  - uppercase
   *  - strip spaces, hyphens, and any other non-alphanumeric characters
   * "hr 55-ax 3280" → "HR55AX3280"
   */
  private normalize(vehicleNumber: string): string {
    return vehicleNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  private cacheKey(normalized: string): string {
    return `challan:${normalized}`;
  }

  private toRegionEnum(r: SupportedRegionName | null): SupportedRegion | null {
    if (!r) return null;
    const map: Record<SupportedRegionName, SupportedRegion> = {
      Delhi: SupportedRegion.DELHI,
      Gurgaon: SupportedRegion.GURGAON,
      Noida: SupportedRegion.NOIDA,
      Ghaziabad: SupportedRegion.GHAZIABAD,
    };
    return map[r] ?? null;
  }

  // ─── Main search ──────────────────────────────────────────────────────────

  async searchChallans(userId: string, dto: SearchChallanDto) {
    const vehicleNumber = this.normalize(dto.vehicleNumber);
    const forceRefresh = dto.forceRefresh ?? false;
    const key = this.cacheKey(vehicleNumber);

    // 1. Cache check (skipped when forceRefresh=true)
    if (!forceRefresh) {
      const cached = await this.redis.get(key);
      if (cached) {
        const entry: ChallanCacheEntry = JSON.parse(cached);

        // Validate cache: ensure at least one challan ID still exists in the DB.
        // If not, the DB was reset while the cache was still live — bust it and
        // fall through to a fresh provider fetch so callers never get dead IDs.
        const firstId = (entry.challans || [])[0]?.id;
        if (firstId) {
          const exists = await this.prisma.challan.count({ where: { id: firstId } });
          if (exists === 0) {
            this.logger.warn(
              `[STALE CACHE] ${vehicleNumber} — cached IDs no longer in DB, busting cache`,
            );
            await this.redis.del(key);
            // Fall through to fresh fetch below
          } else {
            this.stats.hits++;
            this.logger.log(
              `[CACHE HIT] ${vehicleNumber} | saved=₹4 | totalHits=${this.stats.hits}`,
            );
            // Track the search even on cache hit
            try {
              const vehicle = await this.vehiclesService.findOrCreate(userId, vehicleNumber);
              await this.prisma.challanSearch.create({
                data: {
                  userId,
                  vehicleId: vehicle.id,
                  vehicleNumber,
                  normalizedVehicleNumber: vehicleNumber,
                  status: 'SUCCESS',
                  cachedResponseUsed: true,
                  apiCost: 0,
                  resultCount: entry.totalFound,
                  supportableFound: (entry.challans || []).filter((c: any) => c.isSupported !== false).length,
                  serviceable: (entry.challans || []).some((c: any) => c.isSupported !== false) || null,
                },
              });
            } catch { /* non-blocking */ }
            return this.enrichWithPlatformPaid({ ...entry, cached: true });
          }
        } else {
          // Cache entry has no challans (no-data case) — always valid
          this.stats.hits++;
          this.logger.log(
            `[CACHE HIT] ${vehicleNumber} | saved=₹4 | totalHits=${this.stats.hits}`,
          );
          try {
            const vehicle = await this.vehiclesService.findOrCreate(userId, vehicleNumber);
            await this.prisma.challanSearch.create({
              data: {
                userId,
                vehicleId: vehicle.id,
                vehicleNumber,
                normalizedVehicleNumber: vehicleNumber,
                status: 'SUCCESS',
                cachedResponseUsed: true,
                apiCost: 0,
                resultCount: entry.totalFound,
                supportableFound: 0,
                serviceable: null,
              },
            });
          } catch { /* non-blocking */ }
          return { ...entry, cached: true };
        }
      }
    } else {
      this.logger.log(`[FORCE REFRESH] ${vehicleNumber} — bypassing cache`);
    }

    // 2. Request deduplication — if another request is already fetching this
    //    vehicle, wait on its Promise instead of making a second paid API call
    if (this.inFlight.has(vehicleNumber)) {
      this.stats.deduplicated++;
      this.logger.log(
        `[DEDUPLICATED] ${vehicleNumber} — waiting for in-flight request (saved ₹4)`,
      );
      const result = await this.inFlight.get(vehicleNumber)!;
      return result;
    }

    // 3. Cache miss — call the paid provider API
    this.stats.misses++;
    this.stats.apiCalls++;
    this.logger.log(
      `[CACHE MISS] ${vehicleNumber} | apiCalls=${this.stats.apiCalls} | approxCost=₹${this.stats.apiCalls * 4}`,
    );

    const fetchPromise = this.fetchAndStore(userId, vehicleNumber, key, forceRefresh);
    this.inFlight.set(vehicleNumber, fetchPromise);

    try {
      const result = await fetchPromise;
      return this.enrichWithPlatformPaid(result);
    } finally {
      this.inFlight.delete(vehicleNumber);
    }
  }

  // ─── Provider fetch + DB store + Redis cache ──────────────────────────────

  private async fetchAndStore(
    userId: string,
    vehicleNumber: string,
    cacheKey: string,
    forceRefresh: boolean,
  ): Promise<ChallanCacheEntry> {
    // Ensure vehicle record exists for this user
    const vehicle = await this.vehiclesService.findOrCreate(userId, vehicleNumber);

    // Create a search audit record
    const search = await this.prisma.challanSearch.create({
      data: {
        userId,
        vehicleId: vehicle.id,
        vehicleNumber,
        normalizedVehicleNumber: vehicleNumber,
        status: 'PENDING',
        apiProvider: 'invincibleocean',
        apiCost: 400,
        cachedResponseUsed: false,
      },
    });

    try {
      const providerResponse = await this.provider.fetchChallans(vehicleNumber);

      // Provider returned no data
      if (
        providerResponse.code !== 200 ||
        !providerResponse.result ||
        providerResponse.result.length === 0
      ) {
        await this.prisma.challanSearch.update({
          where: { id: search.id },
          data: {
            status: 'NO_DATA',
            resultCount: 0,
            rawResponse: providerResponse as unknown as Prisma.InputJsonValue,
          },
        });

        const now = new Date();
        const expiresAt = new Date(now.getTime() + CHALLAN_CACHE_TTL_NOT_FOUND_SECONDS * 1000);
        const entry: ChallanCacheEntry = {
          challans: [],
          searchId: search.id,
          vehicleNumber,
          totalFound: 0,
          cached: false,
          lastFetchedAt: now.toISOString(),
          cacheExpiresAt: expiresAt.toISOString(),
        };

        // Cache "no data" for shorter TTL — new challan could be issued soon
        await this.redis.set(cacheKey, JSON.stringify(entry), CHALLAN_CACHE_TTL_NOT_FOUND_SECONDS);
        this.logger.log(
          `[NO DATA] ${vehicleNumber} — cached for ${CHALLAN_CACHE_TTL_NOT_FOUND_SECONDS / 3600}h`,
        );
        return entry;
      }

      // Normalize provider response
      const normalized = this.normalizer.normalizeAll(providerResponse.result);
      this.logger.log(
        `Normalized ${normalized.length} challans: ${normalized.map((c) => `${c.challanNo}:₹${c.amount}`).join(', ')}`,
      );

      // Deduplicate by challanNo (provider sometimes returns same challan twice)
      const seen = new Set<string>();
      const deduped = normalized.filter((c) => {
        if (seen.has(c.challanNo)) return false;
        seen.add(c.challanNo);
        return true;
      });

      // Upsert challans sequentially — avoids concurrent-insert race on unique(searchId, challanNo)
      const savedChallans: { id: string }[] = [];
      const regionResults: Array<{ isSupported: boolean; supportedRegion: SupportedRegionName | null }> = [];
      for (const challan of deduped) {
        const rawData = (challan.rawData as Record<string, unknown>) ?? {};
        const region = classifyRegion({
          challanNo: challan.challanNo,
          state: challan.state,
          location: challan.location,
          courtName: challan.courtName,
          rawData,
        });
        regionResults.push({ isSupported: region.isSupported, supportedRegion: region.supportedRegion });

        const saved = await this.prisma.challan.upsert({
          where: { searchId_challanNo: { searchId: search.id, challanNo: challan.challanNo } },
          update: {
            amount: challan.amount,
            status: challan.status,
            receiptNo: challan.receiptNo,
            rawData: challan.rawData as unknown as Prisma.InputJsonValue,
            normalizedVehicleNumber: challan.vehicleNumber.toUpperCase().replace(/[^A-Z0-9]/g, ''),
            isSupported: region.isSupported,
            supportedRegion: this.toRegionEnum(region.supportedRegion),
            unsupportedReason: region.unsupportedReason,
            matchedBy: region.matchedBy,
            lastSyncedAt: new Date(),
          },
          create: {
            searchId: search.id,
            challanNo: challan.challanNo,
            vehicleNumber: challan.vehicleNumber,
            rcNo: challan.rcNo,
            state: challan.state,
            challanDate: challan.challanDate,
            location: challan.location,
            amount: challan.amount,
            status: challan.status,
            receiptNo: challan.receiptNo,
            challanSource: challan.challanSource,
            courtStatusDesc: challan.courtStatusDesc,
            courtName: challan.courtName,
            rawData: challan.rawData as unknown as Prisma.InputJsonValue,
            normalizedVehicleNumber: challan.vehicleNumber.toUpperCase().replace(/[^A-Z0-9]/g, ''),
            isSupported: region.isSupported,
            supportedRegion: this.toRegionEnum(region.supportedRegion),
            unsupportedReason: region.unsupportedReason,
            matchedBy: region.matchedBy,
            lastSyncedAt: new Date(),
          },
        });

        if (challan.offences.length > 0) {
          await this.prisma.challanOffence.deleteMany({ where: { challanId: saved.id } });
          await this.prisma.challanOffence.createMany({
            data: challan.offences.map((o) => ({
              challanId: saved.id,
              offence: o.offence,
              penalty: o.penalty,
            })),
          });
        }

        savedChallans.push(saved);
      }

      const supportableFound = regionResults.filter((r) => r.isSupported).length;
      const serviceable = regionResults.some((r) => r.isSupported);
      const serviceableRegionsFound = [...new Set(
        regionResults.map((r) => r.supportedRegion).filter(Boolean),
      )] as string[];

      await this.prisma.challanSearch.update({
        where: { id: search.id },
        data: {
          status: 'SUCCESS',
          resultCount: savedChallans.length,
          rawResponse: providerResponse as unknown as Prisma.InputJsonValue,
          supportableFound,
          serviceable,
          serviceableRegionsFound,
        },
      });

      // Fetch full challan records (with offences) to return
      const result = await this.prisma.challan.findMany({
        where: { searchId: search.id },
        include: { offences: true },
        orderBy: { challanDate: 'desc' },
      });

      const challansOut = result.map((c) => ({
        ...c,
        amount: Number(c.amount) || 0,
        offences: c.offences.map((o) => ({
          ...o,
          penalty: o.penalty != null ? Number(o.penalty) : null,
        })),
      }));

      const now = new Date();
      const expiresAt = new Date(now.getTime() + CHALLAN_CACHE_TTL_FOUND_SECONDS * 1000);
      const entry: ChallanCacheEntry = {
        challans: challansOut,
        searchId: search.id,
        vehicleNumber,
        totalFound: challansOut.length,
        cached: false,
        lastFetchedAt: now.toISOString(),
        cacheExpiresAt: expiresAt.toISOString(),
      };

      // Cache for 12 hours — challans rarely change mid-day
      await this.redis.set(cacheKey, JSON.stringify(entry), CHALLAN_CACHE_TTL_FOUND_SECONDS);
      this.logger.log(
        `[CACHED] ${vehicleNumber} — ${challansOut.length} challan(s) for ${CHALLAN_CACHE_TTL_FOUND_SECONDS / 3600}h`,
      );

      return entry;
    } catch (error) {
      // Do NOT cache errors — transient failures should always retry
      await this.prisma.challanSearch.update({
        where: { id: search.id },
        data: {
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  // ─── Cache stats (for admin/monitoring) ───────────────────────────────────

  getCacheStats() {
    const saved = this.stats.hits + this.stats.deduplicated;
    return {
      ...this.stats,
      estimatedMoneySaved: `₹${saved * 4}`,
      cacheHitRate:
        this.stats.hits + this.stats.apiCalls > 0
          ? `${Math.round((this.stats.hits / (this.stats.hits + this.stats.apiCalls)) * 100)}%`
          : '0%',
    };
  }

  // ─── Platform-paid enrichment ─────────────────────────────────────────────

  /**
   * After every search result (cache hit or fresh), mark challans that were
   * already paid via our platform so the UI can show a "Paid via ChallanSetu" badge.
   * This is NOT stored in cache since payment status changes at any time.
   */
  private async enrichWithPlatformPaid(entry: ChallanCacheEntry): Promise<ChallanCacheEntry> {
    const challanNos = (entry.challans || []).map((c: any) => c.challanNo).filter(Boolean);
    if (challanNos.length === 0) return entry;

    const paidItems = await this.prisma.orderItem.findMany({
      where: {
        challanNo: { in: challanNos },
        order: { status: { in: ['PAYMENT_COMPLETED', 'SETTLED'] } },
      },
      select: { challanNo: true },
    });

    if (paidItems.length === 0) return entry;

    const paidNos = new Set(paidItems.map((i) => i.challanNo));
    return {
      ...entry,
      challans: entry.challans.map((c: any) => ({
        ...c,
        paidViaPlatform: paidNos.has(c.challanNo),
      })),
    };
  }

  // ─── Other methods ────────────────────────────────────────────────────────

  async getChallansByIds(ids: string[]) {
    return this.prisma.challan.findMany({
      where: { id: { in: ids } },
      include: { offences: true },
    });
  }

  async getUserSearchHistory(userId: string, page: number | string = 1, limit: number | string = 10) {
    page = Math.max(1, Number(page) || 1);
    limit = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (page - 1) * limit;
    const [searches, total] = await Promise.all([
      this.prisma.challanSearch.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          challans: { include: { offences: true } },
          vehicle: true,
        },
      }),
      this.prisma.challanSearch.count({ where: { userId } }),
    ]);
    return { searches, total, page, limit };
  }
}
