import { Module } from '@nestjs/common';
import { PrismaModule } from '../config/prisma.module';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { LawyerAssignmentService } from './lawyer-assignment.service';

@Module({
  imports: [PrismaModule],
  controllers: [LeadsController],
  providers: [LeadsService, LawyerAssignmentService],
  exports: [LeadsService],
})
export class LeadsModule {}
