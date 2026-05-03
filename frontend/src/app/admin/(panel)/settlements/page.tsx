"use client";

import React, { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { CheckCircle } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { SettlementStatusBadge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { Modal } from "@/components/admin/ui/Modal";
import { Pagination } from "@/components/admin/ui/Pagination";
import { SkeletonTable } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/components/admin/ui/Toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { SettlementsResponse, Settlement } from "@/types/admin";

const SETTLEMENT_STATUSES = [
  "PENDING",
  "PROCESSING",
  "MANUAL_REVIEW",
  "FAILED",
  "SETTLED",
];

export default function SettlementsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [settleModal, setSettleModal] = useState<Settlement | null>(null);
  const [externalRef, setExternalRef] = useState("");
  const [settling, setSettling] = useState(false);

  const getParams = useCallback(() => {
    return {
      page: parseInt(searchParams.get("page") ?? "1"),
      status: searchParams.get("status") ?? "",
    };
  }, [searchParams]);

  const params = getParams();

  const { data, isLoading, error, mutate } = useSWR<SettlementsResponse>(
    ["settlements", JSON.stringify(params)],
    () =>
      adminApi.settlements({
        page: params.page,
        limit: 20,
        status: params.status || undefined,
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
    router.push(`/admin/settlements?${p.toString()}`);
  };

  const handleSettle = async () => {
    if (!settleModal) return;
    setSettling(true);
    try {
      await adminApi.settleSettlement(settleModal.id, externalRef || undefined);
      await mutate();
      showToast("Settlement marked as settled", "success");
      setSettleModal(null);
      setExternalRef("");
    } catch {
      showToast("Failed to settle", "error");
    } finally {
      setSettling(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Settlements</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <select
          value={params.status}
          onChange={(e) => updateParam("status", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          {SETTLEMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={10} cols={7} />
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-red-600">
          Failed to load settlements.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Order #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Vehicle</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Attempts</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Created</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.settlements?.map((settlement) => (
                <tr key={settlement.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{settlement.order?.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs">{settlement.order?.user?.phone}</p>
                    {settlement.order?.user?.name && (
                      <p className="text-gray-400 text-xs">{settlement.order.user.name}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{settlement.order?.vehicleNumber ?? "-"}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(settlement.order?.finalAmount ?? 0)}</td>
                  <td className="px-4 py-3"><SettlementStatusBadge status={settlement.status} /></td>
                  <td className="px-4 py-3 text-center">{settlement.attempts}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(settlement.createdAt)}</td>
                  <td className="px-4 py-3">
                    {settlement.status !== "SETTLED" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSettleModal(settlement)}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Mark Settled
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {!data?.settlements?.length && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400">No settlements found</td>
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

      {/* Settle Modal */}
      <Modal
        isOpen={!!settleModal}
        onClose={() => {
          setSettleModal(null);
          setExternalRef("");
        }}
        title="Mark Settlement as Settled"
      >
        <div className="space-y-4">
          {settleModal && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="font-medium">Order: {settleModal.order?.orderNumber}</p>
              <p className="text-gray-500">Amount: {formatCurrency(settleModal.order?.finalAmount ?? 0)}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              External Reference (optional)
            </label>
            <input
              type="text"
              value={externalRef}
              onChange={(e) => setExternalRef(e.target.value)}
              placeholder="e.g. TXN123456"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setSettleModal(null);
                setExternalRef("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSettle} loading={settling}>
              Confirm Settlement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
