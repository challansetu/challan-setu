import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { ChallansService } from '../challans/challans.service';
import { PricingService, PricingBreakdown } from '../pricing/pricing.service';
import { ChallanStatus } from '@prisma/client';
import { UpdateCartDto } from './dto/update-cart.dto';
import { classifyRegion } from '../challans/challan-region.util';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CartsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly challansService: ChallansService,
    private readonly pricingService: PricingService,
  ) {}

  async getOrCreateActiveCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        items: {
          include: { challan: { include: { offences: true } } },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: { challan: { include: { offences: true } } },
          },
        },
      });
    }

    return cart;
  }

  async updateCart(userId: string, dto: UpdateCartDto) {
    // Validate challan IDs
    const challans = await this.challansService.getChallansByIds(dto.challanIds);

    if (challans.length !== dto.challanIds.length) {
      throw new BadRequestException('One or more challan IDs are invalid');
    }

    // Ensure no PAID challans are included (by status field)
    const paidChallans = challans.filter((c) => c.status === ChallanStatus.PAID);
    if (paidChallans.length > 0) {
      throw new BadRequestException(
        `Cannot add paid challans to cart: ${paidChallans.map((c) => c.challanNo).join(', ')}`,
      );
    }

    // Cross-order check: block challanNos that were already paid in a completed order
    const challanNos = challans.map((c) => c.challanNo);
    const alreadyPaid = await this.prisma.orderItem.findMany({
      where: {
        challanNo: { in: challanNos },
        order: { status: { in: ['PAYMENT_COMPLETED', 'SETTLED'] } },
      },
      select: { challanNo: true },
    });
    if (alreadyPaid.length > 0) {
      const nos = [...new Set(alreadyPaid.map((i) => i.challanNo))].join(', ');
      throw new BadRequestException(
        `These challans have already been paid: ${nos}`,
      );
    }

    // Enforce service-area restriction — only Delhi, Gurgaon, Noida challans can be paid
    const unsupportedChallans = challans.filter((c) => {
      const rawData = (c.rawData as Record<string, unknown>) ?? {};
      return !classifyRegion({ state: c.state, location: c.location, courtName: c.courtName, rawData }).isSupported;
    });
    if (unsupportedChallans.length > 0) {
      throw new BadRequestException(
        `Service not available for challans outside Delhi, Gurgaon, and Noida: ${unsupportedChallans.map((c) => c.challanNo).join(', ')}`,
      );
    }

    // Get or create cart
    const cart = await this.getOrCreateActiveCart(userId);

    // Clear existing items and add new ones
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    if (dto.challanIds.length > 0) {
      await this.prisma.cartItem.createMany({
        data: challans.map((c) => ({
          cartId: cart.id,
          challanId: c.id,
          amount: c.amount,
        })),
      });
    }

    // Return updated cart with pricing
    return this.getCartWithPricing(userId);
  }

  async getCartWithPricing(userId: string): Promise<{
    cart: any;
    pricing: PricingBreakdown;
  }> {
    const cart = await this.prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        items: {
          include: { challan: { include: { offences: true } } },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return {
        cart: cart || null,
        pricing: {
          challanSubtotal: 0,
          challanCount: 0,
          legalFeeTotal: 0,
          grossAmount: 0,
          discountAmount: 0,
          finalAmount: 0,
          totalPayable: 0,
          appliedRule: null,
          items: [],
        },
      };
    }

    const vehicleNumber = cart.items[0]?.challan?.vehicleNumber ?? undefined;
    const pricing = this.pricingService.calculatePricing(
      cart.items.map((item) => ({
        challanId: item.challanId,
        challanNo: item.challan.challanNo,
        amount: item.amount,
      })),
      vehicleNumber,
    );

    return { cart, pricing };
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return { message: 'Cart cleared' };
  }
}
