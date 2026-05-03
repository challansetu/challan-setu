import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType } from '@prisma/client';

export class CreateDiscountRuleDto {
  @ApiProperty({ example: 'Launch Offer 40%' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Platform-funded 40% discount capped at 500' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DiscountType, example: 'PERCENTAGE' })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @ApiProperty({ example: 30 })
  @IsNumber()
  discountValue: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  maxDiscount?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  minOrderAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  validFrom?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  validUntil?: Date;
}
