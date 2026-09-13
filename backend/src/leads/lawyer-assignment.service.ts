import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../config/prisma.service';

// Lawyers never handle insurance leads (see AdminService.LAWYER_EXCLUDED_SOURCES) —
// keep them out of the assignment pool entirely rather than assigning and then hiding.
const EXCLUDED_SOURCES = ['insurance'];
const MAX_ASSIGNMENT_ATTEMPTS = 10;

function jitterDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.random() * 25));
}

@Injectable()
export class LawyerAssignmentService {
  private readonly logger = new Logger(LawyerAssignmentService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Round-robin assigns a newly created lead to an ACTIVE lawyer eligible for
   * its vehicle number (i.e. one of the lawyer's configured prefixes matches),
   * scoped independently per vehicle-number state prefix (e.g. "DL", "UP").
   * Returns null (lead stays unassigned) if the source is excluded, or no
   * eligible lawyer currently exists.
   */
  async assignLawyer(vehicleNumber: string, source: string): Promise<string | null> {
    if (EXCLUDED_SOURCES.includes(source)) return null;

    const normalized = vehicleNumber.trim().toUpperCase();
    // Indian vehicle numbers always start with a 2-letter state code — use it
    // as the round-robin bucket key, independent of how specific a lawyer's
    // configured prefix is.
    const statePrefix = normalized.slice(0, 2);
    if (!statePrefix) return null;

    for (let attempt = 0; attempt < MAX_ASSIGNMENT_ATTEMPTS; attempt++) {
      if (attempt > 0) await jitterDelay();

      const lawyers = await this.prisma.adminUser.findMany({
        where: { role: 'LAWYER', isActive: true },
        orderBy: { createdAt: 'asc' },
        select: { id: true, vehiclePrefixes: true },
      });
      const eligible = lawyers.filter((lawyer) =>
        lawyer.vehiclePrefixes.some((prefix) => normalized.startsWith(prefix.trim().toUpperCase())),
      );
      if (eligible.length === 0) return null;

      const state = await this.prisma.lawyerAssignmentState.findUnique({ where: { vehiclePrefix: statePrefix } });
      const lastAssignedId = state?.lastAssignedLawyerId ?? null;
      // A stale/no-longer-eligible last-assigned id (lawyer deactivated,
      // removed from this prefix, or deleted) yields -1, so rotation simply
      // restarts from the first eligible lawyer — never gets stuck.
      const lastIndex = lastAssignedId ? eligible.findIndex((l) => l.id === lastAssignedId) : -1;
      const nextLawyer = eligible[(lastIndex + 1) % eligible.length];

      // Compare-and-swap on the previously-read value so two concurrent
      // assignments for the same prefix can't both advance from the same
      // starting point — the loser's update matches zero rows and retries
      // against the winner's fresh state.
      if (state) {
        const result = await this.prisma.lawyerAssignmentState.updateMany({
          where: { vehiclePrefix: statePrefix, lastAssignedLawyerId: lastAssignedId },
          data: { lastAssignedLawyerId: nextLawyer.id },
        });
        if (result.count === 0) continue;
      } else {
        try {
          await this.prisma.lawyerAssignmentState.create({
            data: { vehiclePrefix: statePrefix, lastAssignedLawyerId: nextLawyer.id },
          });
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') continue;
          throw err;
        }
      }

      return nextLawyer.id;
    }

    this.logger.warn(`Lawyer assignment gave up after ${MAX_ASSIGNMENT_ATTEMPTS} attempts for prefix=${statePrefix} (high contention) — leaving lead unassigned`);
    return null;
  }
}
