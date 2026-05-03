import { IsArray, IsString, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiProperty({
    example: ['clx123', 'clx456'],
    description: 'Array of unpaid challan IDs to add to cart',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  challanIds: string[];
}
