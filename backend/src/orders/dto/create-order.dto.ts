import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiPropertyOptional({
    description: 'Whether user accepted the Safe Driving Promise (required for discount)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  promiseAccepted?: boolean;
}
