import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createLead(dto: CreateLeadDto) {
    const lead = await this.prisma.lead.create({
      data: {
        fullName: dto.fullName,
        mobileNumber: dto.mobileNumber,
        vehicleNumber: dto.vehicleNumber,
        consentAccepted: dto.consentAccepted,
        consentTimestamp: new Date(),
        source: dto.source ?? 'homepage',
        city: dto.city ?? null,
        leadStatus: 'new',
      },
    });

    this.notifyTelegram(lead).catch((err) =>
      this.logger.warn(`Telegram notify failed: ${err?.message}`),
    );

    return {
      success: true,
      leadId: lead.id,
      leadStatus: lead.leadStatus,
      createdAt: lead.createdAt,
    };
  }

  private async notifyTelegram(lead: {
    id: string;
    fullName: string;
    mobileNumber: string;
    vehicleNumber: string;
    source: string;
    city: string | null;
    createdAt: Date;
  }) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      this.logger.warn(`Telegram skipped: token=${!!token} chatId=${!!chatId}`);
      return;
    }

    const ist = lead.createdAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const isRecovery = lead.source === 'vehicle_recovery';

    const text = [
      isRecovery ? `🚨 <b>Vehicle Recovery Lead</b>` : `🚗 <b>New Lead</b>`,
      `👤 ${lead.fullName}`,
      `📱 ${lead.mobileNumber}`,
      `🔢 ${lead.vehicleNumber}`,
      `📍 ${lead.city ?? '—'} | ${lead.source}`,
      `🕐 ${ist} IST`,
      `🆔 <code>${lead.id}</code>`,
    ].join('\n');

    this.logger.log(`Sending Telegram notification for lead ${lead.id} source=${lead.source}`);

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });

    if (!res.ok) {
      const body = await res.text();
      this.logger.warn(`Telegram API error: status=${res.status} body=${body}`);
    } else {
      this.logger.log(`Telegram notification sent successfully for lead ${lead.id}`);
    }
  }
}
