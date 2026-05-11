"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import {
  ArrowLeft,
  Car,
  ChevronDown,
  ChevronUp,
  Pin,
  Trash2,
  Plus,
  ToggleLeft,
  ToggleRight,
  Search,
  ShoppingCart,
  IndianRupee,
  Clock,
  Check,
  Loader2,
  FileText,
  Pencil,
  X,
  TrendingDown,
} from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/components/admin/ui/Toast";
import { Button } from "@/components/admin/ui/Button";
import { Card } from "@/components/admin/ui/Card";
import { StatCard } from "@/components/admin/ui/StatCard";
import {
  UserStatusBadge,
  OrderStatusBadge,
} from "@/components/admin/ui/Badge";
import { SkeletonLine } from "@/components/admin/ui/Skeleton";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import type { UserDetail, UserLifecycleStatus, TrackingStatus, UserChallan } from "@/types/admin";

const TRACKING_STATUSES: { value: TrackingStatus; label: string }[] = [
  { value: "ORDER_CREATED",      label: "Order Created" },
  { value: "LAWYER_ASSIGNED",    label: "Lawyer Assigned" },
  { value: "UNDER_REVIEW",       label: "Lawyer Reviewing Case" },
  { value: "IN_PROGRESS",        label: "Settlement In Progress" },
  { value: "SETTLED",            label: "Challan Settled" },
  { value: "REFLECTION_PENDING", label: "Awaiting Portal Update" },
];

function TrackingCell({
  orderId,
  current,
  onSaved,
}: {
  orderId: string;
  current?: TrackingStatus;
  onSaved: () => void;
}) {
  const [selected, setSelected] = useState<TrackingStatus>(current ?? "ORDER_CREATED");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isDirty = selected !== (current ?? "ORDER_CREATED");

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateOrderTracking(orderId, selected);
      setSaved(true);
      onSaved();
      setTimeout(() => setSaved(false), 1500);
    } catch {
      setSelected(current ?? "ORDER_CREATED");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative flex-1">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as TrackingStatus)}
          className="w-full appearance-none pl-2.5 pr-6 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 cursor-pointer"
        >
          {TRACKING_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
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
      {saving && <Loader2 className="flex-shrink-0 w-4 h-4 text-indigo-500 animate-spin" />}
      {saved && <Check className="flex-shrink-0 w-4 h-4 text-emerald-500" />}
    </div>
  );
}

const CHALLAN_LOCATIONS = [
  "Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad", "Chandigarh", "Himachal",
];

const EMPTY_FORM = { challanNumber: "", amount: "", location: "Delhi", settledAmount: "" };

function UserChallansSection({ userId }: { userId: string }) {
  const { showToast } = useToast();
  const { data: challans, isLoading, mutate } = useSWR<UserChallan[]>(
    `user-challans-${userId}`,
    () => adminApi.getUserChallans(userId),
    { revalidateOnFocus: false }
  );

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalCount = challans?.length ?? 0;
  const totalAmount = challans?.reduce((s, c) => s + c.amount, 0) ?? 0;
  const totalSettled = challans?.reduce((s, c) => s + (c.settledAmount ?? 0), 0) ?? 0;
  const totalSaved = challans?.reduce((s, c) => s + (c.settledAmount != null ? c.amount - c.settledAmount : 0), 0) ?? 0;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.challanNumber.trim() || !form.amount || !form.location) return;
    setSaving(true);
    try {
      await adminApi.createUserChallan(userId, {
        challanNumber: form.challanNumber.trim(),
        amount: parseFloat(form.amount),
        location: form.location,
        settledAmount: form.settledAmount ? parseFloat(form.settledAmount) : null,
      });
      setForm(EMPTY_FORM);
      await mutate();
      showToast("Challan added", "success");
    } catch {
      showToast("Failed to add challan", "error");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (c: UserChallan) => {
    setEditId(c.id);
    setEditForm({
      challanNumber: c.challanNumber,
      amount: String(c.amount),
      location: c.location,
      settledAmount: c.settledAmount != null ? String(c.settledAmount) : "",
    });
  };

  const handleUpdate = async (challanId: string) => {
    setSaving(true);
    try {
      await adminApi.updateUserChallan(userId, challanId, {
        challanNumber: editForm.challanNumber.trim(),
        amount: parseFloat(editForm.amount),
        location: editForm.location,
        settledAmount: editForm.settledAmount ? parseFloat(editForm.settledAmount) : null,
      });
      setEditId(null);
      await mutate();
      showToast("Challan updated", "success");
    } catch {
      showToast("Failed to update challan", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (challanId: string) => {
    setDeletingId(challanId);
    try {
      await adminApi.deleteUserChallan(userId, challanId);
      await mutate();
      showToast("Challan deleted", "success");
    } catch {
      showToast("Failed to delete challan", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-5">
        <FileText className="h-4 w-4 text-indigo-500" />
        <h2 className="text-base font-semibold text-gray-900">Challans</h2>
      </div>

      {/* Summary stats */}
      {totalCount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total Challans", value: totalCount, color: "text-gray-900" },
            { label: "Total Amount", value: `₹${totalAmount.toLocaleString("en-IN")}`, color: "text-red-600" },
            { label: "Total Settled", value: `₹${totalSettled.toLocaleString("en-IN")}`, color: "text-blue-600" },
            { label: "Total Saved", value: `₹${totalSaved.toLocaleString("en-IN")}`, color: "text-emerald-600" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add new challan form */}
      <form onSubmit={handleCreate} className="mb-5 p-4 bg-indigo-50 rounded-xl border border-indigo-100 space-y-3">
        <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Add Challan</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Challan number"
            value={form.challanNumber}
            onChange={(e) => setForm((f) => ({ ...f, challanNumber: e.target.value }))}
            className="col-span-2 sm:col-span-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            required
          />
          <div className="relative col-span-2 sm:col-span-1">
            <select
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              className="w-full appearance-none pl-3 pr-7 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              {CHALLAN_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          <input
            type="number"
            placeholder="Original amount (₹)"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            min={0}
            step={0.01}
            required
          />
          <input
            type="number"
            placeholder="Settled at (₹) — optional"
            value={form.settledAmount}
            onChange={(e) => setForm((f) => ({ ...f, settledAmount: e.target.value }))}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            min={0}
            step={0.01}
          />
        </div>
        <button
          type="submit"
          disabled={saving || !form.challanNumber.trim() || !form.amount}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg px-3 py-2 transition-colors"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          Add Challan
        </button>
      </form>

      {/* Challan list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : !challans?.length ? (
        <p className="text-sm text-gray-400 text-center py-4">No challans added yet</p>
      ) : (
        <div className="space-y-2">
          {challans.map((c) => {
            const amountSaved = c.settledAmount != null ? c.amount - c.settledAmount : null;
            const isEditing = editId === c.id;

            if (isEditing) {
              return (
                <div key={c.id} className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editForm.challanNumber}
                      onChange={(e) => setEditForm((f) => ({ ...f, challanNumber: e.target.value }))}
                      className="col-span-2 sm:col-span-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                    />
                    <div className="relative col-span-2 sm:col-span-1">
                      <select
                        value={editForm.location}
                        onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                        className="w-full appearance-none pl-3 pr-7 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                      >
                        {CHALLAN_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) => setEditForm((f) => ({ ...f, amount: e.target.value }))}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                      min={0}
                      step={0.01}
                    />
                    <input
                      type="number"
                      placeholder="Settled at (₹)"
                      value={editForm.settledAmount}
                      onChange={(e) => setEditForm((f) => ({ ...f, settledAmount: e.target.value }))}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                      min={0}
                      step={0.01}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(c.id)}
                      disabled={saving}
                      className="flex items-center gap-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-semibold text-gray-900">{c.challanNumber}</span>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{c.location}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap text-xs">
                    <span className="text-red-600 font-medium">₹{c.amount.toLocaleString("en-IN")}</span>
                    {c.settledAmount != null && (
                      <>
                        <span className="text-gray-400">→</span>
                        <span className="text-blue-600 font-medium">Settled ₹{c.settledAmount.toLocaleString("en-IN")}</span>
                        {amountSaved != null && amountSaved > 0 && (
                          <span className="flex items-center gap-0.5 text-emerald-600 font-semibold">
                            <TrendingDown className="w-3 h-3" />
                            Saved ₹{amountSaved.toLocaleString("en-IN")}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(c)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

const LIFECYCLE_STATUSES: UserLifecycleStatus[] = [
  "NEW_USER",
  "ACTIVE",
  "PAYMENT_PENDING",
  "PAYMENT_FAILED",
  "COMPLETED",
  "CHURNED",
  "BLOCKED",
];

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { admin } = useAdminAuth();
  const { showToast } = useToast();

  const [vehiclesExpanded, setVehiclesExpanded] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [notePinned, setNotePinned] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [newStatus, setNewStatus] = useState<UserLifecycleStatus | "">("");
  const [statusReason, setStatusReason] = useState("");
  const [changingStatus, setChangingStatus] = useState(false);
  const [togglingActive, setTogglingActive] = useState(false);

  const swrKey = `user-${id}`;
  const { data: user, isLoading, error, mutate } = useSWR<UserDetail>(
    swrKey,
    () => adminApi.userDetail(id)
  );

  const canManage =
    admin?.role === "SUPER_ADMIN" || admin?.role === "ADMIN";

  const handleToggleActive = async () => {
    if (!user) return;
    setTogglingActive(true);
    try {
      await adminApi.toggleUserActive(id, !user.isActive);
      await mutate();
      showToast(
        `User ${!user.isActive ? "activated" : "deactivated"} successfully`,
        "success"
      );
    } catch {
      showToast("Failed to toggle user status", "error");
    } finally {
      setTogglingActive(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    setAddingNote(true);
    try {
      await adminApi.addNote(id, noteContent.trim(), notePinned);
      setNoteContent("");
      setNotePinned(false);
      await mutate();
      showToast("Note added successfully", "success");
    } catch {
      showToast("Failed to add note", "error");
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await adminApi.deleteNote(id, noteId);
      await mutate();
      showToast("Note deleted", "success");
    } catch {
      showToast("Failed to delete note", "error");
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus) return;
    setChangingStatus(true);
    try {
      await adminApi.changeUserStatus(id, newStatus, statusReason || undefined);
      setNewStatus("");
      setStatusReason("");
      await mutate();
      showToast("User status updated successfully", "success");
    } catch {
      showToast("Failed to update status", "error");
    } finally {
      setChangingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <SkeletonLine className="w-6 h-6 rounded-full" />
          <SkeletonLine className="w-48 h-6" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <SkeletonLine className="w-32 h-8" />
          <SkeletonLine className="w-64 h-5" />
          <SkeletonLine className="w-48 h-5" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load user details.
      </div>
    );
  }

  const sortedNotes = [...(user.adminNotes ?? [])].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.phone.slice(-2);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back + Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/admin/users"
          className="flex items-center gap-1.5 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Users
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{user.name ?? user.phone}</span>
      </div>

      {/* Header Card */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary-600 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{user.name ?? "No Name"}</h1>
                <p className="text-gray-500 font-mono">{user.phone}</p>
                {user.email && <p className="text-gray-400 text-sm">{user.email}</p>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <UserStatusBadge status={user.lifecycleStatus} />
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
                {admin?.role === "SUPER_ADMIN" && (
                  <button
                    onClick={handleToggleActive}
                    disabled={togglingActive}
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    {user.isActive ? (
                      <ToggleRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-gray-400" />
                    )}
                    {togglingActive ? "..." : "Toggle"}
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Joined {formatDate(user.createdAt)}</p>
          </div>
        </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Search className="h-5 w-5 text-blue-600" />}
          iconBgClass="bg-blue-100"
          label="Total Searches"
          value={user._count?.challanSearches ?? 0}
        />
        <StatCard
          icon={<ShoppingCart className="h-5 w-5 text-purple-600" />}
          iconBgClass="bg-purple-100"
          label="Total Orders"
          value={user._count?.orders ?? 0}
        />
        <StatCard
          icon={<IndianRupee className="h-5 w-5 text-emerald-600" />}
          iconBgClass="bg-emerald-100"
          label="Total Spent"
          value={formatCurrency(user.totalSpent ?? 0)}
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-gray-500" />}
          iconBgClass="bg-gray-100"
          label="Last Active"
          value={user.lastActiveAt ? formatDate(user.lastActiveAt) : "Never"}
        />
      </div>

      {/* Vehicles */}
      {user.vehicles && user.vehicles.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <button
            onClick={() => setVehiclesExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2 font-semibold text-gray-900">
              <Car className="h-4 w-4" />
              Vehicles ({user.vehicles.length})
            </div>
            {vehiclesExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>
          {vehiclesExpanded && (
            <div className="border-t border-gray-100 px-6 pb-4 pt-3">
              <div className="flex flex-wrap gap-2">
                {user.vehicles.map((v) => (
                  <span key={v.id} className="font-mono text-sm bg-gray-100 rounded-lg px-3 py-1.5">
                    {v.vehicleNumber}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Challans */}
      <UserChallansSection userId={user.id} />

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
          <Link href={`/admin/orders?userId=${user.id}`} className="text-sm text-primary-600 hover:text-primary-800">
            View all
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Order #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 min-w-[200px]">Settlement Progress</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {user.orders?.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-mono text-xs">{order.orderNumber}</td>
                  <td className="px-4 py-3">{formatCurrency(order.finalAmount)}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-4 py-3">
                    {order.status === "PAYMENT_COMPLETED" || order.status === "SETTLED" ? (
                      <TrackingCell
                        orderId={order.id}
                        current={order.trackingStatus as TrackingStatus}
                        onSaved={mutate}
                      />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
              {!user.orders?.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Searches */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Recent Searches</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Vehicle</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Challans Found</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {user.searches?.slice(0, 5).map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-mono text-xs">{s.vehicleNumber}</td>
                  <td className="px-4 py-3">{s.challansFound}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
              {!user.searches?.length && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">No searches yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status History */}
      <Card>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Status History</h2>
        {user.statusHistory && user.statusHistory.length > 0 ? (
          <div className="space-y-3">
            {[...user.statusHistory]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((entry) => (
                <div key={entry.id} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary-400 mt-2 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <UserStatusBadge status={entry.status} />
                      {entry.changedBy && (
                        <span className="text-xs text-gray-400">by {entry.changedBy.name}</span>
                      )}
                    </div>
                    {entry.reason && <p className="text-xs text-gray-500 mt-0.5">{entry.reason}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(entry.createdAt)}</p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No status history</p>
        )}
      </Card>

      {/* Admin Notes */}
      <Card>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Admin Notes</h2>

        {/* Add note form */}
        <div className="mb-5 space-y-2">
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add a note about this user..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={notePinned}
                onChange={(e) => setNotePinned(e.target.checked)}
                className="rounded"
              />
              <Pin className="h-3.5 w-3.5" />
              Pin this note
            </label>
            <Button size="sm" onClick={handleAddNote} loading={addingNote} disabled={!noteContent.trim()}>
              <Plus className="h-4 w-4" />
              Add Note
            </Button>
          </div>
        </div>

        {/* Notes list */}
        <div className="space-y-3">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-lg border ${note.isPinned ? "border-yellow-200 bg-yellow-50" : "border-gray-100 bg-gray-50"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {note.isPinned && <Pin className="h-3 w-3 text-yellow-600" />}
                    <span className="text-xs text-gray-400">
                      {note.admin?.name} ({note.admin?.role}) &bull; {formatDateTime(note.createdAt)}
                    </span>
                  </div>
                </div>
                {canManage && (
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {sortedNotes.length === 0 && <p className="text-sm text-gray-400">No notes yet</p>}
        </div>
      </Card>

      {/* Status Change */}
      {canManage && (
        <Card>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Change Lifecycle Status</h2>
          <div className="space-y-3">
            <div className="flex gap-3 flex-wrap">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as UserLifecycleStatus)}
                className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">Select new status...</option>
                {LIFECYCLE_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              placeholder="Reason (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button onClick={handleStatusChange} loading={changingStatus} disabled={!newStatus} variant="primary">
              Update Status
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
