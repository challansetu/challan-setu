import { IsString, IsOptional, Matches, MaxLength } from 'class-validator';

export class TrackQrScanDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{1,100}$/, {
    message: 'source must be 1–100 alphanumeric characters, hyphens, or underscores',
  })
  source: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  ip?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  userAgent?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  referrer?: string;
}
