"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { QrCode, Search, X } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { Pagination } from "@/components/admin/ui/Pagination";
import { SkeletonTable } from "@/components/admin/ui/Skeleton";
import { Badge } from "@/components/admin/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { QrScanSummary, QrScansResponse } from "@/types/admin";

export default function QrScansPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sourceInput, setSourceInput] = useState(searchParams.get("source") ?? "");

  const getParams = useCallback(
    () => ({
      page: parseInt(searchParams.get("page") ?? "1"),
      source: searchParams.get("source") ?? "",
    }),
    [searchParams]
  );

  const params = getParams();

  const { data: summary } = useSWR<QrScanSummary>(
    "admin-qr-scans-summary",
    adminApi.qrScansSummary,
    { revalidateOnFocus: false }
  );

  const { data, isLoading, error } = useSWR<QrScansResponse>(
    ["admin-qr-scans", JSON.stringify(params)],
    () =>
      adminApi.qrScans({
        page: params.page,
        limit: 25,
        source: params.source || undefined,
      }),
    { revalidateOnFocus: false }
  );

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) {
      p.set(key, value);
    } else {
      p.delete(key);
    }
    if (key !== "page") p.set("page", "1");
    router.push(`/admin/qr-scans?${p.toString()}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const current = searchParams.get("source") ?? "";
      if (sourceInput !== current) {
        updateParam("source", sourceInput);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [sourceInput, searchParams]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <QrCode className="h-6 w-6 text-gray-700" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR Scans</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Poster and campaign scan analytics.
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Total Scans",
            value: summary?.totalScans ?? "—",
            color: "text-gray-900",
          },
          {
            label: "Today",
            value: summary?.todayScans ?? "—",
            color: "text-blue-600",
          },
          {
            label: "Last 7 Days",
            value: summary?.last7DaysScans ?? "—",
            color: "text-indigo-600",
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm px-4 py-3">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Source breakdown */}
      {summary && summary.bySource.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3">
            Scans by Source
          </p>
          <div className="space-y-2">
            {summary.bySource.map((row) => {
              const pct =
                summary.totalScans > 0
                  ? Math.round((row.count / summary.totalScans) * 100)
                  : 0;
              return (
                <div key={row.source}>
                  <div className="flex items-center justify-between text-sm mb-0.5">
                    <button
                      onClick={() => {
                        setSourceInput(row.source);
                        updateParam("source", row.source);
                      }}
                      className="font-mono font-medium text-gray-800 hover:text-primary-600 transition-colors"
                    >
                      {row.source}
                    </button>
                    <span className="text-gray-500 tabular-nums">
                      {row.count.toLocaleString("en-IN")}
                      <span className="text-gray-400 text-xs ml-1">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={sourceInput}
              onChange={(e) => setSourceInput(e.target.value)}
              placeholder="Filter by source (e.g. delhi-poster-1)..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          {sourceInput && (
            <button
              onClick={() => {
                setSourceInput("");
                updateParam("source", "");
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Scan records table */}
      {isLoading ? (
        <SkeletonTable rows={8} cols={5} />
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-red-600">
          Failed to load scan records.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Time
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Source
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    IP
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Device / Browser
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.scans?.length ? (
                  data.scans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 text-xs">
                        {formatDate(scan.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded font-medium">
                          {scan.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                        {scan.ip ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">
                        {scan.userAgent
                          ? parseDevice(scan.userAgent)
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          label={scan.isBot ? "Bot" : "Human"}
                          variant={scan.isBot ? "red" : "green"}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                      No scan records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {data && data.totalPages > 1 && (
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={(page) => updateParam("page", String(page))}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Extract a short human-readable device/browser label from a user-agent string
function parseDevice(ua: string): string {
  if (!ua) return "—";

  let device = "";
  if (/iPhone/i.test(ua)) device = "iPhone";
  else if (/iPad/i.test(ua)) device = "iPad";
  else if (/Android/i.test(ua)) device = "Android";
  else if (/Windows/i.test(ua)) device = "Windows";
  else if (/Macintosh/i.test(ua)) device = "Mac";
  else if (/Linux/i.test(ua)) device = "Linux";

  let browser = "";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\//i.test(ua)) browser = "Opera";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Safari/i.test(ua)) browser = "Safari";

  if (device && browser) return `${device} / ${browser}`;
  if (device) return device;
  if (browser) return browser;
  return ua.slice(0, 60);
}
