import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { AddVehicleDto } from './dto/add-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async addVehicle(userId: string, dto: AddVehicleDto) {
    const vehicleNumber = dto.vehicleNumber.toUpperCase().replace(/\s/g, '');

    const existing = await this.prisma.vehicle.findUnique({
      where: { userId_vehicleNumber: { userId, vehicleNumber } },
    });

    if (existing) return existing;

    return this.prisma.vehicle.create({
      data: {
        userId,
        vehicleNumber,
        nickname: dto.nickname,
      },
    });
  }

  async getUserVehicles(userId: string) {
    return this.prisma.vehicle.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOrCreate(userId: string, vehicleNumber: string) {
    const normalized = vehicleNumber.toUpperCase().replace(/\s/g, '');
    const fullyNormalized = vehicleNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return this.prisma.vehicle.upsert({
      where: { userId_vehicleNumber: { userId, vehicleNumber: normalized } },
      update: { normalizedVehicleNumber: fullyNormalized },
      create: { userId, vehicleNumber: normalized, normalizedVehicleNumber: fullyNormalized },
    });
  }
}
