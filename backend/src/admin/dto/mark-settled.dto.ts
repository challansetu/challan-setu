import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MarkSettledDto {
  @ApiPropertyOptional({ example: 'TXN_12345', description: 'External reference ID' })
  @IsOptional()
  @IsString()
  externalRef?: string;
}
