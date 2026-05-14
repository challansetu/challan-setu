import { Module } from '@nestjs/common';
import { PrismaModule } from '../config/prisma.module';
import { QrScansController } from './qr-scans.controller';
import { QrScansService } from './qr-scans.service';

@Module({
  imports: [PrismaModule],
  controllers: [QrScansController],
  providers: [QrScansService],
  exports: [QrScansService],
})
export class QrScansModule {}
