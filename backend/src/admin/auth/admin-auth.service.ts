import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../config/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

function normalizePrefixes(prefixes?: string[]): string[] {
  if (!prefixes) return [];
  const cleaned = prefixes
    .map((p) => p.trim().toUpperCase())
    .filter((p) => p.length > 0);
  return Array.from(new Set(cleaned));
}

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
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        vehiclePrefixes: admin.vehiclePrefixes,
      },
    };
  }

  async createAdmin(data: { email: string; password: string; name: string; role?: AdminRole; vehiclePrefixes?: string[] }) {
    const existing = await this.prisma.adminUser.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email already exists');

    const passwordHash = await bcrypt.hash(data.password, 12);
    const role = data.role ?? 'SUPPORT_AGENT';
    const admin = await this.prisma.adminUser.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role,
        vehiclePrefixes: role === 'LAWYER' ? normalizePrefixes(data.vehiclePrefixes) : [],
      },
    });
    return { id: admin.id, email: admin.email, name: admin.name, role: admin.role, vehiclePrefixes: admin.vehiclePrefixes };
  }

  async listAdmins() {
    return this.prisma.adminUser.findMany({
      select: {
        id: true, email: true, name: true, role: true, isActive: true,
        vehiclePrefixes: true, lastLoginAt: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateAdmin(id: string, data: { name?: string; role?: AdminRole; isActive?: boolean; vehiclePrefixes?: string[] }) {
    const admin = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');

    const nextRole = data.role ?? admin.role;
    const update: any = { name: data.name, role: data.role, isActive: data.isActive };
    if (data.vehiclePrefixes !== undefined) {
      update.vehiclePrefixes = nextRole === 'LAWYER' ? normalizePrefixes(data.vehiclePrefixes) : [];
    } else if (data.role && data.role !== 'LAWYER' && admin.role === 'LAWYER') {
      update.vehiclePrefixes = [];
    }

    return this.prisma.adminUser.update({
      where: { id },
      data: update,
      select: { id: true, email: true, name: true, role: true, isActive: true, vehiclePrefixes: true },
    });
  }

  async resetPassword(id: string, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.adminUser.update({ where: { id }, data: { passwordHash } });
    return { message: 'Password reset successfully' };
  }

  async deleteAdmin(id: string, requestingAdminId: string) {
    const admin = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');

    if (id === requestingAdminId) {
      throw new BadRequestException('You cannot delete your own account');
    }

    if (admin.role === 'SUPER_ADMIN') {
      const otherSuperAdmins = await this.prisma.adminUser.count({
        where: { role: 'SUPER_ADMIN', id: { not: id } },
      });
      if (otherSuperAdmins === 0) {
        throw new BadRequestException('Cannot delete the last Super Admin account');
      }
    }

    try {
      await this.prisma.adminUser.delete({ where: { id } });
    } catch {
      throw new ConflictException('Cannot delete this account — it has associated records (notes, status changes, or audit logs)');
    }
    return { deleted: true };
  }
}
