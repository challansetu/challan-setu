import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiatePaymentDto {
  @ApiProperty({ example: 'clx_order_id', description: 'Internal order ID' })
  @IsString()
  @IsNotEmpty()
  orderId: string;
}
