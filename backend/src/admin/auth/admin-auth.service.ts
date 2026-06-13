import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../config/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: AdminLoginDto, ip?: string) {
    const admin = await this.prisma.adminUser.findUnique({ where: { email: dto.email } });
    if (!admin || !admin.isActive) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    const secret = this.config.get<string>('ADMIN_JWT_SECRET');
    if (!secret) {
      throw new Error('ADMIN_JWT_SECRET is not set.');
    }
    const token = this.jwtService.sign(
      { sub: admin.id, email: admin.email, role: admin.role, type: 'admin' },
      {
        secret,
        expiresIn: this.config.get<string>('ADMIN_JWT_EXPIRY', '8h'),
      },
    );

    return {
      accessToken: token,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    };
  }

  async createAdmin(data: { email: string; password: string; name: string; role?: AdminRole }) {
    const existing = await this.prisma.adminUser.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email already exists');

    const passwordHash = await bcrypt.hash(data.password, 12);
    const admin = await this.prisma.adminUser.create({
      data: { email: data.email, passwordHash, name: data.name, role: data.role ?? 'SUPPORT_AGENT' },
    });
    return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
  }

  async listAdmins() {
    return this.prisma.adminUser.findMany({
      select: { id: true, email: true, name: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateAdmin(id: string, data: { name?: string; role?: AdminRole; isActive?: boolean }) {
    const admin = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    return this.prisma.adminUser.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
  }

  async resetPassword(id: string, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.adminUser.update({ where: { id }, data: { passwordHash } });
    return { message: 'Password reset successfully' };
  }
}
