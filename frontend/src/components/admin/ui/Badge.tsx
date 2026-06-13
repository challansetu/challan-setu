"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type {
  UserLifecycleStatus,
  AdminRole,
} from "@/types/admin";

type BadgeVariant =
  | "gray"
  | "green"
  | "yellow"
  | "red"
  | "blue"
  | "orange"
  | "purple"
  | "darkred";

const variantClasses: Record<BadgeVariant, string> = {
  gray: "bg-gray-100 text-gray-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  purple: "bg-purple-100 text-purple-700",
  darkred: "bg-red-200 text-red-900",
};

const lifecycleStatusVariant: Record<UserLifecycleStatus, BadgeVariant> = {
  NEW_USER: "gray",
  ACTIVE: "green",
  PAYMENT_PENDING: "yellow",
  PAYMENT_FAILED: "red",
  COMPLETED: "blue",
  CHURNED: "orange",
  BLOCKED: "darkred",
};

const lifecycleStatusLabel: Record<UserLifecycleStatus, string> = {
  NEW_USER: "New User",
  ACTIVE: "Active",
  PAYMENT_PENDING: "Payment Pending",
  PAYMENT_FAILED: "Payment Failed",
  COMPLETED: "Completed",
  CHURNED: "Churned",
  BLOCKED: "Blocked",
};

const roleVariant: Record<AdminRole, BadgeVariant> = {
  SUPER_ADMIN: "purple",
  ADMIN: "blue",
  SUPPORT_AGENT: "gray",
};

const roleLabel: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  SUPPORT_AGENT: "Support Agent",
};

interface BadgeProps {
  label?: string;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ label, variant = "gray", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {label}
    </span>
  );
}

export function UserStatusBadge({
  status,
}: {
  status: UserLifecycleStatus | string;
}) {
  const variant = lifecycleStatusVariant[status as UserLifecycleStatus] ?? "gray";
  const label = lifecycleStatusLabel[status as UserLifecycleStatus] ?? status;
  return <Badge label={label} variant={variant} />;
}

export function RoleBadge({ role }: { role: AdminRole | string }) {
  const variant = roleVariant[role as AdminRole] ?? "gray";
  const label = roleLabel[role as AdminRole] ?? role;
  return <Badge label={label} variant={variant} />;
}
