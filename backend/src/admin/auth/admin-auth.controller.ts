import { Controller, Post, Get, Put, Body, Param, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminJwtGuard } from './admin-jwt.guard';
import { AdminRolesGuard, AdminRoles } from './admin-roles.guard';
import { AdminRole } from '@prisma/client';
import { IsString, MinLength, IsOptional, IsEmail, IsBoolean, IsEnum } from 'class-validator';

class CreateAdminDto {
  @IsEmail() email: string;
  @IsString() name: string;
  @IsString() @MinLength(8) password: string;
  @IsOptional() @IsEnum(AdminRole) role?: AdminRole;
}
class UpdateAdminDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEnum(AdminRole) role?: AdminRole;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
class ResetPasswordDto {
  @IsString() @MinLength(8) newPassword: string;
}

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login with email + password' })
  async login(@Body() dto: AdminLoginDto, @Req() req: any) {
    return this.adminAuthService.login(dto, req.ip);
  }

  @Get('me')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current admin profile' })
  async me(@Req() req: any) {
    return req.user;
  }

  @Get('admins')
  @UseGuards(AdminJwtGuard, AdminRolesGuard)
  @AdminRoles(AdminRole.SUPER_ADMIN)
  @ApiBearerAuth()
  async listAdmins() {
    return this.adminAuthService.listAdmins();
  }

  @Post('admins')
  @UseGuards(AdminJwtGuard, AdminRolesGuard)
  @AdminRoles(AdminRole.SUPER_ADMIN)
  @ApiBearerAuth()
  async createAdmin(@Body() dto: CreateAdminDto) {
    return this.adminAuthService.createAdmin(dto);
  }

  @Put('admins/:id')
  @UseGuards(AdminJwtGuard, AdminRolesGuard)
  @AdminRoles(AdminRole.SUPER_ADMIN)
  @ApiBearerAuth()
  async updateAdmin(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    return this.adminAuthService.updateAdmin(id, dto);
  }

  @Put('admins/:id/reset-password')
  @UseGuards(AdminJwtGuard, AdminRolesGuard)
  @AdminRoles(AdminRole.SUPER_ADMIN)
  @ApiBearerAuth()
  async resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto) {
    return this.adminAuthService.resetPassword(id, dto.newPassword);
  }
}
