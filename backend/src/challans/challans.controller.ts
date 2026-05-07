import { Controller, Post, Get, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
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
  @ApiOperation({ summary: 'Public challan lookup by vehicle number (no auth)' })
  async getPublicChallans(@Query('vehicle') vehicle: string) {
    if (!vehicle) return { challans: [] };
    const vn = vehicle.toUpperCase().replace(/[\s\-]/g, '');
    const result = await this.challanProvider.fetchChallans(vn);
    return { challans: result.result ?? [] };
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
