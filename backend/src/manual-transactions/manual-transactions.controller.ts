import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ManualTransactionsService } from './manual-transactions.service';
import { CreateManualTransactionDto, UpdateManualTransactionDto } from './dto/manual-transaction.dto';
import { AdminJwtGuard } from '../admin/auth/admin-jwt.guard';

@Controller('admin/manual-transactions')
@UseGuards(AdminJwtGuard)
export class ManualTransactionsController {
  constructor(private readonly service: ManualTransactionsService) {}

  @Post()
  create(@Body() dto: CreateManualTransactionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateManualTransactionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
