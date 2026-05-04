import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../config/prisma.service';

@Injectable()
export class SettlementsService {
  private readonly logger = new Logger(SettlementsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('settlements') private readonly settlementQueue: Queue,
  ) {}

  /**
   * Queue a settlement for processing.
   * Since the external challan API does not confirm official payment/settlement,
   * we maintain a separate settlement_status.
   */
  async queueSettlement(orderId: string) {
    await this.settlementQueue.add(
      'process-settlement',
      { orderId },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 60000 },
        removeOnComplete: true,
      },
    );
    this.logger.log(`Settlement queued for order: ${orderId}`);
  }

  async processSettlement(orderId: string) {
    const settlement = await this.prisma.settlement.findUnique({
      where: { orderId },
      include: { order: { include: { payment: true } } },
    });

    if (!settlement) {
      this.logger.error(`Settlement not found for order: ${orderId}`);
      return;
    }

    if (settlement.status === 'SETTLED') {
      this.logger.log(`Settlement already completed for order: ${orderId}`);
      return;
    }

    try {
      await this.prisma.settlement.update({
        where: { id: settlement.id },
        data: {
          status: 'PROCESSING',
          startedAt: new Date(),
          lastAttemptAt: new Date(),
          attempts: { increment: 1 },
        },
      });

      // In a real system, this is where you would:
      // 1. Call the government payment gateway to pay the actual challan
      // 2. Record the transaction reference
      // For now, we mark it as pending manual review
      // since the external API doesn't support actual challan payment

      this.logger.log(`Settlement processing for order: ${orderId}`);

      // Mark for manual review since we can't auto-settle
      await this.prisma.settlement.update({
        where: { id: settlement.id },
        data: {
          status: 'MANUAL_REVIEW',
          lastAttemptAt: new Date(),
        },
      });

      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'SETTLED' },
      });
    } catch (error) {
      this.logger.error(
        `Settlement failed for order ${orderId}: ${error}`,
      );

      await this.prisma.settlement.update({
        where: { id: settlement.id },
        data: {
          status: 'FAILED',
          failureReason: error instanceof Error ? error.message : 'Unknown error',
          lastAttemptAt: new Date(),
        },
      });
    }
  }

  async getSettlementStatus(orderId: string) {
    return this.prisma.settlement.findUnique({
      where: { orderId },
      include: { order: true },
    });
  }

  async getPendingSettlements(page: number | string = 1, limit: number | string = 20) {
    page = Math.max(1, Number(page) || 1);
    limit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (page - 1) * limit;
    const [settlements, total] = await Promise.all([
      this.prisma.settlement.findMany({
        where: { status: { in: ['PENDING', 'PROCESSING', 'FAILED', 'MANUAL_REVIEW'] } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { order: { include: { user: true, payment: true } } },
      }),
      this.prisma.settlement.count({
        where: { status: { in: ['PENDING', 'PROCESSING', 'FAILED', 'MANUAL_REVIEW'] } },
      }),
    ]);
    return { settlements, total, page, limit };
  }

  async markSettled(settlementId: string, externalRef?: string) {
    return this.prisma.settlement.update({
      where: { id: settlementId },
      data: {
        status: 'SETTLED',
        settledAt: new Date(),
        completedAt: new Date(),
        externalRef,
      },
    });
  }
}
