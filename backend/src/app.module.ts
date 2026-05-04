import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import {
  DEFAULT_THROTTLE_TTL_SECONDS,
  DEFAULT_THROTTLE_LIMIT,
  DEFAULT_REDIS_HOST,
  DEFAULT_REDIS_PORT,
} from './common/constants';

import { PrismaModule } from './config/prisma.module';
import { RedisModule } from './config/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ChallansModule } from './challans/challans.module';
import { PricingModule } from './pricing/pricing.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { SettlementsModule } from './settlements/settlements.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QueueModule } from './queue/queue.module';

import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'], // Check backend/.env first, then root .env
    }),
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL || String(DEFAULT_THROTTLE_TTL_SECONDS), 10) * 1000,
      limit: parseInt(process.env.THROTTLE_LIMIT || String(DEFAULT_THROTTLE_LIMIT), 10),
    }]),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || DEFAULT_REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || String(DEFAULT_REDIS_PORT), 10),
      },
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    VehiclesModule,
    ChallansModule,
    PricingModule,
    CartsModule,
    OrdersModule,
    PaymentsModule,
    SettlementsModule,
    AdminModule,
    NotificationsModule,
    QueueModule,
    LeadsModule,
  ],
})
export class AppModule {}
