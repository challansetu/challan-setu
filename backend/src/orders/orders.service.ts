import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CartsService } from '../carts/carts.service';
import { Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';

import { randomBytes } from 'crypto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cartsService: CartsService,
  ) {}

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = randomBytes(3).toString('hex').toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  async createOrder(userId: string, dto: CreateOrderDto = {}, req?: any) {
    // Get cart with pricing
    const { cart, pricing } = await this.cartsService.getCartWithPricing(userId);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    if (pricing.totalPayable <= 0) {
      throw new BadRequestException('Invalid order amount');
    }

    const vehicleNumber = cart.items[0]?.challan?.vehicleNumber ?? null;

    // Create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        cartId: cart.id,
        orderNumber: this.generateOrderNumber(),
        grossAmount: pricing.challanSubtotal,
        discountAmount: 0,
        finalAmount: pricing.totalPayable,
        itemCount: cart.items.length,
        status: 'CREATED',
        pricingSnapshot: pricing as unknown as Prisma.InputJsonValue,
        vehicleNumber,
        discountPercent: 0,
        platformFee: pricing.legalFeeTotal,
      },
      include: {
        cart: {
          include: {
            items: { include: { challan: { include: { offences: true } } } },
          },
        },
      },
    });

    // Create immutable order line items
    if (cart.items.length > 0) {
      await this.prisma.orderItem.createMany({
        data: cart.items.map((item: any) => ({
          orderId: order.id,
          challanId: item.challanId,
          challanNo: item.challan.challanNo,
          amount: item.amount,
        })),
      });
    }

    // Record Safe Driving Promise if accepted
    if (dto.promiseAccepted) {
      await this.prisma.safeDrivingPromise.create({
        data: {
          userId,
          orderId: order.id,
          ipAddress: req?.ip ?? req?.headers?.['x-forwarded-for'] ?? null,
          userAgent: req?.headers?.['user-agent'] ?? null,
          promiseVersion: 1,
        },
      });
      this.logger.log(`Safe Driving Promise recorded for order ${order.orderNumber}`);
    }

    // Mark cart as checked out
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { status: 'CHECKED_OUT' },
    });

    this.logger.log(`Order created: ${order.orderNumber} for user ${userId}`);

    // Re-fetch with items and promise (created after initial insert)
    return this.getOrderById(order.id);
  }

  async getOrderById(orderId: string, userId?: string) {
    const where: any = { id: orderId };
    if (userId) where.userId = userId;

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        payment: true,
        settlement: true,
        promise: true,
        items: { include: { challan: { include: { offences: true } } } },
        cart: {
          include: {
            items: { include: { challan: { include: { offences: true } } } },
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getOrderByNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        payment: true,
        settlement: true,
        cart: {
          include: {
            items: { include: { challan: { include: { offences: true } } } },
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getUserOrders(userId: string, page: number | string = 1, limit: number | string = 10) {
    page = Math.max(1, Number(page) || 1);
    limit = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { payment: true, settlement: true },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);
    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getAllOrders(page: number | string = 1, limit: number | string = 20) {
    page = Math.max(1, Number(page) || 1);
    limit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { payment: true, settlement: true, user: true },
      }),
      this.prisma.order.count(),
    ]);
    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
