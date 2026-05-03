"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Search } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { Badge } from "@/components/admin/ui/Badge";
import { Pagination } from "@/components/admin/ui/Pagination";
import { SkeletonTable } from "@/components/admin/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import type { LeadsResponse } from "@/types/admin";

export default function LeadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  const getParams = useCallback(() => ({
    page: parseInt(searchParams.get("page") ?? "1"),
    search: searchParams.get("search") ?? "",
    status: searchParams.get("status") ?? "",
    source: searchParams.get("source") ?? "",
  }), [searchParams]);

  const params = getParams();

  const { data, isLoading, error } = useSWR<LeadsResponse>(
    ["admin-leads", JSON.stringify(params)],
    () => adminApi.leads({
      page: params.page,
      limit: 20,
      search: params.search || undefined,
      status: params.status || undefined,
      source: params.source || undefined,
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
    router.push(`/admin/leads?${p.toString()}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const current = searchParams.get("search") ?? "";
      if (searchInput !== current) {
        updateParam("search", searchInput);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, searchParams]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">
            Homepage and city-page request submissions from the MVP flow.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, mobile, or vehicle..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={params.status}
            onChange={(e) => updateParam("status", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
          </select>

          <select
            value={params.source}
            onChange={(e) => updateParam("source", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Sources</option>
            <option value="homepage">Homepage</option>
            <option value="city_page">City Page</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <SkeletonTable rows={8} cols={7} />
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-red-600">
          Failed to load leads.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Created</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Mobile</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Vehicle</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">City</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Consent</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Source</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.leads?.length ? data.leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {lead.fullName}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{lead.mobileNumber}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {lead.vehicleNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {lead.city ? (
                        <span className="capitalize">{lead.city.replace(/-/g, " ")}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        label={lead.consentAccepted ? "Accepted" : "Missing"}
                        variant={lead.consentAccepted ? "green" : "red"}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        label={lead.source}
                        variant="blue"
                        className="capitalize"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        label={lead.leadStatus}
                        variant="gray"
                        className="capitalize"
                      />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {data && (
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
