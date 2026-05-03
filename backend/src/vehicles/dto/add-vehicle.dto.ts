import { IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddVehicleDto {
  @ApiProperty({ example: 'UP16DZ3281', description: 'Vehicle registration number' })
  @IsString()
  @Matches(/^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{1,4}$/i, {
    message: 'Invalid vehicle number format',
  })
  vehicleNumber: string;

  @ApiPropertyOptional({ example: 'My Car' })
  @IsOptional()
  @IsString()
  nickname?: string;
}
