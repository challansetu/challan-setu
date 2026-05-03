import { Module } from '@nestjs/common';
import { ChallansService } from './challans.service';
import { ChallansController } from './challans.controller';
import { ChallanProviderService } from './provider/challan-provider.service';
import { ChallanNormalizer } from './provider/challan-normalizer';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
  imports: [VehiclesModule],
  controllers: [ChallansController],
  providers: [ChallansService, ChallanProviderService, ChallanNormalizer],
  exports: [ChallansService],
})
export class ChallansModule {}
