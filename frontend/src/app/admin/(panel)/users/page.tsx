"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Eye, Search, Download, ChevronDown } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { UserStatusBadge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { Pagination } from "@/components/admin/ui/Pagination";
import { SkeletonTable } from "@/components/admin/ui/Skeleton";
import { formatCurrency, formatDate, downloadBlob } from "@/lib/utils";
import type { UsersResponse } from "@/types/admin";

const USER_STATUSES = [
  "NEW_USER",
  "ACTIVE",
  "PAYMENT_PENDING",
  "PAYMENT_FAILED",
  "COMPLETED",
  "CHURNED",
  "BLOCKED",
];

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "createdAt:asc", label: "Oldest First" },
  { value: "lastActiveAt:desc", label: "Last Active" },
  { value: "name:asc", label: "Name A-Z" },
  { value: "phone:asc", label: "Phone" },
];

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? ""
  );
  const [exporting, setExporting] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const getParams = useCallback(() => {
    const page = parseInt(searchParams.get("page") ?? "1");
    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status") ?? "";
    const dateFrom = searchParams.get("dateFrom") ?? "";
    const dateTo = searchParams.get("dateTo") ?? "";
    const sort = searchParams.get("sort") ?? "createdAt:desc";
    const [sortBy, sortOrder] = sort.split(":");
    return { page, search, status, dateFrom, dateTo, sortBy, sortOrder };
  }, [searchParams]);

  const params = getParams();

  const { data, isLoading, error } = useSWR<UsersResponse>(
    ["users", JSON.stringify(params)],
    () =>
      adminApi.users({
        page: params.page,
        limit: 20,
        search: params.search || undefined,
        status: params.status || undefined,
        dateFrom: params.dateFrom || undefined,
        dateTo: params.dateTo || undefined,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
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
    router.push(`/admin/users?${p.toString()}`);
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const p = new URLSearchParams(searchParams.toString());
      const current = p.get("search") ?? "";
      if (searchInput !== current) {
        if (searchInput) {
          p.set("search", searchInput);
        } else {
          p.delete("search");
        }
        p.set("page", "1");
        router.push(`/admin/users?${p.toString()}`);
      }
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Status multi-select
  const selectedStatuses = params.status
    ? params.status.split(",").filter(Boolean)
    : [];

  const toggleStatus = (s: string) => {
    const current = new Set(selectedStatuses);
    if (current.has(s)) {
      current.delete(s);
    } else {
      current.add(s);
    }
    updateParam("status", Array.from(current).join(","));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target as Node)
      ) {
        setStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await adminApi.exportUsers({
        status: params.status || undefined,
        dateFrom: params.dateFrom || undefined,
        dateTo: params.dateTo || undefined,
      });
      downloadBlob(blob, "users.csv");
    } catch {
      // silently fail
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExport}
          loading={exporting}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by phone, name, email..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status multi-select */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => setStatusDropdownOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
            >
              <span>
                {selectedStatuses.length > 0
                  ? `${selectedStatuses.length} status${selectedStatuses.length > 1 ? "es" : ""}`
                  : "All Statuses"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            {statusDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48 py-1">
                {USER_STATUSES.map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(s)}
                      onChange={() => toggleStatus(s)}
                      className="rounded"
                    />
                    <UserStatusBadge status={s} />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Date range */}
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

          {/* Sort */}
          <select
            value={`${params.sortBy}:${params.sortOrder}`}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={10} cols={8} />
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-red-600">
          Failed to load users.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Vehicles</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Orders</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Searches</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Total Spent</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Last Active</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Joined</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.users?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium">{user.phone}</td>
                  <td className="px-4 py-3">{user.name ?? <span className="text-gray-300">-</span>}</td>
                  <td className="px-4 py-3"><UserStatusBadge status={user.lifecycleStatus} /></td>
                  <td className="px-4 py-3">
                    {user.vehicles && user.vehicles.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.vehicles.map((v) => (
                          <span key={v.vehicleNumber} className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            {v.vehicleNumber}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">{user._count?.orders ?? 0}</td>
                  <td className="px-4 py-3 text-center">{user._count?.challanSearches ?? 0}</td>
                  <td className="px-4 py-3">{formatCurrency(user.totalSpent ?? 0)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {user.lastActiveAt ? formatDate(user.lastActiveAt) : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {!data?.users?.length && (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-gray-400">
                    No users found
                  </td>
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
