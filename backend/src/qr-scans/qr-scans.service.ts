import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { TrackQrScanDto } from './dto/track-qr-scan.dto';

// Common bot/crawler user-agent patterns — not exhaustive, just a simple guard
const BOT_PATTERN = /bot|crawler|spider|googlebot|bingbot|slurp|duckduck|curl|wget|python-requests|java\/|go-http|scrapy|headlesschrome|phantomjs/i;

const DEDUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

@Injectable()
export class QrScansService {
  private readonly logger = new Logger(QrScansService.name);

  constructor(private readonly prisma: PrismaService) {}

  async trackScan(dto: TrackQrScanDto): Promise<{ tracked: boolean; reason?: string }> {
    const { source, ip, userAgent, referrer } = dto;

    const isBot = !!userAgent && BOT_PATTERN.test(userAgent);

    // Deduplicate: same source + ip + userAgent within the dedup window
    if (ip || userAgent) {
      const since = new Date(Date.now() - DEDUP_WINDOW_MS);
      const existing = await this.prisma.qrScan.findFirst({
        where: {
          source,
          ip: ip ?? null,
          userAgent: userAgent ?? null,
          createdAt: { gte: since },
        },
        select: { id: true },
      });
      if (existing) {
        return { tracked: false, reason: 'duplicate' };
      }
    }

    await this.prisma.qrScan.create({
      data: {
        source,
        ip: ip ?? null,
        userAgent: userAgent ?? null,
        referrer: referrer ?? null,
        isBot,
      },
    });

    this.logger.log(`QR scan tracked: source=${source} bot=${isBot}`);
    return { tracked: true };
  }

  async getSummary() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalScans, todayScans, last7DaysScans, bySource] = await Promise.all([
      this.prisma.qrScan.count({ where: { isBot: false } }),
      this.prisma.qrScan.count({ where: { isBot: false, createdAt: { gte: startOfToday } } }),
      this.prisma.qrScan.count({ where: { isBot: false, createdAt: { gte: last7Days } } }),
      this.prisma.qrScan.groupBy({
        by: ['source'],
        where: { isBot: false },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
    ]);

    return {
      totalScans,
      todayScans,
      last7DaysScans,
      bySource: bySource.map((row) => ({ source: row.source, count: row._count.id })),
    };
  }

  async getScans(params: { source?: string; page: number; limit: number }) {
    const { source, page, limit } = params;
    const skip = (page - 1) * limit;
    const where = source ? { source } : {};

    const [scans, total] = await Promise.all([
      this.prisma.qrScan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          source: true,
          ip: true,
          userAgent: true,
          referrer: true,
          isBot: true,
          createdAt: true,
        },
      }),
      this.prisma.qrScan.count({ where }),
    ]);

    return {
      scans,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
