import { Module } from '@nestjs/common';
import { PrismaModule } from '../config/prisma.module';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { ChallanProviderService } from '../challans/provider/challan-provider.service';

@Module({
  imports: [PrismaModule],
  controllers: [LeadsController],
  providers: [LeadsService, ChallanProviderService],
  exports: [LeadsService],
})
export class LeadsModule {}
