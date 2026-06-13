import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import { RedisService } from '../config/redis.service';
import { UsersService } from '../users/users.service';
import { DEFAULT_OTP_LENGTH, DEFAULT_OTP_EXPIRY_SECONDS, DEV_OTP } from '../common/constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}

  async sendOtp(phone: string): Promise<{ message: string; devOtp?: string }> {
    const otpLength = parseInt(process.env.OTP_LENGTH || String(DEFAULT_OTP_LENGTH), 10);
    const otpExpiry = parseInt(process.env.OTP_EXPIRY_SECONDS || String(DEFAULT_OTP_EXPIRY_SECONDS), 10);
    const isDev = process.env.NODE_ENV !== 'production';

    // In dev mode, use a fixed OTP for easy testing. In production, generate a
    // cryptographically secure, fixed-length numeric OTP (zero-padded).
    const otp = isDev
      ? DEV_OTP
      : randomInt(0, 10 ** otpLength).toString().padStart(otpLength, '0');

    // Store OTP in Redis with TTL
    await this.redisService.set(`otp:${phone}`, otp, otpExpiry);

    // In production: send OTP via SMS gateway (MSG91, Twilio, etc.)
    this.logger.log(`OTP for ${phone}: ${otp} (dev mode)`);

    return {
      message: 'OTP sent successfully',
      ...(isDev && { devOtp: otp }),
    };
  }

  async verifyOtp(
    phone: string,
    otp: string,
    name?: string,
  ): Promise<{ accessToken: string; isNewUser: boolean }> {
    const storedOtp = await this.redisService.get(`otp:${phone}`);

    if (!storedOtp || storedOtp !== otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Delete used OTP
    await this.redisService.del(`otp:${phone}`);

    // Find or create user
    let isNewUser = false;
    let user = await this.usersService.findByPhone(phone);

    if (!user) {
      // For new users, name is required
      if (!name || name.trim().length === 0) {
        throw new UnauthorizedException('Name is required for new users');
      }
      user = await this.usersService.create({ phone, name: name.trim() });
      isNewUser = true;
    } else if (name && name.trim().length > 0 && !user.name) {
      // Update existing user if they don't have a name yet
      user = await this.usersService.update(user.id, { name: name.trim() });
    }

    // Generate JWT
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, isNewUser };
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }
}
