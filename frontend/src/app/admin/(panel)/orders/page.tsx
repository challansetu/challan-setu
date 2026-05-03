"use client";

import React, { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { adminApi } from "@/lib/admin-api";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  SettlementStatusBadge,
} from "@/components/admin/ui/Badge";
import { Pagination } from "@/components/admin/ui/Pagination";
import { SkeletonTable } from "@/components/admin/ui/Skeleton";
import { Modal } from "@/components/admin/ui/Modal";
import { Button } from "@/components/admin/ui/Button";
import { formatCurrency, formatDate, downloadBlob } from "@/lib/utils";
import type { OrdersResponse, TrackingStatus } from "@/types/admin";
import { Download, Trash2, ChevronDown, Check, Loader2 } from "lucide-react";

const ORDER_STATUSES = [
  "CREATED",
  "PAYMENT_PENDING",
  "PAYMENT_COMPLETED",
  "SETTLED",
  "PAYMENT_FAILED",
  "CANCELLED",
];

const TRACKING_STATUSES: { value: TrackingStatus; label: string }[] = [
  { value: "ORDER_CREATED",      label: "Order Created" },
  { value: "LAWYER_ASSIGNED",    label: "Lawyer Assigned" },
  { value: "UNDER_REVIEW",       label: "Under Review" },
  { value: "IN_PROGRESS",        label: "In Progress" },
  { value: "SETTLED",            label: "Settled" },
  { value: "REFLECTION_PENDING", label: "Reflection Pending" },
];

// ─── Inline tracking status cell ─────────────────────────────────────────────

function TrackingCell({
  orderId,
  current,
  onSaved,
}: {
  orderId: string;
  current?: TrackingStatus;
  onSaved: () => void;
}) {
  const [selected, setSelected] = useState<TrackingStatus>(
    current ?? "ORDER_CREATED"
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Only show the save button when value has changed from what's in DB
  const isDirty = selected !== (current ?? "ORDER_CREATED");

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateOrderTracking(orderId, selected);
      setSaved(true);
      onSaved();
      setTimeout(() => setSaved(false), 1500);
    } catch {
      // reset on error
      setSelected(current ?? "ORDER_CREATED");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5 min-w-[160px]">
      <div className="relative flex-1">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as TrackingStatus)}
          className="w-full appearance-none pl-2.5 pr-6 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 cursor-pointer"
        >
          {TRACKING_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
      </div>

      {isDirty && !saving && !saved && (
        <button
          onClick={handleSave}
          className="flex-shrink-0 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg px-2 py-1.5 transition-colors"
        >
          Save
        </button>
      )}
      {saving && (
        <Loader2 className="flex-shrink-0 w-4 h-4 text-indigo-500 animate-spin" />
      )}
      {saved && (
        <Check className="flex-shrink-0 w-4 h-4 text-emerald-500" />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; orderNumber: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const getParams = useCallback(() => ({
    page: parseInt(searchParams.get("page") ?? "1"),
    status: searchParams.get("status") ?? "",
    userId: searchParams.get("userId") ?? "",
    dateFrom: searchParams.get("dateFrom") ?? "",
    dateTo: searchParams.get("dateTo") ?? "",
  }), [searchParams]);

  const params = getParams();

  const { data, isLoading, error, mutate } = useSWR<OrdersResponse>(
    ["orders", JSON.stringify(params)],
    () => adminApi.orders({
      page: params.page,
      limit: 20,
      status: params.status || undefined,
      userId: params.userId || undefined,
      dateFrom: params.dateFrom || undefined,
      dateTo: params.dateTo || undefined,
    })
  );

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    if (key !== "page") p.set("page", "1");
    router.push(`/admin/orders?${p.toString()}`);
  };

  const [exporting, setExporting] = useState(false);
  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await adminApi.exportOrders({
        status: params.status || undefined,
        dateFrom: params.dateFrom || undefined,
        dateTo: params.dateTo || undefined,
      });
      downloadBlob(blob, "orders.csv");
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await adminApi.deleteOrder(deleteTarget.id);
      setDeleteTarget(null);
      mutate();
    } catch (err: any) {
      setDeleteError(err?.response?.data?.message ?? "Failed to delete order.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <Button variant="secondary" size="sm" onClick={handleExport} loading={exporting}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <select
            value={params.status}
            onChange={(e) => updateParam("status", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
          {params.userId && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 border border-primary-200 rounded-lg text-sm text-primary-700">
              Filtered by user
              <button onClick={() => updateParam("userId", "")} className="text-primary-500 hover:text-primary-700 font-bold">×</button>
            </div>
          )}
          <input type="date" value={params.dateFrom} onChange={(e) => updateParam("dateFrom", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <input type="date" value={params.dateTo} onChange={(e) => updateParam("dateTo", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={10} cols={10} />
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-red-600">Failed to load orders.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 whitespace-nowrap">Order #</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 whitespace-nowrap">Vehicle</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Items</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Gross</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Discount</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Final</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Payment</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Settlement</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 whitespace-nowrap">Tracking</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 whitespace-nowrap">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.orders?.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs whitespace-nowrap">{order.orderNumber}</p>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-xs">{order.user?.phone}</p>
                      {order.user?.name && <p className="text-gray-400 text-xs">{order.user.name}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {order.vehicleNumber
                        ? <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{order.vehicleNumber}</span>
                        : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="px-4 py-3 text-center">{order.itemCount}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(order.grossAmount)}</td>
                    <td className="px-4 py-3 text-right text-green-700 tabular-nums">
                      {order.discountAmount > 0 ? `-${formatCurrency(order.discountAmount)}` : "-"}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatCurrency(order.finalAmount)}</td>
                    <td className="px-4 py-3">
                      {order.payment ? <PaymentStatusBadge status={order.payment.status} /> : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      {order.settlement ? <SettlementStatusBadge status={order.settlement.status} /> : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      {/* Only show tracking control for paid orders */}
                      {order.status === "PAYMENT_COMPLETED" || order.status === "SETTLED" ? (
                        <TrackingCell
                          orderId={order.id}
                          current={order.trackingStatus}
                          onSaved={mutate}
                        />
                      ) : (
                        <span className="text-gray-300 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDeleteTarget({ id: order.id, orderNumber: order.orderNumber })}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete order"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!data?.orders?.length && (
                  <tr>
                    <td colSpan={12} className="px-4 py-10 text-center text-gray-400">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {data && data.totalPages > 1 && (
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={(p) => updateParam("page", String(p))} />
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => { setDeleteTarget(null); setDeleteError(""); }}
        title="Delete Order"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to permanently delete order{" "}
            <span className="font-mono font-bold text-gray-900">{deleteTarget?.orderNumber}</span>?
            This cannot be undone.
          </p>
          {deleteError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{deleteError}</p>
          )}
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" size="sm" onClick={() => { setDeleteTarget(null); setDeleteError(""); }}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
              Delete Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
