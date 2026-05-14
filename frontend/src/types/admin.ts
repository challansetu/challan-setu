export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "SUPPORT_AGENT";

export type TrackingStatus =
  | "ORDER_CREATED"
  | "LAWYER_ASSIGNED"
  | "UNDER_REVIEW"
  | "IN_PROGRESS"
  | "SETTLED"
  | "REFLECTION_PENDING";

export type UserLifecycleStatus =
  | "NEW_USER"
  | "ACTIVE"
  | "PAYMENT_PENDING"
  | "PAYMENT_FAILED"
  | "COMPLETED"
  | "CHURNED"
  | "BLOCKED";

export type OrderStatus =
  | "CREATED"
  | "PAYMENT_PENDING"
  | "PAYMENT_COMPLETED"
  | "SETTLED"
  | "PAYMENT_FAILED"
  | "CANCELLED";

export type PaymentStatus = "CAPTURED" | "FAILED" | "CREATED" | "REFUNDED";

export type SettlementStatus =
  | "PENDING"
  | "PROCESSING"
  | "SETTLED"
  | "FAILED"
  | "MANUAL_REVIEW";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export interface Lead {
  id: string;
  fullName: string;
  mobileNumber: string;
  vehicleNumber: string;
  consentAccepted: boolean;
  consentTimestamp: string;
  source: string;
  city: string | null;
  leadStatus: string;
  crmStatus: string;
  paymentStatus: string;
  challanSettled: string;
  totalChallan: number | null;
  paidAmount: number | null;
  settledAmount: number | null;
  discountGiven: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserCount {
  orders: number;
  challanSearches: number;
  vehicles: number;
}

export interface User {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  isActive: boolean;
  lifecycleStatus: UserLifecycleStatus;
  lastActiveAt: string | null;
  createdAt: string;
  totalSpent: number;
  _count: UserCount;
  vehicles?: { vehicleNumber: string }[];
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  createdAt: string;
}

export interface StatusHistoryEntry {
  id: string;
  status: UserLifecycleStatus;
  reason: string | null;
  createdAt: string;
  changedBy?: { name: string; role: AdminRole };
}

export interface AdminNote {
  id: string;
  userId: string;
  adminId: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  admin: { id: string; name: string; role: AdminRole };
}

export interface OrderItem {
  challanNo: string;
  amount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  grossAmount: number;
  discountAmount: number;
  finalAmount: number;
  itemCount: number;
  vehicleNumber: string | null;
  createdAt: string;
  user: { phone: string; name: string | null };
  payment: { status: PaymentStatus; method: string | null } | null;
  settlement: { status: SettlementStatus } | null;
  items?: OrderItem[];
  trackingStatus?: TrackingStatus;
}

export interface ChallanSearch {
  id: string;
  vehicleNumber: string;
  challansFound: number;
  createdAt: string;
  source?: string;
}

export interface LeadChallan {
  id: string;
  leadId: string;
  challanNumber: string;
  amount: number;
  location: string;
  settledAmount: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserChallan {
  id: string;
  userId: string;
  challanNumber: string;
  amount: number;
  location: string;
  settledAmount: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetail extends User {
  orders: Order[];
  searches: ChallanSearch[];
  adminNotes: AdminNote[];
  statusHistory: StatusHistoryEntry[];
  vehicles: Vehicle[];
}

export interface Payment {
  id: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  amount: number;
  status: PaymentStatus;
  method: string | null;
  errorCode: string | null;
  createdAt: string;
  order: {
    orderNumber: string;
    finalAmount: number;
    user: { phone: string; name: string | null };
  };
}

export interface Settlement {
  id: string;
  status: SettlementStatus;
  attempts: number;
  createdAt: string;
  externalRef?: string | null;
  order: {
    orderNumber: string;
    finalAmount: number;
    vehicleNumber: string | null;
    user: { phone: string; name: string | null };
  };
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  ipAddress?: string | null;
  createdAt: string;
  user: { phone: string; name: string | null } | null;
  admin: { name: string; role: AdminRole } | null;
}

export interface DashboardSummary {
  totalUsers: number;
  newUsersToday: number;
  totalOrders: number;
  ordersToday: number;
  totalRevenue: number;
  revenueToday: number;
  pendingSettlements: number;
  failedPaymentsToday: number;
  totalSearches: number;
}

export interface StatusBreakdownItem {
  status: UserLifecycleStatus;
  count: number;
}

export interface ActivityFeedItem {
  id: string;
  action: string;
  entity: string;
  createdAt: string;
  user?: { phone: string; name: string | null } | null;
  admin?: { name: string; role: AdminRole } | null;
}

export interface DashboardData {
  summary: DashboardSummary;
  statusBreakdown: StatusBreakdownItem[];
  recentOrders: Order[];
  activityFeed: ActivityFeedItem[];
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data?: T[];
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentsResponse {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SettlementsResponse {
  settlements: Settlement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  hasOrders?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface ListOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface ListPaymentsParams {
  page?: number;
  limit?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ListSettlementsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface ListAuditLogsParams {
  page?: number;
  limit?: number;
  entity?: string;
  action?: string;
  userId?: string;
  adminId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface QrScan {
  id: string;
  source: string;
  ip: string | null;
  userAgent: string | null;
  referrer: string | null;
  isBot: boolean;
  createdAt: string;
}

export interface QrScanSourceCount {
  source: string;
  count: number;
}

export interface QrScanSummary {
  totalScans: number;
  todayScans: number;
  last7DaysScans: number;
  bySource: QrScanSourceCount[];
}

export interface QrScansResponse {
  scans: QrScan[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
