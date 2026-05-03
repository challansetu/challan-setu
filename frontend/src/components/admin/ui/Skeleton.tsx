import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonLineProps {
  className?: string;
}

export function SkeletonLine({ className }: SkeletonLineProps) {
  return (
    <div
      className={cn(
        "h-4 bg-gray-200 rounded animate-pulse",
        className
      )}
    />
  );
}

interface SkeletonTableProps {
  rows?: number;
  cols?: number;
}

export function SkeletonTable({ rows = 5, cols = 6 }: SkeletonTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonLine key={i} className="flex-1 h-3" />
        ))}
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex items-center px-4 py-3 gap-4">
            {Array.from({ length: cols }).map((_, colIdx) => (
              <SkeletonLine
                key={colIdx}
                className={cn("flex-1 h-4", colIdx === 0 && "w-24 flex-none")}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-gray-200" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-24 h-3" />
          <SkeletonLine className="w-16 h-5" />
        </div>
      </div>
    </div>
  );
}
