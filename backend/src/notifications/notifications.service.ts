import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  /**
   * Send SMS notification. In production, integrate with SMS provider
   * (MSG91, Twilio, etc.)
   */
  async sendSms(phone: string, message: string): Promise<void> {
    this.logger.log(`SMS to ${phone}: ${message}`);
    // TODO: Integrate with actual SMS provider
  }

  /**
   * Send payment success notification
   */
  async notifyPaymentSuccess(phone: string, orderNumber: string, amount: number) {
    await this.sendSms(
      phone,
      `Payment of ₹${amount} received for order ${orderNumber}. Your challan settlement is being processed.`,
    );
  }

  /**
   * Send settlement update notification
   */
  async notifySettlementUpdate(phone: string, orderNumber: string, status: string) {
    await this.sendSms(
      phone,
      `Settlement update for order ${orderNumber}: ${status}`,
    );
  }
}
