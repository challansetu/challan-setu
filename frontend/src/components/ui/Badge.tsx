'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  status: string;
  className?: string;
  variant?: 'default' | 'pill' | 'dot';
}

function getStatusStyle(status: string) {
  switch (status.toUpperCase()) {
    case 'PAID':
    case 'CAPTURED':
    case 'SETTLED':
    case 'PAYMENT_COMPLETED':
    case 'SUCCESS':
    case 'COMPLETED':
      return {
        bg: 'bg-emerald-50 border-emerald-200/60',
        text: 'text-emerald-700',
        dot: 'bg-emerald-500',
      };
    case 'UNPAID':
    case 'PENDING':
    case 'CREATED':
    case 'PAYMENT_PENDING':
      return {
        bg: 'bg-amber-50 border-amber-200/60',
        text: 'text-amber-700',
        dot: 'bg-amber-500',
      };
    case 'PARTIAL':
    case 'PROCESSING':
    case 'MANUAL_REVIEW':
    case 'RETRY':
      return {
        bg: 'bg-orange-50 border-orange-200/60',
        text: 'text-orange-700',
        dot: 'bg-orange-500',
      };
    case 'FAILED':
    case 'PAYMENT_FAILED':
    case 'SETTLEMENT_FAILED':
      return {
        bg: 'bg-red-50 border-red-200/60',
        text: 'text-red-700',
        dot: 'bg-red-500',
      };
    default:
      return {
        bg: 'bg-gray-50 border-gray-200/60',
        text: 'text-gray-600',
        dot: 'bg-gray-400',
      };
  }
}

const STATUS_LABELS: Record<string, string> = {
  PAID: 'Paid',
  CAPTURED: 'Paid',
  SETTLED: 'Settled',
  PAYMENT_COMPLETED: 'Completed',
  SUCCESS: 'Success',
  COMPLETED: 'Completed',
  UNPAID: 'Unpaid',
  PENDING: 'Pending',
  CREATED: 'Created',
  PAYMENT_PENDING: 'Pending',
  PARTIAL: 'Partial',
  PROCESSING: 'Processing',
  MANUAL_REVIEW: 'Review',
  RETRY: 'Retry',
  FAILED: 'Failed',
  PAYMENT_FAILED: 'Failed',
  SETTLEMENT_FAILED: 'Failed',
  USER: 'User',
  ADMIN: 'Admin',
  UNKNOWN: 'Unknown',
  AUTHORIZED: 'Authorized',
  REFUNDED: 'Refunded',
  CANCELLED: 'Cancelled',
};

function getStatusLabel(status: string): string {
  return STATUS_LABELS[status.toUpperCase()] ?? status;
}

export function Badge({ status, className, variant = 'dot' }: BadgeProps) {
  const style = getStatusStyle(status);
  const label = getStatusLabel(status);

  if (variant === 'dot') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold uppercase tracking-wider border',
          style.bg,
          style.text,
          className,
        )}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
        {label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold border',
        style.bg,
        style.text,
        className,
      )}
    >
      {label}
    </span>
  );
}
