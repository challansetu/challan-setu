"use client";

import React, { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { adminApi } from "@/lib/admin-api";
import { PaymentStatusBadge } from "@/components/admin/ui/Badge";
import { Pagination } from "@/components/admin/ui/Pagination";
import { SkeletonTable } from "@/components/admin/ui/Skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PaymentsResponse } from "@/types/admin";

const PAYMENT_STATUSES = ["CAPTURED", "FAILED", "CREATED", "REFUNDED"];

export default function PaymentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParams = useCallback(() => {
    return {
      page: parseInt(searchParams.get("page") ?? "1"),
      status: searchParams.get("status") ?? "",
      dateFrom: searchParams.get("dateFrom") ?? "",
      dateTo: searchParams.get("dateTo") ?? "",
    };
  }, [searchParams]);

  const params = getParams();

  const { data, isLoading, error } = useSWR<PaymentsResponse>(
    ["payments", JSON.stringify(params)],
    () =>
      adminApi.payments({
        page: params.page,
        limit: 20,
        status: params.status || undefined,
        dateFrom: params.dateFrom || undefined,
        dateTo: params.dateTo || undefined,
      })
  );

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) {
      p.set(key, value);
    } else {
      p.delete(key);
    }
    if (key !== "page") p.set("page", "1");
    router.push(`/admin/payments?${p.toString()}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <select
            value={params.status}
            onChange={(e) => updateParam("status", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="date"
            value={params.dateFrom}
            onChange={(e) => updateParam("dateFrom", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="date"
            value={params.dateTo}
            onChange={(e) => updateParam("dateTo", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={10} cols={7} />
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-red-600">
          Failed to load payments.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Razorpay ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Order #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Method</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Error</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.payments?.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs max-w-32 truncate">
                    {payment.razorpayPaymentId ?? "-"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{payment.order?.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs">{payment.order?.user?.phone}</p>
                    {payment.order?.user?.name && (
                      <p className="text-gray-400 text-xs">{payment.order.user.name}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(payment.amount)}</td>
                  <td className="px-4 py-3 text-gray-600">{payment.method ?? "-"}</td>
                  <td className="px-4 py-3"><PaymentStatusBadge status={payment.status} /></td>
                  <td className="px-4 py-3 text-red-500 text-xs">{payment.errorCode ?? "-"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(payment.createdAt)}</td>
                </tr>
              ))}
              {!data?.payments?.length && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400">No payments found</td>
                </tr>
              )}
            </tbody>
          </table>
          {data && data.totalPages > 1 && (
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={(p) => updateParam("page", String(p))}
            />
          )}
        </div>
      )}
    </div>
  );
}
