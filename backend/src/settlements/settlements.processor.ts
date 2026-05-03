import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SettlementsService } from './settlements.service';

@Processor('settlements')
export class SettlementsProcessor {
  private readonly logger = new Logger(SettlementsProcessor.name);

  constructor(private readonly settlementsService: SettlementsService) {}

  @Process('process-settlement')
  async handleSettlement(job: Job<{ orderId: string }>) {
    this.logger.log(`Processing settlement for order: ${job.data.orderId}`);
    await this.settlementsService.processSettlement(job.data.orderId);
  }
}
