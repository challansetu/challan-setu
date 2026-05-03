import React from "react";
import { AdminShell } from "@/components/admin/layout/AdminShell";
import { ToastProvider } from "@/components/admin/ui/Toast";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminShell>{children}</AdminShell>
    </ToastProvider>
  );
}
