import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { DiscountType } from '@prisma/client';

export const DISCOUNT_PERCENTAGE = 40;

/** Vehicle numbers that bypass legal fees — for end-to-end testing only. */
const TEST_VEHICLES_NO_FEE = new Set(['DL01CA1234']);

/** Tiered legal fee based on total challan subtotal (before discount). */
export function getLegalFee(subtotal: number, vehicleNumber?: string): number {
  if (vehicleNumber && TEST_VEHICLES_NO_FEE.has(vehicleNumber.toUpperCase())) return 0;
  if (subtotal >= 10000) return 999;
  if (subtotal >= 5000)  return 699;
  if (subtotal >= 3000)  return 399;
  if (subtotal >= 2000)  return 299;
  if (subtotal >= 1000)  return 149;
  return 99;
}

export interface PricingBreakdown {
  challanSubtotal: number;
  challanCount: number;
  legalFeeTotal: number;
  /** challanSubtotal - discountAmount (challan portion only, excludes legal fees) */
  finalAmount: number;
  /** What the customer pays: discounted challans + legal fees */
  totalPayable: number;
  /** Alias: equals challanSubtotal */
  grossAmount: number;
  /** 40% of challanSubtotal when promise accepted, else 0 */
  discountAmount: number;
  appliedRule: null;
  items: {
    challanId: string;
    challanNo: string;
    amount: number;
  }[];
}

@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculate pricing for selected challans.
   * Legal fee is tiered based on challan subtotal.
   */
  calculatePricing(
    challanItems: { challanId: string; challanNo: string; amount: number }[],
    vehicleNumber?: string,
  ): PricingBreakdown {
    if (!challanItems || challanItems.length === 0) {
      return {
        challanSubtotal: 0,
        challanCount: 0,
        legalFeeTotal: 0,
        grossAmount: 0,
        discountAmount: 0,
        finalAmount: 0,
        totalPayable: 0,
        appliedRule: null,
        items: [],
      };
    }

    const challanSubtotal =
      Math.round(
        challanItems.reduce((sum, item) => sum + (item.amount || 0), 0) * 100,
      ) / 100;
    const challanCount = challanItems.length;
    const legalFeeTotal = getLegalFee(challanSubtotal, vehicleNumber);
    const discountAmount = Math.round(challanSubtotal * DISCOUNT_PERCENTAGE / 100 * 100) / 100;
    const finalAmount = Math.round((challanSubtotal - discountAmount) * 100) / 100;
    const totalPayable =
      Math.round((finalAmount + legalFeeTotal) * 100) / 100;

    this.logger.log(
      `Pricing: subtotal=₹${challanSubtotal}, discount=₹${discountAmount}, legalFee=₹${legalFeeTotal}, challanFinal=₹${finalAmount}, totalPayable=₹${totalPayable}`,
    );

    return {
      challanSubtotal,
      challanCount,
      legalFeeTotal,
      grossAmount: challanSubtotal,
      discountAmount,
      finalAmount,
      totalPayable,
      appliedRule: null,
      items: challanItems,
    };
  }

  // ── Admin: discount rule CRUD (dormant in current pricing model) ────────────

  async getActiveRules() {
    const now = new Date();
    return this.prisma.discountRule.findMany({
      where: {
        isActive: true,
        validFrom: { lte: now },
        OR: [{ validUntil: null }, { validUntil: { gte: now } }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRule(data: {
    name: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    maxDiscount?: number;
    minOrderAmount?: number;
    validFrom?: Date;
    validUntil?: Date;
  }) {
    return this.prisma.discountRule.create({
      data: { ...data, validFrom: data.validFrom ?? new Date() },
    });
  }

  async updateRule(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      discountType: DiscountType;
      discountValue: number;
      maxDiscount: number;
      minOrderAmount: number;
      isActive: boolean;
      validUntil: Date;
    }>,
  ) {
    return this.prisma.discountRule.update({ where: { id }, data });
  }
}
