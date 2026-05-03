"use client";

import React, { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { ChevronDown, ChevronRight } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { Pagination } from "@/components/admin/ui/Pagination";
import { SkeletonTable } from "@/components/admin/ui/Skeleton";
import { formatDateTime } from "@/lib/utils";
import type { AuditLogsResponse } from "@/types/admin";

export default function AuditLogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const getParams = useCallback(() => {
    return {
      page: parseInt(searchParams.get("page") ?? "1"),
      entity: searchParams.get("entity") ?? "",
      action: searchParams.get("action") ?? "",
      dateFrom: searchParams.get("dateFrom") ?? "",
      dateTo: searchParams.get("dateTo") ?? "",
    };
  }, [searchParams]);

  const params = getParams();

  const { data, isLoading, error } = useSWR<AuditLogsResponse>(
    ["audit-logs", JSON.stringify(params)],
    () =>
      adminApi.auditLogs({
        page: params.page,
        limit: 20,
        entity: params.entity || undefined,
        action: params.action || undefined,
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
    router.push(`/admin/audit-logs?${p.toString()}`);
  };

  const toggleRow = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={params.entity}
            onChange={(e) => updateParam("entity", e.target.value)}
            placeholder="Filter by entity (e.g. User, Order)"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-48"
          />
          <input
            type="text"
            value={params.action}
            onChange={(e) => updateParam("action", e.target.value)}
            placeholder="Filter by action"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-48"
          />
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
        <SkeletonTable rows={10} cols={6} />
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-red-600">
          Failed to load audit logs.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 px-2 py-3" />
                <th className="text-left px-4 py-3 font-medium text-gray-500">Action</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Entity</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Entity ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Actor</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">IP</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.logs?.map((log) => (
                <React.Fragment key={log.id}>
                  <tr
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => toggleRow(log.id)}
                  >
                    <td className="px-2 py-3 text-gray-400">
                      {expandedRow === log.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800">{log.action}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{log.entity}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{log.entityId ?? "-"}</td>
                    <td className="px-4 py-3">
                      {log.admin ? (
                        <span className="text-primary-700 font-medium">
                          {log.admin.name}
                          <span className="text-gray-400 font-normal ml-1 text-xs">({log.admin.role})</span>
                        </span>
                      ) : log.user ? (
                        <span className="font-mono text-xs">
                          {log.user.phone}
                          {log.user.name && <span className="text-gray-400 ml-1">{log.user.name}</span>}
                        </span>
                      ) : (
                        <span className="text-gray-300">System</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{log.ipAddress ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDateTime(log.createdAt)}</td>
                  </tr>
                  {expandedRow === log.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {log.oldValue && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1.5">Previous Value</p>
                              <pre className="text-xs bg-white border border-gray-200 rounded-lg p-3 overflow-auto max-h-48">
                                {JSON.stringify(log.oldValue, null, 2)}
                              </pre>
                            </div>
                          )}
                          {log.newValue && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1.5">New Value</p>
                              <pre className="text-xs bg-white border border-gray-200 rounded-lg p-3 overflow-auto max-h-48">
                                {JSON.stringify(log.newValue, null, 2)}
                              </pre>
                            </div>
                          )}
                          {!log.oldValue && !log.newValue && (
                            <p className="text-xs text-gray-400">No change data available</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {!data?.logs?.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">No audit logs found</td>
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
