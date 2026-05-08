import { Controller, Post, Get, Body, Query, UseGuards, HttpCode, HttpStatus, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ChallansService } from './challans.service';
import { ChallanProviderService } from './provider/challan-provider.service';
import { SearchChallanDto } from './dto/search-challan.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Challans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('challans')
export class ChallansController {
  constructor(
    private readonly challansService: ChallansService,
    private readonly challanProvider: ChallanProviderService,
  ) {}

  @Public()
  @Get('public')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({ summary: 'Public challan lookup by vehicle number (no auth)' })
  async getPublicChallans(@Query('vehicle') vehicle: string) {
    if (!vehicle) return { challans: [] };
    const vn = vehicle.toUpperCase().replace(/[\s\-]/g, '');
    const result = await this.challanProvider.fetchChallans(vn);
    return { challans: result.result ?? [] };
  }

  @Public()
  @Post('eparivahan/initiate')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Step 1: submit VRN to eparivahan, trigger OTP to registered mobile' })
  async eparivahanInitiate(@Body('vehicleNumber') vehicleNumber: string) {
    if (!vehicleNumber) throw new BadRequestException('vehicleNumber is required');
    try {
      return await this.challanProvider.initiateEparivahan(vehicleNumber.toUpperCase().replace(/[\s\-]/g, ''));
    } catch (e: any) {
      throw new InternalServerErrorException(e?.message ?? 'Initiation failed');
    }
  }

  @Public()
  @Post('eparivahan/verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({ summary: 'Step 2: verify OTP, return challan list' })
  async eparivahanVerify(
    @Body('sessionId') sessionId: string,
    @Body('otp') otp: string,
  ) {
    if (!sessionId || !otp) throw new BadRequestException('sessionId and otp are required');
    try {
      const challans = await this.challanProvider.verifyEparivahanOtp(sessionId, otp);
      return { challans };
    } catch (e: any) {
      throw new InternalServerErrorException(e?.message ?? 'OTP verification failed');
    }
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @Throttle({
    default: {
      ttl: parseInt(process.env.CHALLAN_SEARCH_THROTTLE_TTL || '60', 10) * 1000,
      limit: parseInt(process.env.CHALLAN_SEARCH_THROTTLE_LIMIT || '5', 10),
    },
  })
  @ApiOperation({ summary: 'Search challans for a vehicle number' })
  async searchChallans(
    @CurrentUser('id') userId: string,
    @Body() dto: SearchChallanDto,
  ) {
    return this.challansService.searchChallans(userId, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get user search history' })
  async getHistory(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.challansService.getUserSearchHistory(userId, page, limit);
  }

  @Get('cache-stats')
  @ApiOperation({ summary: 'Cache hit/miss stats and estimated cost savings' })
  getCacheStats() {
    return this.challansService.getCacheStats();
  }
}
