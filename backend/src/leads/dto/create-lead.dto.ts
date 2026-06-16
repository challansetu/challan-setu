import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches, MinLength, MaxLength } from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({ example: 'Aman Gupta' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
  fullName: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid Indian mobile number' })
  mobileNumber: string;

  @ApiProperty({ example: 'DL7SBY5194' })
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase().replace(/[^A-Z0-9]/g, '') : value)
  @Matches(/^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{1,4}$/, {
    message: 'Invalid vehicle number format',
  })
  vehicleNumber: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  consentAccepted: boolean;

  @ApiProperty({ example: 'city_page', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^(homepage|city_page|vehicle_recovery|insurance)$/)
  source?: string;

  @ApiProperty({ example: 'faridabad', required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
  @Matches(/^[a-z-]+$/, { message: 'Invalid city slug' })
  city?: string;

  @ApiProperty({ example: '[VEHICLE RECOVERY] FIR: 123/2024', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
