import { Module } from '@nestjs/common';
import { ManualTransactionsService } from './manual-transactions.service';
import { ManualTransactionsController } from './manual-transactions.controller';
import { PrismaModule } from '../config/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ManualTransactionsController],
  providers: [ManualTransactionsService],
  exports: [ManualTransactionsService],
})
export class ManualTransactionsModule {}
