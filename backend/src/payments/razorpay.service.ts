import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Razorpay = require('razorpay');
import { createHmac } from 'crypto';

@Injectable()
export class RazorpayService {
  private readonly logger = new Logger(RazorpayService.name);
  private readonly razorpay: any;
  private readonly keySecret: string;
  private readonly webhookSecret: string;

  constructor(private readonly configService: ConfigService) {
    const keyId = this.configService.getOrThrow<string>('RAZORPAY_KEY_ID');
    this.keySecret = this.configService.getOrThrow<string>('RAZORPAY_KEY_SECRET');

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: this.keySecret,
    });

    // Webhook secret is optional for local dev - warn if missing
    this.webhookSecret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET') || '';
    if (!this.webhookSecret) {
      this.logger.warn(
        'RAZORPAY_WEBHOOK_SECRET not set - webhooks will be rejected. Set it in .env for production.',
      );
    }

    const isLive = keyId.startsWith('rzp_live_');
    this.logger.log(
      `Razorpay initialized in ${isLive ? 'LIVE' : 'TEST'} mode (key: ${keyId.substring(0, 12)}...)`,
    );
  }

  async createOrder(params: {
    amount: number; // in rupees
    currency?: string;
    receipt: string;
    notes?: Record<string, string>;
  }) {
    const amountInPaise = Math.round(params.amount * 100);

    this.logger.log(
      `Creating Razorpay order: ${params.receipt}, amount: ₹${params.amount} (${amountInPaise} paise)`,
    );

    try {
      const order = await this.razorpay.orders.create({
        amount: amountInPaise,
        currency: params.currency || 'INR',
        receipt: params.receipt,
        notes: params.notes || {},
      });

      this.logger.log(
        `Razorpay order created: ${order.id}, amount: ${order.amount} paise, status: ${order.status}`,
      );
      return order;
    } catch (error: any) {
      this.logger.error(
        `Failed to create Razorpay order for ${params.receipt}: ${error?.error?.description || error?.message || error}`,
      );
      throw error;
    }
  }

  /**
   * Verify Razorpay payment signature server-side.
   * CRITICAL: Never trust frontend for amount verification.
   */
  verifySignature(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): boolean {
    const body = `${params.razorpayOrderId}|${params.razorpayPaymentId}`;
    const expectedSignature = createHmac('sha256', this.keySecret)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === params.razorpaySignature;
    if (!isValid) {
      this.logger.error(
        `Signature mismatch for order ${params.razorpayOrderId}, payment ${params.razorpayPaymentId}`,
      );
    }
    return isValid;
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(body: string, signature: string): boolean {
    if (!this.webhookSecret) {
      this.logger.error(
        'Webhook secret not configured - rejecting webhook. Set RAZORPAY_WEBHOOK_SECRET in .env for production.',
      );
      return false;
    }
    if (!signature) {
      this.logger.error('Webhook called without x-razorpay-signature header');
      return false;
    }
    const expectedSignature = createHmac('sha256', this.webhookSecret)
      .update(body)
      .digest('hex');
    return expectedSignature === signature;
  }

  async fetchPayment(paymentId: string) {
    return this.razorpay.payments.fetch(paymentId);
  }
}
