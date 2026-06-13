import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { UserLifecycleStatus, AdminRole } from '@prisma/client';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly cache = new Map<string, { value: any; expiresAt: number }>();

  constructor(private readonly prisma: PrismaService) {}

  private getCached<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (entry && entry.expiresAt > Date.now()) return entry.value as T;
    this.cache.delete(key);
    return undefined;
  }

  private setCached(key: string, value: any, ttlMs: number) {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────

  async getDashboardStats() {
    const cached = this.getCached<any>('dashboard');
    if (cached) return cached;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      newUsersToday,
      totalLeads,
      leadsToday,
      totalSearches,
      statusBreakdown,
      recentActivity,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.lead.count(),
      this.prisma.lead.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.challanSearch.count(),
      this.prisma.user.groupBy({ by: ['lifecycleStatus'], _count: { _all: true } }),
      this.prisma.auditLog.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, phone: true, name: true } } },
      }),
    ]);

    const result = {
      summary: {
        totalUsers,
        newUsersToday,
        totalLeads,
        leadsToday,
        totalSearches,
      },
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s.lifecycleStatus,
        count: s._count._all,
      })),
      activityFeed: recentActivity,
    };
    this.setCached('dashboard', result, 60_000);
    return result;
  }

  async getLeads(params: {
    page?: number | string;
    limit?: number | string;
    search?: string;
    status?: string;
    source?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 25));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
      const search = params.search.trim();
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { mobileNumber: { contains: search, mode: 'insensitive' } },
        { vehicleNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (params.status) {
      where.crmStatus = params.status;
    }

    if (params.source) {
      where.source = params.source;
    }

    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      leads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getLeadsStats() {
    const cached = this.getCached<any>('leads-stats');
    if (cached) return cached;

    const [total, converted, dead, followUp, paymentDone, agg] = await Promise.all([
      this.prisma.lead.count(),
      this.prisma.lead.count({ where: { crmStatus: 'converted' } }),
      this.prisma.lead.count({ where: { crmStatus: 'dead' } }),
      this.prisma.lead.count({ where: { crmStatus: 'follow_up' } }),
      this.prisma.lead.count({ where: { paymentStatus: 'payment_done' } }),
      this.prisma.lead.aggregate({
        _sum: { paidAmount: true, settledAmount: true, discountGiven: true, totalChallan: true },
      }),
    ]);
    const result = {
      total,
      converted,
      dead,
      followUp,
      paymentDone,
      totalRevenue: agg._sum.paidAmount ?? 0,
      totalSettled: agg._sum.settledAmount ?? 0,
      totalDiscount: agg._sum.discountGiven ?? 0,
      totalChallanValue: agg._sum.totalChallan ?? 0,
    };
    this.setCached('leads-stats', result, 30_000);
    return result;
  }

  async getLead(id: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async updateLead(id: string, dto: {
    crmStatus?: string;
    paymentStatus?: string;
    challanSettled?: string;
    totalChallan?: number | null;
    paidAmount?: number | null;
    settledAmount?: number | null;
    discountGiven?: number | null;
  }) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');
    return this.prisma.lead.update({ where: { id }, data: dto });
  }

  // ─── Users (filtered) ─────────────────────────────────────────────────────

  async getUsers(params: {
    page?: number | string;
    limit?: number | string;
    search?: string;
    status?: string | string[];
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 25));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
      const s = params.search.trim();
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { phone: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
      ];
    }

    if (params.status) {
      const statuses = Array.isArray(params.status) ? params.status : [params.status];
      if (statuses.length > 0) where.lifecycleStatus = { in: statuses };
    }

    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = new Date(params.dateFrom);
      if (params.dateTo) where.createdAt.lte = new Date(params.dateTo);
    }

    const sortMap: Record<string, any> = {
      createdAt: { createdAt: params.sortOrder === 'asc' ? 'asc' : 'desc' },
      lastActiveAt: { lastActiveAt: params.sortOrder === 'asc' ? 'asc' : 'desc' },
      name: { name: params.sortOrder === 'asc' ? 'asc' : 'desc' },
      phone: { phone: params.sortOrder === 'asc' ? 'asc' : 'desc' },
    };
    const orderBy = sortMap[params.sortBy ?? ''] ?? { createdAt: 'desc' };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          phone: true,
          name: true,
          email: true,
          isActive: true,
          lifecycleStatus: true,
          lastActiveAt: true,
          createdAt: true,
          _count: { select: { challanSearches: true, vehicles: true } },
          vehicles: { select: { vehicleNumber: true }, orderBy: { createdAt: 'desc' }, take: 3 },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ─── User Detail ──────────────────────────────────────────────────────────

  async getUserDetail(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        vehicles: { orderBy: { createdAt: 'desc' } },
        adminNotes: {
          include: { admin: { select: { id: true, name: true, email: true, role: true } } },
          orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        },
        statusHistory: {
          include: { admin: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: { select: { challanSearches: true, vehicles: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const searches = await this.prisma.challanSearch.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { id: true, vehicleNumber: true, status: true, resultCount: true, cachedResponseUsed: true, createdAt: true },
    });

    return {
      ...user,
      searches,
    };
  }

  async getUserSearches(userId: string, page = 1, limit = 10) {
    const skip = (Math.max(1, page) - 1) * Math.min(50, limit);
    const [searches, total] = await Promise.all([
      this.prisma.challanSearch.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, vehicleNumber: true, status: true, resultCount: true,
          supportableFound: true, cachedResponseUsed: true, apiCost: true, createdAt: true,
        },
      }),
      this.prisma.challanSearch.count({ where: { userId } }),
    ]);
    return { searches, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── Admin Notes ──────────────────────────────────────────────────────────

  async getNotes(userId: string) {
    return this.prisma.adminNote.findMany({
      where: { userId },
      include: { admin: { select: { id: true, name: true, role: true } } },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async addNote(userId: string, adminId: string, content: string, isPinned = false) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.adminNote.create({
      data: { userId, adminId, content, isPinned },
      include: { admin: { select: { id: true, name: true, role: true } } },
    });
  }

  async deleteNote(noteId: string, adminId: string, adminRole: AdminRole) {
    const note = await this.prisma.adminNote.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException('Note not found');

    // SUPPORT_AGENT can only delete their own notes
    if (adminRole === 'SUPPORT_AGENT' && note.adminId !== adminId) {
      throw new NotFoundException('Note not found');
    }

    await this.prisma.adminNote.delete({ where: { id: noteId } });
    return { deleted: true };
  }

  async updateNote(noteId: string, adminId: string, data: { content?: string; isPinned?: boolean }) {
    const note = await this.prisma.adminNote.findUnique({ where: { id: noteId } });
    if (!note || note.adminId !== adminId) throw new NotFoundException('Note not found');
    return this.prisma.adminNote.update({ where: { id: noteId }, data });
  }

  // ─── User Status Management ───────────────────────────────────────────────

  async changeUserStatus(
    userId: string,
    newStatus: UserLifecycleStatus,
    adminId: string,
    reason?: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const [updated, history] = await Promise.all([
      this.prisma.user.update({ where: { id: userId }, data: { lifecycleStatus: newStatus } }),
      this.prisma.userStatusHistory.create({
        data: { userId, oldStatus: user.lifecycleStatus, newStatus, changedBy: adminId, reason },
      }),
    ]);

    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: 'STATUS_CHANGED',
        entity: 'User',
        entityId: userId,
        oldValue: { lifecycleStatus: user.lifecycleStatus },
        newValue: { lifecycleStatus: newStatus },
        metadata: { reason },
      },
    });

    return { user: updated, history };
  }

  async toggleUserActive(userId: string, isActive: boolean, adminId: string, reason?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive,
        lifecycleStatus: !isActive ? 'BLOCKED' : user.lifecycleStatus === 'BLOCKED' ? 'ACTIVE' : user.lifecycleStatus,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
        entity: 'User',
        entityId: userId,
        oldValue: { isActive: user.isActive },
        newValue: { isActive },
        metadata: { reason },
      },
    });

    return updated;
  }

  // ─── Audit Logs (filtered) ────────────────────────────────────────────────

  async getAuditLogs(params: {
    page?: number | string;
    limit?: number | string;
    entity?: string;
    action?: string;
    userId?: string;
    adminId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(params.limit) || 50));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.entity) where.entity = params.entity;
    if (params.action) where.action = { contains: params.action, mode: 'insensitive' };
    if (params.userId) where.userId = params.userId;
    if (params.adminId) where.adminId = params.adminId;
    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = new Date(params.dateFrom);
      if (params.dateTo) where.createdAt.lte = new Date(params.dateTo);
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, phone: true, name: true } },
          admin: { select: { id: true, name: true, role: true } },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── CSV Export ───────────────────────────────────────────────────────────

  async exportUsers(params: { dateFrom?: string; dateTo?: string; status?: string }): Promise<string> {
    const where: any = {};
    if (params.status) where.lifecycleStatus = params.status;
    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = new Date(params.dateFrom);
      if (params.dateTo) where.createdAt.lte = new Date(params.dateTo);
    }

    const users = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, phone: true, name: true, email: true, lifecycleStatus: true,
        isActive: true, createdAt: true, lastActiveAt: true,
        _count: { select: { challanSearches: true } },
      },
      take: 10000,
    });

    const headers = ['ID', 'Phone', 'Name', 'Email', 'Status', 'Active', 'Searches', 'Created At', 'Last Active'];
    const rows = users.map((u) => [
      u.id, u.phone, u.name ?? '', u.email ?? '', u.lifecycleStatus,
      u.isActive ? 'Yes' : 'No', u._count.challanSearches,
      u.createdAt.toISOString(), u.lastActiveAt?.toISOString() ?? '',
    ]);

    return [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  }

  // ─── Lifecycle utility (called by other services) ─────────────────────────

  async updateLifecycleStatus(userId: string, newStatus: UserLifecycleStatus) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.lifecycleStatus === newStatus) return;

    await Promise.all([
      this.prisma.user.update({
        where: { id: userId },
        data: { lifecycleStatus: newStatus, lastActiveAt: new Date() },
      }),
      this.prisma.userStatusHistory.create({
        data: { userId, oldStatus: user.lifecycleStatus, newStatus, changedBy: null },
      }),
    ]);
  }

  // ─── Lead Challans (per-challan CRM tracking) ────────────────────────────

  async getLeadChallans(leadId: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');
    return this.prisma.leadChallan.findMany({ where: { leadId }, orderBy: { createdAt: 'desc' } });
  }

  async createLeadChallan(leadId: string, data: {
    challanNumber: string;
    realAmount?: number | null;
    amount: number;
    location: string;
    settledAmount?: number | null;
  }) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');
    return this.prisma.leadChallan.create({ data: { leadId, ...data } });
  }

  async updateLeadChallan(challanId: string, data: {
    challanNumber?: string;
    realAmount?: number | null;
    amount?: number;
    location?: string;
    settledAmount?: number | null;
  }) {
    const challan = await this.prisma.leadChallan.findUnique({ where: { id: challanId } });
    if (!challan) throw new NotFoundException('Challan not found');
    return this.prisma.leadChallan.update({ where: { id: challanId }, data });
  }

  async deleteLeadChallan(challanId: string) {
    const challan = await this.prisma.leadChallan.findUnique({ where: { id: challanId } });
    if (!challan) throw new NotFoundException('Challan not found');
    await this.prisma.leadChallan.delete({ where: { id: challanId } });
    return { deleted: true };
  }

  // ─── User Challans (CRM tracking) ────────────────────────────────────────

  async getUserChallans(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.userChallan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createUserChallan(userId: string, data: {
    challanNumber: string;
    amount: number;
    location: string;
    settledAmount?: number | null;
  }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.userChallan.create({ data: { userId, ...data } });
  }

  async updateUserChallan(challanId: string, data: {
    challanNumber?: string;
    amount?: number;
    location?: string;
    settledAmount?: number | null;
  }) {
    const challan = await this.prisma.userChallan.findUnique({ where: { id: challanId } });
    if (!challan) throw new NotFoundException('Challan not found');

    return this.prisma.userChallan.update({ where: { id: challanId }, data });
  }

  async deleteUserChallan(challanId: string) {
    const challan = await this.prisma.userChallan.findUnique({ where: { id: challanId } });
    if (!challan) throw new NotFoundException('Challan not found');

    await this.prisma.userChallan.delete({ where: { id: challanId } });
    return { deleted: true };
  }

  // ─── Legacy (keep existing callers working) ───────────────────────────────

  async createAuditLog(data: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.auditLog.create({ data });
  }
}
