"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/admin/ui/Button";
import { formatCurrency } from "@/lib/utils";
import {
  ManualTransaction,
  ManualTransactionPayload,
} from "@/types/admin";
import { INDIAN_STATES_AND_UTS } from "@/lib/indian-states";

interface ManualTransactionFormProps {
  initialData?: Partial<ManualTransaction>;
  onSubmit: (data: ManualTransactionPayload) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ManualTransactionForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: ManualTransactionFormProps) {
  const [formData, setFormData] = useState({
    userName: initialData?.userName ?? "",
    phoneNumber: initialData?.phoneNumber ?? "",
    vehicleNumber: initialData?.vehicleNumber ?? "",
    state: initialData?.state ?? "",
    totalChallans: initialData?.totalChallans ?? 1,
    totalChallanAmount: initialData?.totalChallanAmount ?? 0,
    settledAmount: initialData?.settledAmount ?? undefined,
    settledOnGovPortal: initialData?.settledOnGovPortal ?? false,
  });

  const [calculations, setCalculations] = useState<{
    profit: number | null;
    discount: number | null;
  }>({ profit: null, discount: null });

  useEffect(() => {
    const total = Number(formData.totalChallanAmount);
    const settled = formData.settledAmount !== undefined ? Number(formData.settledAmount) : null;

    if (total > 0 && settled !== null) {
      const profit = total - settled;
      const discount = (profit / total) * 100;
      setCalculations({ profit, discount });
    } else {
      setCalculations({ profit: null, discount: null });
    }
  }, [formData.totalChallanAmount, formData.settledAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      userName: formData.userName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      vehicleNumber: formData.vehicleNumber.trim().toUpperCase(),
      state: formData.state.trim(),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "settledOnGovPortal"
          ? value === "yes"
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? value === "" ? undefined : Number(value)
          : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">User Name *</label>
          <input
            required
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Phone Number *</label>
          <input
            required
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            title="Phone number must be a valid 10-digit number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="9876543210"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Vehicle Number *</label>
          <input
            required
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="DL01AB1234"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">State *</label>
          <input
            required
            type="text"
            name="state"
            list="manual-transaction-states"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="Search and select a state"
          />
          <datalist id="manual-transaction-states">
            {INDIAN_STATES_AND_UTS.map((stateName) => (
              <option key={stateName} value={stateName} />
            ))}
          </datalist>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Total Challans *</label>
          <input
            required
            type="number"
            min="1"
            name="totalChallans"
            value={formData.totalChallans}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Total Challan Amount *</label>
          <input
            required
            type="number"
            step="0.01"
            min="0.01"
            name="totalChallanAmount"
            value={formData.totalChallanAmount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Settled Amount (Optional)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max={formData.totalChallanAmount}
            name="settledAmount"
            value={formData.settledAmount ?? ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="Enter if settled"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Settled on Government Portal *
          </label>
          <select
            name="settledOnGovPortal"
            value={formData.settledOnGovPortal ? "yes" : "no"}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      {/* Auto-calculated Preview */}
      <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4 border border-gray-100">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold">Profit</p>
          <p className="text-lg font-bold text-gray-900">
            {calculations.profit !== null ? formatCurrency(calculations.profit) : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold">Discount %</p>
          <p className="text-lg font-bold text-gray-900">
            {calculations.discount !== null ? `${calculations.discount.toFixed(2)}%` : "-"}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialData?.id ? "Update Record" : "Create Record"}
        </Button>
      </div>
    </form>
  );
}
