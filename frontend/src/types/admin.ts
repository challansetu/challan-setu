export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "SUPPORT_AGENT";

export type UserLifecycleStatus =
  | "NEW_USER"
  | "ACTIVE"
  | "PAYMENT_PENDING"
  | "PAYMENT_FAILED"
  | "COMPLETED"
  | "CHURNED"
  | "BLOCKED";

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
  realAmount: number | null;
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
  searches: ChallanSearch[];
  adminNotes: AdminNote[];
  statusHistory: StatusHistoryEntry[];
  vehicles: Vehicle[];
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
  totalLeads: number;
  leadsToday: number;
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
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: string;
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
