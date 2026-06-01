"use client";

import React from "react";
import { SWRConfig } from "swr";
import { AdminShell } from "@/components/admin/layout/AdminShell";
import { ToastProvider } from "@/components/admin/ui/Toast";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig value={{ revalidateOnFocus: false, dedupingInterval: 10_000 }}>
      <ToastProvider>
        <AdminShell>{children}</AdminShell>
      </ToastProvider>
    </SWRConfig>
  );
}
