import { IsString, Matches, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchChallanDto {
  @ApiProperty({ example: 'UP16DZ3281', description: 'Vehicle registration number' })
  @IsString()
  @Matches(/^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{1,4}$/i, {
    message: 'Invalid vehicle number format',
  })
  vehicleNumber: string;

  @ApiPropertyOptional({
    description: 'Bypass cache and force a fresh API call (costs ₹4)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  forceRefresh?: boolean;
}
