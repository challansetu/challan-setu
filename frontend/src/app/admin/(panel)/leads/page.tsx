"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Search, X, Phone, Car, MapPin, Calendar, Globe } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { Badge } from "@/components/admin/ui/Badge";
import { Pagination } from "@/components/admin/ui/Pagination";
import { SkeletonTable } from "@/components/admin/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import type { Lead, LeadsResponse } from "@/types/admin";

const CRM_STATUSES = [
  { value: "new", label: "New" },
  { value: "follow_up", label: "Follow Up" },
  { value: "converted", label: "Converted" },
  { value: "dead", label: "Dead" },
];

const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "payment_done", label: "Payment Done" },
];

const CRM_STATUS_VARIANT: Record<string, "gray" | "blue" | "green" | "red" | "yellow"> = {
  new: "gray",
  follow_up: "yellow",
  converted: "green",
  dead: "red",
};

function LeadDrawer({ lead, onClose, onUpdate }: { lead: Lead; onClose: () => void; onUpdate: (updated: Lead) => void }) {
  const [form, setForm] = useState({
    crmStatus: lead.crmStatus ?? "new",
    paymentStatus: lead.paymentStatus ?? "pending",
    challanSettled: lead.challanSettled ?? "no",
    totalChallan: lead.totalChallan ?? "",
    paidAmount: lead.paidAmount ?? "",
    settledAmount: lead.settledAmount ?? "",
    discountGiven: lead.discountGiven ?? "",
  });

  const updateForm = (patch: Partial<typeof form>) => {
    setForm((prev) => {
      const next = { ...prev, ...patch };
      const total = Number(next.totalChallan);
      const paid = Number(next.paidAmount);
      if (total > 0 && paid > 0) {
        next.discountGiven = String(Math.max(0, total - paid));
      }
      return next;
    });
  };
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminApi.updateLead(lead.id, {
        crmStatus: form.crmStatus,
        paymentStatus: form.paymentStatus,
        challanSettled: form.challanSettled,
        totalChallan: form.totalChallan !== "" ? Number(form.totalChallan) : null,
        paidAmount: form.paidAmount !== "" ? Number(form.paidAmount) : null,
        settledAmount: form.settledAmount !== "" ? Number(form.settledAmount) : null,
        discountGiven: form.discountGiven !== "" ? Number(form.discountGiven) : null,
      });
      onUpdate(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const labelCls = "block text-xs font-semibold text-gray-500 mb-1";
  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white";

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Drawer */}
      <div
        className="relative ml-auto h-full w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">{lead.fullName}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Lead ID: {lead.id.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Lead Info */}
          <div>
            <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3">Lead Info</p>
            <div className="rounded-xl bg-gray-50 divide-y divide-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Mobile</p>
                  <p className="text-sm font-semibold text-gray-800">{lead.mobileNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Car className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Vehicle</p>
                  <p className="text-sm font-semibold font-mono text-gray-800">{lead.vehicleNumber}</p>
                </div>
              </div>
              {lead.city && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">City</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">{lead.city.replace(/-/g, " ")}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 px-4 py-3">
                <Globe className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Source</p>
                  <p className="text-sm font-semibold text-gray-800 capitalize">{lead.source.replace(/_/g, " ")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Created</p>
                  <p className="text-sm font-semibold text-gray-800">{formatDate(lead.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="h-3.5 w-3.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Consent</p>
                  <Badge label={lead.consentAccepted ? "Accepted" : "Missing"} variant={lead.consentAccepted ? "green" : "red"} />
                </div>
              </div>
            </div>
          </div>

          {/* CRM Fields */}
          <div>
            <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3">CRM</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Lead Status</label>
                  <select
                    value={form.crmStatus}
                    onChange={(e) => updateForm({ crmStatus: e.target.value })}
                    className={inputCls}
                  >
                    {CRM_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Payment Status</label>
                  <select
                    value={form.paymentStatus}
                    onChange={(e) => updateForm({ paymentStatus: e.target.value })}
                    className={inputCls}
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Challan Settled</label>
                  <select
                    value={form.challanSettled}
                    onChange={(e) => updateForm({ challanSettled: e.target.value })}
                    className={inputCls}
                  >
                    <option value="no">No</option>
                    <option value="initiated">Initiated</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Challan Financials */}
          <div>
            <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3">Challan Financials</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Total Challan (₹)</label>
                <input
                  type="number"
                  value={form.totalChallan}
                  onChange={(e) => updateForm({ totalChallan: e.target.value })}
                  placeholder="0"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Paid Amount (₹)</label>
                <input
                  type="number"
                  value={form.paidAmount}
                  onChange={(e) => updateForm({ paidAmount: e.target.value })}
                  placeholder="0"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Settled Amount (₹)</label>
                <input
                  type="number"
                  value={form.settledAmount}
                  onChange={(e) => updateForm({ settledAmount: e.target.value })}
                  placeholder="0"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Discount Given (₹)</label>
                <input
                  type="number"
                  value={form.discountGiven}
                  readOnly
                  placeholder="Auto-calculated"
                  className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`}
                />
                <p className="text-[10px] text-gray-400 mt-1">= Total − Paid</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          {saved && <p className="text-xs font-semibold text-green-600">Saved ✓</p>}
          {!saved && <span />}
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const getParams = useCallback(() => ({
    page: parseInt(searchParams.get("page") ?? "1"),
    search: searchParams.get("search") ?? "",
    status: searchParams.get("status") ?? "",
    source: searchParams.get("source") ?? "",
  }), [searchParams]);

  const params = getParams();

  const { data: stats } = useSWR("admin-leads-stats", adminApi.leadsStats);

  const { data, isLoading, error, mutate } = useSWR<LeadsResponse>(
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

  const handleUpdate = (updated: Lead) => {
    setSelectedLead(updated);
    mutate((prev) => {
      if (!prev) return prev;
      return { ...prev, leads: prev.leads.map((l) => l.id === updated.id ? updated : l) };
    }, false);
  };

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

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: "Total Leads", value: stats?.total ?? "—", color: "text-gray-900" },
          { label: "Converted", value: stats?.converted ?? "—", color: "text-green-600" },
          { label: "Follow Up", value: stats?.followUp ?? "—", color: "text-yellow-600" },
          { label: "Dead", value: stats?.dead ?? "—", color: "text-red-500" },
          { label: "Payment Done", value: stats?.paymentDone ?? "—", color: "text-blue-600" },
          { label: "Revenue", value: stats ? `₹${(stats.totalRevenue).toLocaleString("en-IN")}` : "—", color: "text-green-600" },
          { label: "Discount", value: stats ? `₹${(stats.totalDiscount).toLocaleString("en-IN")}` : "—", color: "text-orange-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm px-4 py-3">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
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
            {CRM_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
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
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Source</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">CRM Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.leads?.length ? data.leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
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
                      <Badge label={lead.source} variant="blue" className="capitalize" />
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        label={CRM_STATUSES.find((s) => s.value === (lead.crmStatus ?? "new"))?.label ?? lead.crmStatus ?? "New"}
                        variant={CRM_STATUS_VARIANT[lead.crmStatus ?? "new"] ?? "gray"}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        label={lead.paymentStatus === "payment_done" ? "Done" : "Pending"}
                        variant={lead.paymentStatus === "payment_done" ? "green" : "gray"}
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

      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
