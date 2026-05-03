import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
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

    return {
      success: true,
      leadId: lead.id,
      leadStatus: lead.leadStatus,
      createdAt: lead.createdAt,
    };
  }
}
