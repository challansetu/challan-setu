import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { AddVehicleDto } from './dto/add-vehicle.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Add a vehicle' })
  async addVehicle(
    @CurrentUser('id') userId: string,
    @Body() dto: AddVehicleDto,
  ) {
    return this.vehiclesService.addVehicle(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List user vehicles' })
  async listVehicles(@CurrentUser('id') userId: string) {
    return this.vehiclesService.getUserVehicles(userId);
  }
}
