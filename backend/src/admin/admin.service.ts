import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { UserLifecycleStatus, AdminRole, TrackingStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Dashboard ────────────────────────────────────────────────────────────

  async getDashboardStats() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      newUsersToday,
      totalOrders,
      ordersToday,
      totalRevenue,
      revenueToday,
      pendingSettlements,
      failedPaymentsToday,
      totalSearches,
      statusBreakdown,
      recentOrders,
      recentActivity,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.order.aggregate({
        _sum: { finalAmount: true },
        where: { status: { in: ['PAYMENT_COMPLETED', 'SETTLED'] } },
      }),
      this.prisma.order.aggregate({
        _sum: { finalAmount: true },
        where: { status: { in: ['PAYMENT_COMPLETED', 'SETTLED'] }, createdAt: { gte: todayStart } },
      }),
      this.prisma.settlement.count({
        where: { status: { in: ['PENDING', 'PROCESSING', 'MANUAL_REVIEW'] } },
      }),
      this.prisma.payment.count({ where: { status: 'FAILED', createdAt: { gte: todayStart } } }),
      this.prisma.challanSearch.count(),
      this.prisma.user.groupBy({ by: ['lifecycleStatus'], _count: { _all: true } }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, phone: true, name: true } },
          payment: { select: { status: true, method: true } },
        },
      }),
      this.prisma.auditLog.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, phone: true, name: true } } },
      }),
    ]);

    return {
      summary: {
        totalUsers,
        newUsersToday,
        totalOrders,
        ordersToday,
        totalRevenue: totalRevenue._sum.finalAmount ?? 0,
        revenueToday: revenueToday._sum.finalAmount ?? 0,
        pendingSettlements,
        failedPaymentsToday,
        totalSearches,
      },
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s.lifecycleStatus,
        count: s._count._all,
      })),
      recentOrders,
      activityFeed: recentActivity,
    };
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
    return {
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
    hasOrders?: string | boolean;
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

    if (params.hasOrders === 'true' || params.hasOrders === true) {
      where.orders = { some: {} };
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
          _count: { select: { orders: true, challanSearches: true, vehicles: true } },
          vehicles: { select: { vehicleNumber: true }, orderBy: { createdAt: 'desc' }, take: 3 },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    // Attach totalSpent for each user efficiently
    const userIds = users.map((u) => u.id);
    const spentRows = await this.prisma.order.groupBy({
      by: ['userId'],
      where: { userId: { in: userIds }, status: { in: ['PAYMENT_COMPLETED', 'SETTLED'] } },
      _sum: { finalAmount: true },
    });
    const spentMap = Object.fromEntries(spentRows.map((r) => [r.userId, r._sum.finalAmount ?? 0]));

    return {
      users: users.map((u) => ({ ...u, totalSpent: spentMap[u.id] ?? 0 })),
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
        _count: { select: { orders: true, challanSearches: true, vehicles: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const [orders, searches, totalSpent] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { payment: { select: { status: true, method: true } }, settlement: { select: { status: true } } },
      }),
      this.prisma.challanSearch.findMany({
        where: { userId },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, vehicleNumber: true, status: true, resultCount: true, cachedResponseUsed: true, createdAt: true },
      }),
      this.prisma.order.aggregate({
        _sum: { finalAmount: true },
        where: { userId, status: { in: ['PAYMENT_COMPLETED', 'SETTLED'] } },
      }),
    ]);

    return {
      ...user,
      orders,
      searches,
      totalSpent: totalSpent._sum.finalAmount ?? 0,
    };
  }

  async getUserOrders(userId: string, page = 1, limit = 10) {
    const skip = (Math.max(1, page) - 1) * Math.min(50, limit);
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          payment: { select: { status: true, method: true, razorpayPaymentId: true } },
          settlement: { select: { status: true, settledAt: true } },
          items: { select: { challanNo: true, amount: true } },
        },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);
    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
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

  // ─── Orders (filtered) ────────────────────────────────────────────────────

  async getOrders(params: {
    page?: number | string;
    limit?: number | string;
    status?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 25));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.userId) where.userId = params.userId;
    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = new Date(params.dateFrom);
      if (params.dateTo) where.createdAt.lte = new Date(params.dateTo);
    }

    const sortField = params.sortBy === 'finalAmount' ? 'finalAmount' : 'createdAt';
    const orderBy = { [sortField]: params.sortOrder === 'asc' ? 'asc' : 'desc' };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: { select: { id: true, phone: true, name: true } },
          payment: { select: { status: true, method: true } },
          settlement: { select: { status: true } },
          items: { select: { challanNo: true, amount: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── Payments (filtered) ──────────────────────────────────────────────────

  async getPayments(params: {
    page?: number | string;
    limit?: number | string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 25));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = new Date(params.dateFrom);
      if (params.dateTo) where.createdAt.lte = new Date(params.dateTo);
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              orderNumber: true,
              finalAmount: true,
              user: { select: { id: true, phone: true, name: true } },
            },
          },
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { payments, total, page, limit, totalPages: Math.ceil(total / limit) };
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

  // ─── Settlements (filtered) ───────────────────────────────────────────────

  async getSettlements(params: { page?: number | string; limit?: number | string; status?: string }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 25));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) where.status = params.status;
    else where.status = { in: ['PENDING', 'PROCESSING', 'MANUAL_REVIEW', 'FAILED'] };

    const [settlements, total] = await Promise.all([
      this.prisma.settlement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              orderNumber: true,
              finalAmount: true,
              itemCount: true,
              vehicleNumber: true,
              user: { select: { id: true, phone: true, name: true } },
            },
          },
        },
      }),
      this.prisma.settlement.count({ where }),
    ]);

    return { settlements, total, page, limit, totalPages: Math.ceil(total / limit) };
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
        _count: { select: { orders: true, challanSearches: true } },
      },
      take: 10000,
    });

    const headers = ['ID', 'Phone', 'Name', 'Email', 'Status', 'Active', 'Orders', 'Searches', 'Created At', 'Last Active'];
    const rows = users.map((u) => [
      u.id, u.phone, u.name ?? '', u.email ?? '', u.lifecycleStatus,
      u.isActive ? 'Yes' : 'No', u._count.orders, u._count.challanSearches,
      u.createdAt.toISOString(), u.lastActiveAt?.toISOString() ?? '',
    ]);

    return [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  }

  async exportOrders(params: { dateFrom?: string; dateTo?: string; status?: string }): Promise<string> {
    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = new Date(params.dateFrom);
      if (params.dateTo) where.createdAt.lte = new Date(params.dateTo);
    }

    const orders = await this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        orderNumber: true, status: true, grossAmount: true, discountAmount: true, finalAmount: true,
        itemCount: true, vehicleNumber: true, createdAt: true,
        user: { select: { phone: true, name: true } },
        payment: { select: { status: true, method: true, razorpayPaymentId: true } },
      },
      take: 10000,
    });

    const headers = ['Order#', 'Status', 'User Phone', 'User Name', 'Gross', 'Discount', 'Final', 'Items', 'Vehicle', 'Payment Status', 'Payment Method', 'Razorpay ID', 'Created At'];
    const rows = orders.map((o) => [
      o.orderNumber, o.status, o.user.phone, o.user.name ?? '', o.grossAmount, o.discountAmount,
      o.finalAmount, o.itemCount, o.vehicleNumber ?? '', o.payment?.status ?? '', o.payment?.method ?? '',
      o.payment?.razorpayPaymentId ?? '', o.createdAt.toISOString(),
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

  // ─── Order Tracking ───────────────────────────────────────────────────────

  async updateOrderTracking(
    orderId: string,
    newStatus: TrackingStatus,
    adminId: string,
    note?: string,
  ) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const historyEntry = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      ...(note ? { note } : {}),
    };

    const existingHistory = Array.isArray(order.trackingHistory) ? order.trackingHistory : [];

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        trackingStatus: newStatus,
        trackingHistory: [...existingHistory, historyEntry],
      },
    });

    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: 'TRACKING_STATUS_UPDATED',
        entity: 'Order',
        entityId: orderId,
        oldValue: { trackingStatus: order.trackingStatus },
        newValue: { trackingStatus: newStatus },
        metadata: { note },
      },
    });

    this.logger.log(`Order tracking updated: ${order.orderNumber} → ${newStatus}`);

    // TODO: trigger WhatsApp/SMS notification to user when status changes
    // Example hook: notificationService.sendTrackingUpdate(order.userId, newStatus);

    return { trackingStatus: updated.trackingStatus, trackingHistory: updated.trackingHistory };
  }

  // ─── Delete Order ─────────────────────────────────────────────────────────

  async deleteOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true, settlement: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    // Delete in dependency order to avoid FK violations
    await this.prisma.$transaction([
      this.prisma.settlement.deleteMany({ where: { orderId } }),
      this.prisma.payment.deleteMany({ where: { orderId } }),
      this.prisma.safeDrivingPromise.deleteMany({ where: { orderId } }),
      this.prisma.orderItem.deleteMany({ where: { orderId } }),
      this.prisma.order.delete({ where: { id: orderId } }),
    ]);

    this.logger.log(`Order deleted by admin: ${order.orderNumber}`);
    return { deleted: true, orderNumber: order.orderNumber };
  }

  // ─── Lead Challans (per-challan CRM tracking) ────────────────────────────

  async getLeadChallans(leadId: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');
    return this.prisma.leadChallan.findMany({ where: { leadId }, orderBy: { createdAt: 'desc' } });
  }

  async createLeadChallan(leadId: string, data: {
    challanNumber: string;
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
