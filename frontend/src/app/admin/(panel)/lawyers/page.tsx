"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Plus, Pencil, Trash2, KeyRound, Loader2, Scale } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { Modal } from "@/components/admin/ui/Modal";
import { useToast } from "@/components/admin/ui/Toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { formatDate } from "@/lib/utils";
import type { AdminAccount } from "@/types/admin";

function parsePrefixes(input: string): string[] {
  return Array.from(
    new Set(
      input
        .split(",")
        .map((p) => p.trim().toUpperCase())
        .filter(Boolean)
    )
  );
}

function CreateLawyerModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (admin: AdminAccount) => void;
}) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prefixesInput, setPrefixesInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPrefixesInput("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const admin = await adminApi.createAdmin({
        name,
        email,
        password,
        role: "LAWYER",
        vehiclePrefixes: parsePrefixes(prefixesInput),
      });
      showToast("Lawyer account created", "success");
      onCreated(admin as AdminAccount);
      reset();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to create lawyer account");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1";

  return (
    <Modal isOpen={isOpen} onClose={() => { reset(); onClose(); }} title="New Lawyer Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Password</label>
          <input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Vehicle number prefixes</label>
          <input
            value={prefixesInput}
            onChange={(e) => setPrefixesInput(e.target.value)}
            placeholder="e.g. DL, HR"
            className={inputCls}
          />
          <p className="text-[10px] text-gray-400 mt-1">Comma-separated. This lawyer will only see leads whose vehicle number starts with one of these.</p>
        </div>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button type="submit" loading={saving}>Create</Button>
        </div>
      </form>
    </Modal>
  );
}

function EditLawyerModal({
  lawyer,
  onClose,
  onUpdated,
}: {
  lawyer: AdminAccount;
  onClose: () => void;
  onUpdated: (admin: AdminAccount) => void;
}) {
  const { showToast } = useToast();
  const [name, setName] = useState(lawyer.name);
  const [prefixesInput, setPrefixesInput] = useState((lawyer.vehiclePrefixes ?? []).join(", "));
  const [isActive, setIsActive] = useState(lawyer.isActive);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [resetOpen, setResetOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await adminApi.updateAdmin(lawyer.id, {
        name,
        isActive,
        vehiclePrefixes: parsePrefixes(prefixesInput),
      });
      showToast("Lawyer account updated", "success");
      onUpdated(updated as AdminAccount);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to update lawyer account");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetting(true);
    try {
      await adminApi.resetAdminPassword(lawyer.id, newPassword);
      showToast("Password reset", "success");
      setResetOpen(false);
      setNewPassword("");
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? "Failed to reset password", "error");
    } finally {
      setResetting(false);
    }
  };

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1";

  return (
    <Modal isOpen onClose={onClose} title={`Edit ${lawyer.name}`}>
      {!resetOpen ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Vehicle number prefixes</label>
            <input
              value={prefixesInput}
              onChange={(e) => setPrefixesInput(e.target.value)}
              placeholder="e.g. DL, HR"
              className={inputCls}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Active
          </label>
          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setResetOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700"
            >
              <KeyRound className="w-3.5 h-3.5" /> Reset password
            </button>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit" loading={saving}>Save</Button>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className={labelCls}>New password</label>
            <input required type="password" minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setResetOpen(false)}>Back</Button>
            <Button type="submit" loading={resetting}>Reset</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

function DeleteLawyerModal({
  lawyer,
  onClose,
  onDeleted,
}: {
  lawyer: AdminAccount;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const { showToast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await adminApi.deleteAdmin(lawyer.id);
      showToast("Lawyer account deleted", "success");
      onDeleted();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to delete lawyer account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Delete Lawyer Account">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-semibold text-gray-900">{lawyer.name}</span> ({lawyer.email})?
          They will immediately lose access and this cannot be undone.
        </p>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="button" variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </div>
    </Modal>
  );
}

export default function LawyersPage() {
  const router = useRouter();
  const { admin } = useAdminAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<AdminAccount | null>(null);
  const [deleting, setDeleting] = useState<AdminAccount | null>(null);

  useEffect(() => {
    if (admin && admin.role !== "SUPER_ADMIN") {
      router.push("/admin/dashboard");
    }
  }, [admin, router]);

  const { data, isLoading, mutate } = useSWR<AdminAccount[]>("admin-accounts", adminApi.listAdmins);
  const lawyers = (data ?? []).filter((a) => a.role === "LAWYER");

  if (admin && admin.role !== "SUPER_ADMIN") return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lawyers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage lawyer accounts and the vehicle number prefixes they can see leads for.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> New Lawyer
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Vehicle Prefixes</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Last Login</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin inline" />
                </td></tr>
              ) : !lawyers.length ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                  <Scale className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                  No lawyer accounts yet.
                </td></tr>
              ) : lawyers.map((lawyer) => (
                <tr key={lawyer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{lawyer.name}</td>
                  <td className="px-4 py-3 text-gray-700">{lawyer.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(lawyer.vehiclePrefixes ?? []).length ? (
                        lawyer.vehiclePrefixes!.map((p) => (
                          <span key={p} className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{p}</span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">None assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={lawyer.isActive ? "Active" : "Inactive"} variant={lawyer.isActive ? "green" : "gray"} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {lawyer.lastLoginAt ? formatDate(lawyer.lastLoginAt) : "Never"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-0.5">
                      <button
                        onClick={() => setEditing(lawyer)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors rounded hover:bg-indigo-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(lawyer)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateLawyerModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => mutate()}
      />

      {editing && (
        <EditLawyerModal
          lawyer={editing}
          onClose={() => setEditing(null)}
          onUpdated={() => mutate()}
        />
      )}

      {deleting && (
        <DeleteLawyerModal
          lawyer={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => mutate()}
        />
      )}
    </div>
  );
}
