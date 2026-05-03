"use client";

import React from "react";
import useSWR from "swr";
import {
  Users,
  UserPlus,
  IndianRupee,
  ShoppingCart,
  Clock,
  XCircle,
  Activity,
} from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { StatCard } from "@/components/admin/ui/StatCard";
import { SkeletonCard, SkeletonTable } from "@/components/admin/ui/Skeleton";
import { UserStatusBadge, OrderStatusBadge } from "@/components/admin/ui/Badge";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/utils";
import type { DashboardData } from "@/types/admin";

function DashboardPage() {
  const { data, error, isLoading } = useSWR<DashboardData>(
    "dashboard",
    () => adminApi.dashboard()
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonTable rows={5} cols={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load dashboard data.
      </div>
    );
  }

  const s = data?.summary;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="h-6 w-6 text-blue-600" />}
          iconBgClass="bg-blue-100"
          label="Total Users"
          value={s?.totalUsers?.toLocaleString() ?? "-"}
          subtitle={`+${s?.newUsersToday ?? 0} today`}
          trendPositive
        />
        <StatCard
          icon={<UserPlus className="h-6 w-6 text-green-600" />}
          iconBgClass="bg-green-100"
          label="New Today"
          value={s?.newUsersToday?.toLocaleString() ?? "-"}
        />
        <StatCard
          icon={<IndianRupee className="h-6 w-6 text-emerald-600" />}
          iconBgClass="bg-emerald-100"
          label="Revenue Today"
          value={s?.revenueToday != null ? formatCurrency(s.revenueToday) : "-"}
          subtitle={`Total: ${s?.totalRevenue != null ? formatCurrency(s.totalRevenue) : "-"}`}
          trendPositive
        />
        <StatCard
          icon={<ShoppingCart className="h-6 w-6 text-purple-600" />}
          iconBgClass="bg-purple-100"
          label="Orders Today"
          value={s?.ordersToday?.toLocaleString() ?? "-"}
          subtitle={`Total: ${s?.totalOrders?.toLocaleString() ?? "-"}`}
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-yellow-600" />}
          iconBgClass="bg-yellow-100"
          label="Pending Settlements"
          value={s?.pendingSettlements?.toLocaleString() ?? "-"}
          trendPositive={s?.pendingSettlements === 0}
        />
        <StatCard
          icon={<XCircle className="h-6 w-6 text-red-600" />}
          iconBgClass="bg-red-100"
          label="Failed Payments Today"
          value={s?.failedPaymentsToday?.toLocaleString() ?? "-"}
          trendPositive={s?.failedPaymentsToday === 0}
        />
      </div>

      {/* Status Breakdown + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            User Status Breakdown
          </h2>
          <div className="flex flex-wrap gap-2">
            {data?.statusBreakdown?.map(({ status, count }) => (
              <div
                key={status}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100"
              >
                <UserStatusBadge status={status} />
                <span className="text-sm font-medium text-gray-700">
                  {count.toLocaleString()}
                </span>
              </div>
            ))}
            {!data?.statusBreakdown?.length && (
              <p className="text-sm text-gray-400">No data available</p>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-500" />
            Recent Activity
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {data?.activityFeed?.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary-400 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{item.action}</span>
                    {" on "}
                    <span className="text-gray-500">{item.entity}</span>
                    {item.admin && (
                      <span className="text-gray-400">
                        {" "}
                        by {item.admin.name}
                      </span>
                    )}
                    {item.user && (
                      <span className="text-gray-400">
                        {" "}
                        - {item.user.phone}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDateTime(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {!data?.activityFeed?.length && (
              <p className="text-sm text-gray-400">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Recent Orders
        </h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 whitespace-nowrap">Order #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 whitespace-nowrap">Vehicle</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Gross</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Discount</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Final</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.recentOrders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-xs">{order.user?.phone}</p>
                    {order.user?.name && <p className="text-gray-400 text-xs">{order.user.name}</p>}
                  </td>
                  <td className="px-4 py-3">
                    {order.vehicleNumber
                      ? <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{order.vehicleNumber}</span>
                      : <span className="text-gray-300 text-xs">-</span>}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(order.grossAmount)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-green-700">
                    {order.discountAmount > 0 ? `-${formatCurrency(order.discountAmount)}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">{formatCurrency(order.finalAmount)}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
              {!data?.recentOrders?.length && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">No recent orders</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
