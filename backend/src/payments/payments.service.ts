import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { RedisService } from '../config/redis.service';
import { RazorpayService } from './razorpay.service';
import { OrdersService } from '../orders/orders.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly razorpayService: RazorpayService,
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * Mark all challans in an order as PAID and bust their Redis cache.
   * Called after every confirmed payment to prevent re-payment.
   */
  private async markChallansAsPaid(orderId: string): Promise<void> {
    const items = await this.prisma.orderItem.findMany({
      where: { orderId },
      include: { challan: { select: { id: true, vehicleNumber: true, normalizedVehicleNumber: true } } },
    });

    if (items.length === 0) return;

    // Mark every challan in the order as PAID
    await this.prisma.challan.updateMany({
      where: { id: { in: items.map((i) => i.challan.id) } },
      data: { status: 'PAID' },
    });

    // Bust Redis cache for each vehicle so the next search returns fresh data
    const vehicleKeys = new Set(
      items.map((i) => `challan:${i.challan.normalizedVehicleNumber ?? i.challan.vehicleNumber.toUpperCase().replace(/[^A-Z0-9]/g, '')}`),
    );
    for (const key of vehicleKeys) {
      await this.redis.del(key);
    }

    this.logger.log(`Marked ${items.length} challan(s) as PAID for order ${orderId} and busted ${vehicleKeys.size} cache key(s)`);
  }

  async initiatePayment(userId: string, dto: InitiatePaymentDto) {
    const order = await this.ordersService.getOrderById(dto.orderId, userId);

    // PAYMENT_PENDING is allowed: user may have navigated away before completing
    // a previous attempt. A new Razorpay order will be created and the existing
    // payment record updated. The CAPTURED guard below prevents double-charging.
    if (
      order.status !== 'CREATED' &&
      order.status !== 'PAYMENT_FAILED' &&
      order.status !== 'PAYMENT_PENDING'
    ) {
      throw new BadRequestException(`Order is not in a payable state: ${order.status}`);
    }

    // Check if payment already exists
    const existingPayment = await this.prisma.payment.findUnique({
      where: { orderId: order.id },
    });

    if (existingPayment && existingPayment.status === 'CAPTURED') {
      throw new BadRequestException('Payment already completed for this order');
    }

    // Validate amount is positive
    if (!order.finalAmount || order.finalAmount <= 0) {
      throw new BadRequestException('Invalid order amount');
    }

    this.logger.log(
      `Initiating payment for order ${order.orderNumber}: ₹${order.finalAmount}`,
    );

    // Create Razorpay order (retry once on transient failures)
    let razorpayOrder: any;
    const maxAttempts = 2;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        razorpayOrder = await this.razorpayService.createOrder({
          amount: order.finalAmount,
          receipt: order.orderNumber,
          notes: {
            orderId: order.id,
            userId,
            orderNumber: order.orderNumber,
          },
        });
        break;
      } catch (error: any) {
        const razorpayDesc = error?.error?.description;
        const errDetail = razorpayDesc || error?.message || 'Unknown error';
        const statusCode = error?.statusCode || error?.error?.code || error?.response?.status;
        this.logger.error(
          `Razorpay order creation failed for ${order.orderNumber} [attempt=${attempt}/${maxAttempts}, status=${statusCode}]: ${errDetail}`,
          error?.stack,
        );
        if (attempt < maxAttempts) {
          this.logger.log(`Retrying Razorpay order creation for ${order.orderNumber}...`);
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        throw new BadRequestException(
          `Payment gateway error: ${errDetail}`,
        );
      }
    }

    // Create or update payment record
    const payment = existingPayment
      ? await this.prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            razorpayOrderId: razorpayOrder.id,
            amount: order.finalAmount,
            status: 'CREATED',
            attempts: { increment: 1 },
          },
        })
      : await this.prisma.payment.create({
          data: {
            orderId: order.id,
            razorpayOrderId: razorpayOrder.id,
            amount: order.finalAmount,
            status: 'CREATED',
            attempts: 1,
          },
        });

    // Update order status
    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAYMENT_PENDING' },
    });

    this.logger.log(
      `Payment initiated: ${payment.id}, Razorpay order: ${razorpayOrder.id}`,
    );

    return {
      paymentId: payment.id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.finalAmount,
      currency: 'INR',
      orderNumber: order.orderNumber,
    };
  }

  async verifyPayment(userId: string, dto: VerifyPaymentDto) {
    // Find payment by Razorpay order ID
    const payment = await this.prisma.payment.findUnique({
      where: { razorpayOrderId: dto.razorpayOrderId },
      include: { order: true },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.order.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    // IDEMPOTENCY: If already captured, return success immediately
    if (payment.status === 'CAPTURED') {
      this.logger.log(
        `Payment already verified for order ${payment.order.orderNumber} (idempotent)`,
      );
      return {
        success: true,
        orderId: payment.orderId,
        orderNumber: payment.order.orderNumber,
        paymentId: payment.razorpayPaymentId,
      };
    }

    // Verify signature server-side (CRITICAL SECURITY CHECK)
    const isValid = this.razorpayService.verifySignature({
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      razorpaySignature: dto.razorpaySignature,
    });

    if (!isValid) {
      this.logger.error(
        `Invalid payment signature for order ${payment.order.orderNumber}`,
      );

      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', errorDescription: 'Signature verification failed' },
      });

      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'PAYMENT_FAILED' },
      });

      throw new BadRequestException('Payment verification failed');
    }

    // Update payment record
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: dto.razorpayPaymentId,
        razorpaySignature: dto.razorpaySignature,
        status: 'CAPTURED',
        paidAt: new Date(),
      },
    });

    // Update order status
    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'PAYMENT_COMPLETED' },
    });

    // Mark challans as PAID and bust cache so they can't be re-purchased
    await this.markChallansAsPaid(payment.orderId);

    // Create settlement record (idempotent - upsert to avoid duplicate errors)
    await this.prisma.settlement.upsert({
      where: { orderId: payment.orderId },
      update: {}, // no-op if already exists
      create: {
        orderId: payment.orderId,
        status: 'PENDING',
      },
    });

    this.logger.log(
      `Payment verified for order ${payment.order.orderNumber}: ${dto.razorpayPaymentId}`,
    );

    return {
      success: true,
      orderId: payment.orderId,
      orderNumber: payment.order.orderNumber,
      paymentId: dto.razorpayPaymentId,
    };
  }

  async getPaymentStatus(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payment: {
          select: {
            status: true,
            razorpayPaymentId: true,
            paidAt: true,
            method: true,
            errorCode: true,
            errorDescription: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Access denied');

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderStatus: order.status,
      amount: order.finalAmount,
      paymentStatus: order.payment?.status ?? null,
      paymentId: order.payment?.razorpayPaymentId ?? null,
      paidAt: order.payment?.paidAt ?? null,
      method: order.payment?.method ?? null,
      errorCode: order.payment?.errorCode ?? null,
      updatedAt: order.updatedAt,
    };
  }

  async handleWebhook(body: string, signature: string) {
    // Verify webhook signature
    const isValid = this.razorpayService.verifyWebhookSignature(body, signature);
    if (!isValid) {
      this.logger.error('Invalid webhook signature');
      throw new BadRequestException('Invalid webhook signature');
    }

    // Log raw webhook immediately — never lose an event
    let webhookRecord: { id: string } | null = null;
    try {
      const parsed = JSON.parse(body);
      webhookRecord = await this.prisma.webhookEvent.create({
        data: {
          source: 'razorpay',
          event: parsed?.event ?? 'unknown',
          payload: parsed,
          status: 'PENDING',
        },
        select: { id: true },
      });
    } catch { /* logging is non-blocking */ }

    let event: any;
    try {
      event = JSON.parse(body);
    } catch {
      this.logger.error('Webhook body is not valid JSON');
      throw new BadRequestException('Invalid webhook body');
    }

    if (!event?.event) {
      this.logger.warn('Webhook event missing event type');
      return { status: 'ok' };
    }

    this.logger.log(`Webhook event: ${event.event}`);

    switch (event.event) {
      case 'payment.captured': {
        const entity = event.payload?.payment?.entity;
        if (!entity?.id || !entity?.order_id) {
          this.logger.warn('Webhook payment.captured missing entity fields');
          break;
        }

        const razorpayPaymentId = entity.id;
        const razorpayOrderId = entity.order_id;

        const payment = await this.prisma.payment.findUnique({
          where: { razorpayOrderId },
        });

        if (payment && payment.status !== 'CAPTURED') {
          await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
              razorpayPaymentId,
              status: 'CAPTURED',
              paidAt: new Date(),
              method: entity.method,
              webhookPayload: event.payload?.payment?.entity ?? null,
            },
          });

          await this.prisma.order.update({
            where: { id: payment.orderId },
            data: { status: 'PAYMENT_COMPLETED' },
          });

          // Mark challans as PAID and bust cache
          await this.markChallansAsPaid(payment.orderId);

          // Create settlement record (idempotent upsert)
          await this.prisma.settlement.upsert({
            where: { orderId: payment.orderId },
            update: {},
            create: { orderId: payment.orderId, status: 'PENDING' },
          });

          this.logger.log(
            `Webhook: payment captured for order ${payment.orderId}: ${razorpayPaymentId}`,
          );
        }
        break;
      }

      case 'payment.failed': {
        const entity = event.payload?.payment?.entity;
        if (!entity?.order_id) {
          this.logger.warn('Webhook payment.failed missing order_id');
          break;
        }

        const razorpayOrderId = entity.order_id;
        const payment = await this.prisma.payment.findUnique({
          where: { razorpayOrderId },
        });

        if (payment && payment.status !== 'CAPTURED') {
          await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'FAILED',
              errorCode: entity.error_code,
              errorDescription: entity.error_description,
            },
          });

          await this.prisma.order.update({
            where: { id: payment.orderId },
            data: { status: 'PAYMENT_FAILED' },
          });
        }
        break;
      }
    }

    if (webhookRecord) {
      await this.prisma.webhookEvent.update({
        where: { id: webhookRecord.id },
        data: { status: 'PROCESSED', processedAt: new Date() },
      }).catch(() => {});
    }

    return { status: 'ok' };
  }
}
