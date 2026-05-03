import { IsString, Matches, Length, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: '8287650767' })
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid Indian mobile number' })
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(4, 6)
  otp: string;

  @ApiProperty({ example: 'John Doe', required: false, description: 'User name (required for new users)' })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Name must be less than 100 characters' })
  name?: string;
}
