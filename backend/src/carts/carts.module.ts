import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { ChallansModule } from '../challans/challans.module';
import { PricingModule } from '../pricing/pricing.module';

@Module({
  imports: [ChallansModule, PricingModule],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
