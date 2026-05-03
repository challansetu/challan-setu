import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  trendPositive?: boolean;
  iconBgClass?: string;
}

export function StatCard({
  icon,
  label,
  value,
  subtitle,
  trendPositive,
  iconBgClass = "bg-primary-100",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-lg flex-shrink-0", iconBgClass)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p
              className={cn(
                "text-xs mt-1",
                trendPositive === undefined
                  ? "text-gray-400"
                  : trendPositive
                  ? "text-green-600"
                  : "text-red-600"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
