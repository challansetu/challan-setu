import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
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
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QueueModule } from './queue/queue.module';

import { LeadsModule } from './leads/leads.module';
import { QrScansModule } from './qr-scans/qr-scans.module';

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
        password: process.env.REDIS_PASSWORD || undefined,
        username: process.env.REDIS_USER || undefined,
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
    AdminModule,
    NotificationsModule,
    QueueModule,
    LeadsModule,
    QrScansModule,
  ],
  providers: [
    // Enforce the ThrottlerModule config globally. Without this the @Throttle
    // decorators (and the default limit) are never applied — i.e. no rate limiting.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
