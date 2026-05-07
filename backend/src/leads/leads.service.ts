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

    // Fire-and-forget: notify Telegram (no challan fetch — website shows it)
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
    if (!token || !chatId) return;

    const ist = lead.createdAt.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
    });

    const text = [
      `🚗 *New Lead*`,
      `👤 ${lead.fullName}`,
      `📱 ${lead.mobileNumber}`,
      `🔢 ${lead.vehicleNumber}`,
      `📍 ${lead.city ?? '—'} | ${lead.source}`,
      `🕐 ${ist} IST`,
      `🆔 \`${lead.id}\``,
    ].join('\n');

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });
  }
}
