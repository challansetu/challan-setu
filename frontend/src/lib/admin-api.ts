import axios from "axios";
import type {
  DashboardData,
  UsersResponse,
  UserDetail,
  OrdersResponse,
  PaymentsResponse,
  SettlementsResponse,
  AuditLogsResponse,
  AdminUser,
  AdminNote,
  LeadsResponse,
  ListLeadsParams,
  ListUsersParams,
  ListOrdersParams,
  ListPaymentsParams,
  ListSettlementsParams,
  ListAuditLogsParams,
  ChallanSearch,
} from "@/types/admin";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/admin/login")
    ) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  login: async (email: string, password: string) => {
    const res = await axiosInstance.post<{
      accessToken: string;
      admin: AdminUser;
    }>("/admin/auth/login", { email, password });
    return res.data;
  },

  me: async () => {
    const res = await axiosInstance.get<AdminUser>("/admin/auth/me");
    return res.data;
  },

  dashboard: async () => {
    const res = await axiosInstance.get<DashboardData>("/admin/dashboard");
    return res.data;
  },

  leads: async (params: ListLeadsParams = {}) => {
    const res = await axiosInstance.get<LeadsResponse>("/admin/leads", {
      params,
    });
    return res.data;
  },

  leadDetail: async (id: string) => {
    const res = await axiosInstance.get<import("@/types/admin").Lead>(`/admin/leads/${id}`);
    return res.data;
  },

  updateLead: async (id: string, data: {
    crmStatus?: string;
    paymentStatus?: string;
    totalChallan?: number | null;
    paidAmount?: number | null;
    settledAmount?: number | null;
    discountGiven?: number | null;
  }) => {
    const res = await axiosInstance.patch<import("@/types/admin").Lead>(`/admin/leads/${id}`, data);
    return res.data;
  },

  users: async (params: ListUsersParams = {}) => {
    const res = await axiosInstance.get<UsersResponse>("/admin/users", {
      params,
    });
    return res.data;
  },

  userDetail: async (id: string) => {
    const res = await axiosInstance.get<UserDetail>(`/admin/users/${id}`);
    return res.data;
  },

  userOrders: async (id: string, page = 1, limit = 10) => {
    const res = await axiosInstance.get<OrdersResponse>(
      `/admin/users/${id}/orders`,
      { params: { page, limit } }
    );
    return res.data;
  },

  userSearches: async (id: string, page = 1, limit = 10) => {
    const res = await axiosInstance.get<{
      searches: ChallanSearch[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/admin/users/${id}/searches`, { params: { page, limit } });
    return res.data;
  },

  userNotes: async (id: string) => {
    const res = await axiosInstance.get<AdminNote[]>(
      `/admin/users/${id}/notes`
    );
    return res.data;
  },

  addNote: async (userId: string, content: string, isPinned = false) => {
    const res = await axiosInstance.post<AdminNote>(
      `/admin/users/${userId}/notes`,
      { content, isPinned }
    );
    return res.data;
  },

  deleteNote: async (userId: string, noteId: string) => {
    await axiosInstance.delete(`/admin/users/${userId}/notes/${noteId}`);
  },

  changeUserStatus: async (
    userId: string,
    status: string,
    reason?: string
  ) => {
    const res = await axiosInstance.post(`/admin/users/${userId}/status`, {
      status,
      reason,
    });
    return res.data;
  },

  toggleUserActive: async (
    userId: string,
    isActive: boolean,
    reason?: string
  ) => {
    const res = await axiosInstance.put(
      `/admin/users/${userId}/toggle-active`,
      { isActive, reason }
    );
    return res.data;
  },

  orders: async (params: ListOrdersParams = {}) => {
    const res = await axiosInstance.get<OrdersResponse>("/admin/orders", {
      params,
    });
    return res.data;
  },

  payments: async (params: ListPaymentsParams = {}) => {
    const res = await axiosInstance.get<PaymentsResponse>("/admin/payments", {
      params,
    });
    return res.data;
  },

  deleteOrder: async (id: string) => {
    await axiosInstance.delete(`/admin/orders/${id}`);
  },

  updateOrderTracking: async (id: string, status: string, note?: string) => {
    const res = await axiosInstance.put(`/admin/orders/${id}/tracking`, { status, note });
    return res.data;
  },

  settlements: async (params: ListSettlementsParams = {}) => {
    const res = await axiosInstance.get<SettlementsResponse>(
      "/admin/settlements",
      { params }
    );
    return res.data;
  },

  settleSettlement: async (id: string, externalRef?: string) => {
    const res = await axiosInstance.put(`/admin/settlements/${id}/settle`, {
      externalRef,
    });
    return res.data;
  },

  auditLogs: async (params: ListAuditLogsParams = {}) => {
    const res = await axiosInstance.get<AuditLogsResponse>(
      "/admin/audit-logs",
      { params }
    );
    return res.data;
  },

  exportUsers: async (params: {
    dateFrom?: string;
    dateTo?: string;
    status?: string;
  }) => {
    const res = await axiosInstance.get("/admin/export/users", {
      params,
      responseType: "blob",
    });
    return res.data as Blob;
  },

  exportOrders: async (params: {
    dateFrom?: string;
    dateTo?: string;
    status?: string;
  }) => {
    const res = await axiosInstance.get("/admin/export/orders", {
      params,
      responseType: "blob",
    });
    return res.data as Blob;
  },

};

export default axiosInstance;
