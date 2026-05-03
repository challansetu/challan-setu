import { Controller, Post, Get, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ChallansService } from './challans.service';
import { SearchChallanDto } from './dto/search-challan.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Challans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('challans')
export class ChallansController {
  constructor(private readonly challansService: ChallansService) {}

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
