import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 500, description: 'Amount in INR (rupees). Converted to paise server-side.' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1, { message: 'Minimum payment is ₹1' })
  @Max(500000, { message: 'Maximum payment is ₹5,00,000' })
  amount: number;

  @ApiProperty({ example: 'Aman Gupta' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value))
  name: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid Indian mobile number' })
  phone: string;

  @ApiProperty({ example: 'aman@example.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(150)
  email?: string;

  @ApiProperty({ example: 'Drink & drive case consultation', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  note?: string;
}
