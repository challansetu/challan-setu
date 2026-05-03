import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SettlementsService } from './settlements.service';
import { SettlementsProcessor } from './settlements.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'settlements' }),
  ],
  providers: [SettlementsService, SettlementsProcessor],
  exports: [SettlementsService],
})
export class SettlementsModule {}
