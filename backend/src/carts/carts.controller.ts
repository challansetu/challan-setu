import { Controller, Get, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current cart with pricing' })
  async getCart(@CurrentUser('id') userId: string) {
    return this.cartsService.getCartWithPricing(userId);
  }

  @Put()
  @ApiOperation({ summary: 'Update cart items (replace all)' })
  async updateCart(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartsService.updateCart(userId, dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  async clearCart(@CurrentUser('id') userId: string) {
    return this.cartsService.clearCart(userId);
  }
}
