import {
  Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, Req, Res, HttpCode, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { PricingService } from '../pricing/pricing.service';
import { QrScansService } from '../qr-scans/qr-scans.service';
import { AdminJwtGuard } from './auth/admin-jwt.guard';
import { AdminRolesGuard, AdminRoles } from './auth/admin-roles.guard';
import { AdminRole, UserLifecycleStatus } from '@prisma/client';
import { IsString, IsOptional, IsBoolean, IsEnum, MinLength, IsNumber, IsPositive } from 'class-validator';
import { CreateDiscountRuleDto } from './dto/create-discount-rule.dto';

class AddNoteDto {
  @IsString() @MinLength(1) content: string;
  @IsOptional() @IsBoolean() isPinned?: boolean;
}
class UpdateNoteDto {
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsBoolean() isPinned?: boolean;
}
class ChangeStatusDto {
  @IsEnum(UserLifecycleStatus) status: UserLifecycleStatus;
  @IsOptional() @IsString() reason?: string;
}
class ToggleActiveDto {
  @IsBoolean() isActive: boolean;
  @IsOptional() @IsString() reason?: string;
}
class CreateUserChallanDto {
  @IsString() @MinLength(1) challanNumber: string;
  @IsOptional() @IsNumber() realAmount?: number | null;
  @IsNumber() @IsPositive() amount: number;
  @IsString() @MinLength(1) location: string;
  @IsOptional() @IsNumber() settledAmount?: number | null;
}
class UpdateUserChallanDto {
  @IsOptional() @IsString() challanNumber?: string;
  @IsOptional() @IsNumber() realAmount?: number | null;
  @IsOptional() @IsNumber() @IsPositive() amount?: number;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsNumber() settledAmount?: number | null;
}

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AdminJwtGuard, AdminRolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly pricingService: PricingService,
    private readonly qrScansService: QrScansService,
  ) {}

  // ─── Dashboard ────────────────────────────────────────────────────────────

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard stats' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  // ─── Leads ────────────────────────────────────────────────────────────────

  @Get('leads')
  @ApiOperation({ summary: 'List MVP homepage leads' })
  async listLeads(
    @Query('page') page = 1,
    @Query('limit') limit = 25,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('source') source?: string,
  ) {
    return this.adminService.getLeads({ page, limit, search, status, source });
  }

  @Get('leads/stats')
  @ApiOperation({ summary: 'Leads aggregate stats' })
  async getLeadsStats() {
    return this.adminService.getLeadsStats();
  }

  @Get('leads/:id')
  @ApiOperation({ summary: 'Get single lead detail' })
  async getLead(@Param('id') id: string) {
    return this.adminService.getLead(id);
  }

  @Patch('leads/:id')
  @ApiOperation({ summary: 'Update lead CRM fields' })
  async updateLead(
    @Param('id') id: string,
    @Body() body: {
      crmStatus?: string;
      paymentStatus?: string;
      challanSettled?: string;
      totalChallan?: number | null;
      paidAmount?: number | null;
      settledAmount?: number | null;
      discountGiven?: number | null;
    },
  ) {
    return this.adminService.updateLead(id, body);
  }

  // ─── Users ────────────────────────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'List users with filters, search, sort' })
  async listUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 25,
    @Query('search') search?: string,
    @Query('status') status?: string | string[],
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    return this.adminService.getUsers({ page, limit, search, status, dateFrom, dateTo, sortBy, sortOrder });
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get full user profile' })
  async getUserDetail(@Param('id') id: string) {
    return this.adminService.getUserDetail(id);
  }

  @Get('users/:id/searches')
  async getUserSearches(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.adminService.getUserSearches(id, Number(page), Number(limit));
  }

  // ─── User Status ──────────────────────────────────────────────────────────

  @Post('users/:id/status')
  @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async changeStatus(@Param('id') id: string, @Body() dto: ChangeStatusDto, @Req() req: any) {
    return this.adminService.changeUserStatus(id, dto.status, req.user.adminId, dto.reason);
  }

  @Put('users/:id/toggle-active')
  @AdminRoles(AdminRole.SUPER_ADMIN)
  async toggleActive(@Param('id') id: string, @Body() dto: ToggleActiveDto, @Req() req: any) {
    return this.adminService.toggleUserActive(id, dto.isActive, req.user.adminId, dto.reason);
  }

  // ─── Notes ────────────────────────────────────────────────────────────────

  @Get('users/:id/notes')
  async getNotes(@Param('id') id: string) {
    return this.adminService.getNotes(id);
  }

  @Post('users/:id/notes')
  async addNote(@Param('id') id: string, @Body() dto: AddNoteDto, @Req() req: any) {
    return this.adminService.addNote(id, req.user.adminId, dto.content, dto.isPinned);
  }

  @Put('users/:userId/notes/:noteId')
  async updateNote(@Param('noteId') noteId: string, @Body() dto: UpdateNoteDto, @Req() req: any) {
    return this.adminService.updateNote(noteId, req.user.adminId, dto);
  }

  @Delete('users/:userId/notes/:noteId')
  @HttpCode(HttpStatus.OK)
  async deleteNote(@Param('noteId') noteId: string, @Req() req: any) {
    return this.adminService.deleteNote(noteId, req.user.adminId, req.user.role);
  }

  // ─── Lead Challans ────────────────────────────────────────────────────────

  @Get('leads/:id/challans')
  async getLeadChallans(@Param('id') id: string) {
    return this.adminService.getLeadChallans(id);
  }

  @Post('leads/:id/challans')
  @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  async createLeadChallan(@Param('id') id: string, @Body() dto: CreateUserChallanDto) {
    return this.adminService.createLeadChallan(id, dto);
  }

  @Patch('leads/:leadId/challans/:challanId')
  @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  async updateLeadChallan(@Param('challanId') challanId: string, @Body() dto: UpdateUserChallanDto) {
    return this.adminService.updateLeadChallan(challanId, dto);
  }

  @Delete('leads/:leadId/challans/:challanId')
  @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteLeadChallan(@Param('challanId') challanId: string) {
    return this.adminService.deleteLeadChallan(challanId);
  }

  // ─── User Challans ────────────────────────────────────────────────────────

  @Get('users/:id/challans')
  async getUserChallans(@Param('id') id: string) {
    return this.adminService.getUserChallans(id);
  }

  @Post('users/:id/challans')
  @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  async createUserChallan(@Param('id') id: string, @Body() dto: CreateUserChallanDto) {
    return this.adminService.createUserChallan(id, dto);
  }

  @Patch('users/:userId/challans/:challanId')
  @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  async updateUserChallan(@Param('challanId') challanId: string, @Body() dto: UpdateUserChallanDto) {
    return this.adminService.updateUserChallan(challanId, dto);
  }

  @Delete('users/:userId/challans/:challanId')
  @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteUserChallan(@Param('challanId') challanId: string) {
    return this.adminService.deleteUserChallan(challanId);
  }

  // ─── Audit Logs ───────────────────────────────────────────────────────────

  @Get('audit-logs')
  async getAuditLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query('entity') entity?: string,
    @Query('action') action?: string,
    @Query('userId') userId?: string,
    @Query('adminId') adminId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.adminService.getAuditLogs({ page, limit, entity, action, userId, adminId, dateFrom, dateTo });
  }

  // ─── Export ───────────────────────────────────────────────────────────────

  @Get('export/users')
  @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  async exportUsers(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('status') status?: string,
    @Res() res?: Response,
  ) {
    const csv = await this.adminService.exportUsers({ dateFrom, dateTo, status });
    res!.setHeader('Content-Type', 'text/csv');
    res!.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res!.send(csv);
  }

  // ─── QR Scans ─────────────────────────────────────────────────────────────

  @Get('qr-scans/summary')
  @ApiOperation({ summary: 'QR scan analytics summary' })
  async getQrScansSummary() {
    return this.qrScansService.getSummary();
  }

  @Get('qr-scans')
  @ApiOperation({ summary: 'Paginated QR scan records' })
  async getQrScans(
    @Query('source') source?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.qrScansService.getScans({ source, page: Number(page), limit: Number(limit) });
  }

  // ─── Discount Rules ───────────────────────────────────────────────────────

  @Get('discount-rules')
  async getDiscountRules() {
    return this.pricingService.getActiveRules();
  }

  @Post('discount-rules')
  @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  async createDiscountRule(@Body() dto: CreateDiscountRuleDto) {
    return this.pricingService.createRule(dto);
  }
}
