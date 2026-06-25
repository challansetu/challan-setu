import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class VerifyPaymentDto {
  @ApiProperty({ example: 'order_Nabc123XYZ' })
  @IsString()
  @MaxLength(100)
  razorpayOrderId: string;

  @ApiProperty({ example: 'pay_Nabc123XYZ' })
  @IsString()
  @MaxLength(100)
  razorpayPaymentId: string;

  @ApiProperty({ example: 'a1b2c3...' })
  @IsString()
  @MaxLength(256)
  razorpaySignature: string;
}
