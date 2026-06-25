import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentStatus, Prisma } from '@prisma/client';
import { createHmac, timingSafeEqual } from 'crypto';
import Razorpay = require('razorpay');
import { PrismaService } from '../config/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

// A CREATED/AUTHORIZED payment is "stuck" if it's older than this and still not
// final — the reconciliation job re-queries Razorpay for it.
const RECONCILE_MIN_AGE_MS = 2 * 60 * 1000; // 2 min (give the callback/webhook a chance first)
const RECONCILE_MAX_AGE_MS = 2 * 24 * 60 * 60 * 1000; // stop chasing after 2 days

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private client: Razorpay | null = null;

  constructor(private readonly prisma: PrismaService) {}

  // ─── Config ────────────────────────────────────────────────────────────────────
  private get keyId(): string { return process.env.RAZORPAY_KEY_ID ?? ''; }
  private get keySecret(): string { return process.env.RAZORPAY_KEY_SECRET ?? ''; }
  private get webhookSecret(): string { return process.env.RAZORPAY_WEBHOOK_SECRET ?? ''; }

  private isConfigured(value: string): boolean {
    if (!value) return false;
    const lower = value.toLowerCase();
    return (
      !lower.includes('xxxxxxxx') &&
      !lower.startsWith('replace_with') &&
      !lower.startsWith('placehol')
    );
  }

  private get configured(): boolean {
    return this.isConfigured(this.keyId) && this.isConfigured(this.keySecret);
  }

  private getClient(): Razorpay {
    if (!this.configured) {
      this.logger.error('Razorpay keys not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET).');
      throw new InternalServerErrorException('Payment gateway is not configured. Please try again later.');
    }
    if (!this.client) {
      this.client = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });
    }
    return this.client;
  }

  // ─── State machine ───────────────────────────────────────────────────────────────
  // Only valid forward transitions are allowed. PAID is final (never downgraded).
  // FAILED → AUTHORIZED/PAID is permitted to handle late authorization (#10).
  private canTransition(from: PaymentStatus, to: PaymentStatus): boolean {
    if (from === to) return false;
    const allowed: Record<PaymentStatus, PaymentStatus[]> = {
      CREATED: ['AUTHORIZED', 'PAID', 'FAILED', 'VERIFICATION_FAILED', 'FLAGGED'],
      AUTHORIZED: ['PAID', 'FAILED', 'FLAGGED'],
      VERIFICATION_FAILED: ['PAID', 'FLAGGED'], // can resolve once the API confirms
      FAILED: ['AUTHORIZED', 'PAID'], // late authorization
      FLAGGED: [], // manual review only
      PAID: [], // final success — never downgrade
    };
    return allowed[from]?.includes(to) ?? false;
  }

  private async applyStatus(
    orderId: string,
    current: PaymentStatus,
    to: PaymentStatus,
    extra: Prisma.PaymentUpdateInput = {},
  ): Promise<boolean> {
    if (!this.canTransition(current, to)) {
      this.logger.log(`Skip transition ${current} → ${to} for order ${orderId} (not allowed / no-op)`);
      return false;
    }
    await this.prisma.payment.update({ where: { razorpayOrderId: orderId }, data: { status: to, ...extra } });
    this.logger.log(`Order ${orderId}: ${current} → ${to}`);
    return true;
  }

  // ─── Create order ──────────────────────────────────────────────────────────────
  async createOrder(dto: CreateOrderDto) {
    const client = this.getClient();
    const amountPaise = Math.round(dto.amount * 100);

    let order: { id: string; amount: number | string; currency: string };
    try {
      order = (await client.orders.create({
        amount: amountPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: { name: dto.name, phone: dto.phone, ...(dto.note ? { note: dto.note } : {}) },
      })) as any;
    } catch (err: any) {
      this.logger.error(`Razorpay order create failed: ${err?.message ?? err}`);
      throw new InternalServerErrorException('Could not start payment. Please try again.');
    }

    await this.prisma.payment.create({
      data: {
        razorpayOrderId: order.id,
        amount: amountPaise,
        currency: 'INR',
        status: 'CREATED',
        customerName: dto.name,
        customerPhone: dto.phone,
        customerEmail: dto.email ?? null,
        note: dto.note ?? null,
      },
    });

    this.logger.log(`Created Razorpay order ${order.id} for ₹${dto.amount}`);

    return {
      keyId: this.keyId,
      orderId: order.id,
      amount: amountPaise,
      currency: 'INR',
      name: dto.name,
      phone: dto.phone,
      email: dto.email ?? null,
    };
  }

  // ─── Verify checkout callback ───────────────────────────────────────────────────
  // Signature is verified first (cryptographic proof the callback came from our
  // checkout). We then fetch the payment from Razorpay's API and only mark PAID if
  // it is actually captured AND amount/currency/order match (#7, #13).
  async verifyPayment(dto: VerifyPaymentDto) {
    const payment = await this.prisma.payment.findUnique({ where: { razorpayOrderId: dto.razorpayOrderId } });
    if (!payment) {
      this.logger.warn(`Verify: no record for order ${dto.razorpayOrderId}`);
      throw new NotFoundException('Unknown payment order.');
    }

    // Already resolved by a webhook/reconciliation — return current truth.
    if (payment.status === 'PAID') return { success: true, status: 'PAID' as const, orderId: payment.razorpayOrderId };

    const expected = createHmac('sha256', this.keySecret)
      .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest('hex');

    if (!this.safeEqual(expected, dto.razorpaySignature)) {
      // #6 — signature mismatch: never mark paid; flag + log for review.
      this.logger.error(
        `SIGNATURE MISMATCH order=${dto.razorpayOrderId} payment=${dto.razorpayPaymentId} sig=${dto.razorpaySignature}`,
      );
      await this.applyStatus(dto.razorpayOrderId, payment.status, 'VERIFICATION_FAILED', {
        razorpayPaymentId: dto.razorpayPaymentId,
        failureReason: 'signature_mismatch',
      });
      throw new BadRequestException('Payment verification failed. Please contact support with your order ID.');
    }

    // Signature OK — confirm against the Razorpay API.
    let rp: any;
    try {
      rp = await this.getClient().payments.fetch(dto.razorpayPaymentId);
    } catch (err: any) {
      // API unreachable — do NOT claim paid. Leave pending; webhook/reconciliation will finalize.
      this.logger.warn(`Verify: Razorpay API fetch failed for ${dto.razorpayPaymentId}: ${err?.message ?? err}`);
      return { success: false, status: 'PENDING' as const, orderId: payment.razorpayOrderId };
    }

    const mismatch = this.matchReason(payment, rp);
    if (mismatch) {
      this.logger.error(`Verify: MISMATCH order=${dto.razorpayOrderId} — ${mismatch}`);
      await this.applyStatus(dto.razorpayOrderId, payment.status, 'FLAGGED', {
        razorpayPaymentId: dto.razorpayPaymentId,
        flagReason: mismatch,
      });
      throw new BadRequestException('Payment could not be confirmed. Our team will review it — please contact support with your order ID.');
    }

    return this.resolveFromRazorpayStatus(payment.razorpayOrderId, payment.status, rp, 'callback');
  }

  // ─── Webhook ─────────────────────────────────────────────────────────────────────
  async handleWebhook(rawBody: Buffer | undefined, signature: string | undefined, eventId: string | undefined) {
    if (!this.isConfigured(this.webhookSecret)) {
      this.logger.error('Webhook received but RAZORPAY_WEBHOOK_SECRET is not configured.');
      throw new InternalServerErrorException('Webhook not configured.');
    }
    if (!rawBody || !signature) throw new BadRequestException('Missing webhook body or signature.');

    // #19 — verify against the RAW body.
    const expected = createHmac('sha256', this.webhookSecret).update(rawBody).digest('hex');
    if (!this.safeEqual(expected, signature)) {
      this.logger.warn('Webhook signature mismatch — ignoring.');
      throw new BadRequestException('Invalid webhook signature.');
    }

    let event: any;
    try {
      event = JSON.parse(rawBody.toString('utf8'));
    } catch {
      throw new BadRequestException('Invalid webhook payload.');
    }

    const eventType: string = event?.event ?? 'unknown';

    // #11 — idempotency via x-razorpay-event-id. First writer wins; duplicates short-circuit.
    if (eventId) {
      try {
        await this.prisma.webhookEvent.create({ data: { eventId, eventType, payload: event } });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
          this.logger.log(`Duplicate webhook ${eventId} (${eventType}) — already processed.`);
          return { status: 'duplicate' };
        }
        throw err;
      }
    } else {
      this.logger.warn(`Webhook ${eventType} missing x-razorpay-event-id — processing without dedupe.`);
    }

    this.logger.log(`Webhook: ${eventType}`);

    try {
      if (eventType.startsWith('refund.')) {
        await this.handleRefundEvent(eventType, event);
      } else {
        await this.handlePaymentEvent(eventType, event);
      }
    } catch (err: any) {
      // Don't 500 the webhook on a processing error — Razorpay would just retry.
      // The raw payload is stored, and reconciliation will recover.
      this.logger.error(`Webhook ${eventType} processing error: ${err?.message ?? err}`);
    }

    return { status: 'ok' };
  }

  private async handlePaymentEvent(eventType: string, event: any) {
    const paymentEntity = event?.payload?.payment?.entity;
    const orderEntity = event?.payload?.order?.entity;
    const orderId: string | undefined = paymentEntity?.order_id ?? orderEntity?.id;
    if (!orderId) return;

    const payment = await this.prisma.payment.findUnique({ where: { razorpayOrderId: orderId } });
    if (!payment) {
      this.logger.warn(`Webhook for unknown order ${orderId}`);
      return;
    }

    // #13 — verify amounts before any "paid" transition.
    const entityForMatch = paymentEntity ?? orderEntity;
    if (entityForMatch && (eventType === 'payment.captured' || eventType === 'payment.authorized' || eventType === 'order.paid')) {
      const mismatch = this.matchReason(payment, entityForMatch, !paymentEntity);
      if (mismatch) {
        this.logger.error(`Webhook MISMATCH order=${orderId} — ${mismatch}`);
        await this.applyStatus(orderId, payment.status, 'FLAGGED', { flagReason: mismatch, razorpayPaymentId: paymentEntity?.id ?? payment.razorpayPaymentId });
        return;
      }
    }

    switch (eventType) {
      case 'payment.captured':
      case 'order.paid':
        await this.applyStatus(orderId, payment.status, 'PAID', {
          razorpayPaymentId: paymentEntity?.id ?? payment.razorpayPaymentId,
          verifiedVia: payment.verifiedVia ?? 'webhook',
          lastSyncedAt: new Date(),
        });
        break;
      case 'payment.authorized':
        await this.applyStatus(orderId, payment.status, 'AUTHORIZED', {
          razorpayPaymentId: paymentEntity?.id ?? payment.razorpayPaymentId,
          lastSyncedAt: new Date(),
        });
        break;
      case 'payment.failed':
        await this.applyStatus(orderId, payment.status, 'FAILED', {
          razorpayPaymentId: paymentEntity?.id ?? payment.razorpayPaymentId,
          failureReason: paymentEntity?.error_description ?? 'payment_failed',
        });
        break;
      default:
        this.logger.log(`Unhandled payment webhook: ${eventType}`);
    }
  }

  private async handleRefundEvent(eventType: string, event: any) {
    const refundEntity = event?.payload?.refund?.entity;
    const paymentId: string | undefined = refundEntity?.payment_id;
    if (!paymentId) return;

    const payment = await this.prisma.payment.findFirst({ where: { razorpayPaymentId: paymentId } });
    if (!payment) {
      this.logger.warn(`Refund webhook for unknown payment ${paymentId}`);
      return;
    }

    const refundedAmount: number | undefined = refundEntity?.amount;
    const isPartial = typeof refundedAmount === 'number' && refundedAmount < payment.amount;
    const refundStatus =
      eventType === 'refund.failed' ? 'failed' : isPartial ? 'partial' : 'processed';

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        refundStatus,
        refundId: refundEntity?.id ?? payment.refundId,
        refundedAmount: refundedAmount ?? payment.refundedAmount,
      },
    });
    this.logger.log(`Refund ${refundStatus} for payment ${paymentId} (order ${payment.razorpayOrderId})`);
  }

  // ─── Status (frontend polling + self-heal) ───────────────────────────────────────
  async getStatus(orderId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { razorpayOrderId: orderId } });
    if (!payment) throw new NotFoundException('Unknown payment order.');

    // Self-heal: if still unresolved, try a live sync (best-effort).
    if ((payment.status === 'CREATED' || payment.status === 'AUTHORIZED') && this.configured) {
      try {
        const synced = await this.syncFromRazorpay(payment.razorpayOrderId, payment.status);
        return { orderId, status: synced ?? payment.status, amount: payment.amount / 100 };
      } catch {
        /* fall through to stored status */
      }
    }
    return { orderId, status: payment.status, amount: payment.amount / 100 };
  }

  // ─── Reconciliation cron (#5, #17) ────────────────────────────────────────────────
  @Cron(CronExpression.EVERY_5_MINUTES)
  async reconcilePending() {
    if (!this.configured) return;
    const now = Date.now();
    const stuck = await this.prisma.payment.findMany({
      where: {
        status: { in: ['CREATED', 'AUTHORIZED'] },
        createdAt: { lt: new Date(now - RECONCILE_MIN_AGE_MS), gt: new Date(now - RECONCILE_MAX_AGE_MS) },
      },
      take: 50,
      orderBy: { createdAt: 'asc' },
    });
    if (stuck.length === 0) return;
    this.logger.log(`Reconciling ${stuck.length} pending payment(s)…`);
    for (const p of stuck) {
      try {
        await this.syncFromRazorpay(p.razorpayOrderId, p.status);
      } catch (err: any) {
        this.logger.warn(`Reconcile failed for ${p.razorpayOrderId}: ${err?.message ?? err}`);
      }
    }
  }

  // Queries Razorpay for the true state of an order and applies it. Returns the
  // resulting status (or null if no change).
  private async syncFromRazorpay(orderId: string, current: PaymentStatus): Promise<PaymentStatus | null> {
    const client = this.getClient();
    const order: any = await client.orders.fetch(orderId);
    const payments: any = await client.orders.fetchPayments(orderId);
    const items: any[] = payments?.items ?? [];

    const captured = items.find((i) => i.status === 'captured');
    const authorized = items.find((i) => i.status === 'authorized');

    if (order?.status === 'paid' || captured) {
      const entity = captured ?? order;
      const mismatch = this.matchReason({ amount: order?.amount ?? entity?.amount, currency: 'INR', razorpayOrderId: orderId } as any, entity, !captured);
      if (mismatch) {
        await this.applyStatus(orderId, current, 'FLAGGED', { flagReason: mismatch, lastSyncedAt: new Date() });
        return 'FLAGGED';
      }
      await this.applyStatus(orderId, current, 'PAID', {
        razorpayPaymentId: captured?.id,
        verifiedVia: 'reconciliation',
        lastSyncedAt: new Date(),
      });
      return 'PAID';
    }

    if (authorized) {
      await this.applyStatus(orderId, current, 'AUTHORIZED', { razorpayPaymentId: authorized.id, lastSyncedAt: new Date() });
      return 'AUTHORIZED';
    }

    if (items.length > 0 && items.every((i) => i.status === 'failed')) {
      await this.applyStatus(orderId, current, 'FAILED', { failureReason: 'all_attempts_failed', lastSyncedAt: new Date() });
      return 'FAILED';
    }

    // No conclusive state yet — just record that we checked.
    await this.prisma.payment.update({ where: { razorpayOrderId: orderId }, data: { lastSyncedAt: new Date() } });
    return null;
  }

  // ─── Shared resolution from a Razorpay payment entity ─────────────────────────────
  private async resolveFromRazorpayStatus(orderId: string, current: PaymentStatus, rp: any, via: string) {
    switch (rp?.status) {
      case 'captured':
        await this.applyStatus(orderId, current, 'PAID', { razorpayPaymentId: rp.id, verifiedVia: via, lastSyncedAt: new Date() });
        return { success: true, status: 'PAID' as const, orderId };
      case 'authorized':
        await this.applyStatus(orderId, current, 'AUTHORIZED', { razorpayPaymentId: rp.id, lastSyncedAt: new Date() });
        return { success: false, status: 'AUTHORIZED' as const, orderId };
      case 'failed':
        await this.applyStatus(orderId, current, 'FAILED', { razorpayPaymentId: rp.id, failureReason: rp?.error_description ?? 'payment_failed' });
        return { success: false, status: 'FAILED' as const, orderId };
      default:
        return { success: false, status: 'PENDING' as const, orderId };
    }
  }

  // Returns a human-readable mismatch reason, or null if everything matches.
  // `isOrderEntity` true when comparing against an order entity (no order_id field).
  private matchReason(
    payment: { amount: number; currency: string; razorpayOrderId: string },
    entity: any,
    isOrderEntity = false,
  ): string | null {
    if (typeof entity?.amount === 'number' && entity.amount !== payment.amount) {
      return `amount_mismatch: expected ${payment.amount}, got ${entity.amount}`;
    }
    if (entity?.currency && entity.currency !== payment.currency) {
      return `currency_mismatch: expected ${payment.currency}, got ${entity.currency}`;
    }
    if (!isOrderEntity && entity?.order_id && entity.order_id !== payment.razorpayOrderId) {
      return `order_mismatch: expected ${payment.razorpayOrderId}, got ${entity.order_id}`;
    }
    return null;
  }

  private safeEqual(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  }
}
