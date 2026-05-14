import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { TrackQrScanDto } from './dto/track-qr-scan.dto';
import { QrScansService } from './qr-scans.service';

@ApiTags('QR Scans')
@Controller('qr-scans')
export class QrScansController {
  constructor(private readonly qrScansService: QrScansService) {}

  // Called server-side by the Next.js /scan/[source] route handler.
  // Never called directly by end users — the redirect happens on the frontend.
  @Public()
  @Post('track')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record a QR code scan (internal, called by Next.js route handler)' })
  async track(@Body() dto: TrackQrScanDto) {
    return this.qrScansService.trackScan(dto);
  }
}
