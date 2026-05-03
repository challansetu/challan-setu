import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminAuthController } from './auth/admin-auth.controller';
import { AdminAuthService } from './auth/admin-auth.service';
import { AdminJwtStrategy } from './auth/admin-jwt.strategy';
import { AdminRolesGuard } from './auth/admin-roles.guard';
import { SettlementsModule } from '../settlements/settlements.module';
import { PricingModule } from '../pricing/pricing.module';
import { PrismaModule } from '../config/prisma.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    PrismaModule,
    SettlementsModule,
    PricingModule,
  ],
  controllers: [AdminController, AdminAuthController],
  providers: [AdminService, AdminAuthService, AdminJwtStrategy, AdminRolesGuard],
  exports: [AdminService],
})
export class AdminModule {}
