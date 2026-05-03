"use client";

import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/admin/ui/Button";
import { Modal } from "@/components/admin/ui/Modal";
import { SkeletonTable } from "@/components/admin/ui/Skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ManualTransaction } from "@/types/admin";
import { ManualTransactionForm } from "@/components/admin/manual-transactions/ManualTransactionForm";
import { useToast } from "@/components/admin/ui/Toast";

export default function ManualTransactionEntry() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ManualTransaction | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: records, isLoading, error } = useSWR(
    ["manual-transactions", debouncedSearch],
    () => adminApi.manualTransactions(debouncedSearch || undefined)
  );

  const handleCreateOrUpdate = async (formData: any) => {
    setSubmitting(true);
    try {
      if (editingRecord) {
        await adminApi.updateManualTransaction(editingRecord.id, formData);
        showToast("Record updated", "success");
      } else {
        await adminApi.createManualTransaction(formData);
        showToast("Record created", "success");
      }
      setIsModalOpen(false);
      setEditingRecord(null);
      mutate(["manual-transactions", debouncedSearch]);
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Error saving record",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setSubmitting(true);
    try {
      await adminApi.deleteManualTransaction(deleteConfirmId);
      showToast("Record deleted", "success");
      setDeleteConfirmId(null);
      mutate(["manual-transactions", debouncedSearch]);
    } catch (err: any) {
      showToast("Error deleting record", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manual Transaction Entry</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Record
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, vehicle, or state..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <SkeletonTable rows={5} cols={12} />
        ) : error ? (
          <div className="p-8 text-center text-red-600">Failed to load records.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">User Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Vehicle</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">State</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Challans</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Total Amount</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Settled</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Discount %</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Profit</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Gov Portal</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Created At</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 uppercase">
                {records?.map((record: ManualTransaction) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">{record.userName}</td>
                    <td className="px-4 py-3 font-mono text-xs">{record.phoneNumber}</td>
                    <td className="px-4 py-3 font-mono text-xs">{record.vehicleNumber}</td>
                    <td className="px-4 py-3 text-xs">{record.state ?? "-"}</td>
                    <td className="px-4 py-3 text-center">{record.totalChallans}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(record.totalChallanAmount)}</td>
                    <td className="px-4 py-3 text-right">
                      {record.settledAmount !== null ? formatCurrency(record.settledAmount) : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {record.discountPercentage !== null ? `${record.discountPercentage.toFixed(1)}%` : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {record.profit !== null ? formatCurrency(record.profit) : "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {record.settledOnGovPortal ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                      {formatDate(record.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingRecord(record);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(record.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!records?.length && (
                  <tr>
                    <td colSpan={12} className="px-4 py-12 text-center text-gray-400 italic">
                      No manual records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        title={editingRecord ? "Edit Manual Record" : "Add Manual Record"}
        className="max-w-2xl"
      >
        <ManualTransactionForm
          initialData={editingRecord || {}}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingRecord(null);
          }}
          loading={submitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this record? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setDeleteConfirmId(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200" onClick={handleDelete} loading={submitting}>
              Delete Record
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
