import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateManualTransactionDto, UpdateManualTransactionDto } from './dto/manual-transaction.dto';

@Injectable()
export class ManualTransactionsService {
  constructor(private prisma: PrismaService) {}

  private calculateProfitAndDiscount(totalAmount: number, settledAmount?: number) {
    if (settledAmount === undefined || settledAmount === null) {
      return { profit: null, discountPercentage: null };
    }

    if (settledAmount > totalAmount) {
      throw new BadRequestException('Settled amount cannot exceed total challan amount');
    }

    const profit = totalAmount - settledAmount;
    const discountPercentage = (profit / totalAmount) * 100;

    return { profit, discountPercentage };
  }

  async create(dto: CreateManualTransactionDto) {
    const { profit, discountPercentage } = this.calculateProfitAndDiscount(
      dto.totalChallanAmount,
      dto.settledAmount,
    );

    return this.prisma.manualTransaction.create({
      data: {
        ...dto,
        profit,
        discountPercentage,
      },
    });
  }

  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { userName: { contains: search, mode: 'insensitive' as const } },
            { phoneNumber: { contains: search, mode: 'insensitive' as const } },
            { vehicleNumber: { contains: search, mode: 'insensitive' as const } },
            { state: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    return this.prisma.manualTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.manualTransaction.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException(`Manual transaction with ID ${id} not found`);
    }

    return record;
  }

  async update(id: string, dto: UpdateManualTransactionDto) {
    const existing = await this.findOne(id);

    const totalAmount = dto.totalChallanAmount ?? existing.totalChallanAmount;
    const settledAmount = dto.settledAmount !== undefined ? dto.settledAmount : existing.settledAmount;

    const { profit, discountPercentage } = this.calculateProfitAndDiscount(
      totalAmount,
      settledAmount ?? undefined,
    );

    return this.prisma.manualTransaction.update({
      where: { id },
      data: {
        ...dto,
        profit,
        discountPercentage,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.manualTransaction.delete({
      where: { id },
    });
  }
}
