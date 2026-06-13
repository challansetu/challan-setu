import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../config/prisma.service';

interface AdminJwtPayload {
  sub: string;
  email: string;
  role: string;
  type: string;
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secret = configService.get<string>('ADMIN_JWT_SECRET');
    if (!secret) {
      throw new Error('ADMIN_JWT_SECRET is not set — refusing to start with a default admin secret.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: AdminJwtPayload) {
    if (payload.type !== 'admin') throw new UnauthorizedException('Invalid token type');

    const admin = await this.prisma.adminUser.findUnique({ where: { id: payload.sub } });
    if (!admin || !admin.isActive) throw new UnauthorizedException('Admin not found or inactive');

    return { adminId: admin.id, email: admin.email, role: admin.role, name: admin.name };
  }
}
