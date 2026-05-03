import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Min, IsInt, Matches } from 'class-validator';

export class CreateManualTransactionDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be a valid 10-digit number',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  vehicleNumber: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsInt()
  @Min(1)
  totalChallans: number;

  @IsNumber()
  @Min(0.01)
  totalChallanAmount: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  settledAmount?: number;

  @IsBoolean()
  settledOnGovPortal: boolean;
}

export class UpdateManualTransactionDto {
  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be a valid 10-digit number',
  })
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  vehicleNumber?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  totalChallans?: number;

  @IsNumber()
  @IsOptional()
  @Min(0.01)
  totalChallanAmount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  settledAmount?: number;

  @IsBoolean()
  @IsOptional()
  settledOnGovPortal?: boolean;
}
