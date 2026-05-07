import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import {
  ChallanProviderService,
  ProviderChallan,
} from '../challans/provider/challan-provider.service';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly challanProvider: ChallanProviderService,
  ) {}

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

    // Fire-and-forget: fetch challans then notify Telegram
    this.notifyWithChallans(lead).catch((err) =>
      this.logger.warn(`Telegram notify failed: ${err?.message}`),
    );

    return {
      success: true,
      leadId: lead.id,
      leadStatus: lead.leadStatus,
      createdAt: lead.createdAt,
    };
  }

  private async notifyWithChallans(lead: {
    id: string;
    fullName: string;
    mobileNumber: string;
    vehicleNumber: string;
    source: string;
    city: string | null;
    createdAt: Date;
  }) {
    // Fetch challan data in parallel — never block the lead response
    let challans: ProviderChallan[] = [];
    try {
      const providerResp = await this.challanProvider.fetchChallans(
        lead.vehicleNumber,
      );
      challans = providerResp.result ?? [];
    } catch (err) {
      this.logger.warn(
        `Could not fetch challans for ${lead.vehicleNumber}: ${err?.message}`,
      );
    }

    await this.notifyTelegram(lead, challans);
  }

  private async notifyTelegram(
    lead: {
      id: string;
      fullName: string;
      mobileNumber: string;
      vehicleNumber: string;
      source: string;
      city: string | null;
      createdAt: Date;
    },
    challans: ProviderChallan[],
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;

    const ist = lead.createdAt.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
    });

    const lines = [
      `🚗 *New Lead — #${lead.id}*`,
      `👤 ${lead.fullName}`,
      `📱 ${lead.mobileNumber}`,
      `🔢 ${lead.vehicleNumber}`,
      `📍 ${lead.city ?? '—'} | ${lead.source}`,
      `🕐 ${ist} IST`,
    ];

    lines.push('');
    lines.push(this.formatChallans(challans, lead.vehicleNumber));

    const text = lines.join('\n');

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });
  }

  private formatChallans(
    challans: ProviderChallan[],
    vehicleNumber: string,
  ): string {
    if (!challans.length) {
      return `📋 *Challan Status:* No pending challans found for ${vehicleNumber}`;
    }

    const unpaid = challans.filter(
      (c) => c.status?.toUpperCase() === 'UNPAID',
    );
    const totalAmount = challans.reduce(
      (sum, c) => sum + (Number(c.amountChallan) || 0),
      0,
    );
    const unpaidAmount = unpaid.reduce(
      (sum, c) => sum + (Number(c.amountChallan) || 0),
      0,
    );

    const summaryLines = [
      `📋 *Challan Details (${challans.length} found)*`,
      `💰 Total: ₹${totalAmount.toLocaleString('en-IN')} | Unpaid: ₹${unpaidAmount.toLocaleString('en-IN')} (${unpaid.length} challan${unpaid.length !== 1 ? 's' : ''})`,
    ];

    const challanLines = challans.map((c, i) => {
      const statusIcon = c.status?.toUpperCase() === 'PAID' ? '✅' : '❌';
      const amount = Number(c.amountChallan) || 0;
      const date = c.dateChallan
        ? c.dateChallan.split(' ')[0]
        : '—';
      const offences = (c.detailsViolation ?? [])
        .map((v) => v.offence)
        .filter(Boolean)
        .join(', ');
      const violation = offences || 'Violation details not available';
      const location = c.locationChallan || c.nameCourt || '—';
      const challanNo = c.challanNo || '—';

      return [
        ``,
        `*${i + 1}.* ${statusIcon} ₹${amount.toLocaleString('en-IN')} — ${c.status}`,
        `   📌 ${violation}`,
        `   📍 ${location} | 📅 ${date}`,
        `   🔖 No: \`${challanNo}\``,
      ].join('\n');
    });

    return [...summaryLines, ...challanLines].join('\n');
  }
}
