'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98] select-none';

  const variants = {
    primary:
      'bg-[#f5c842] text-[#1c1c24] hover:opacity-90 focus-visible:ring-amber-400 shadow-sm font-bold',
    secondary:
      'bg-surface-100 text-gray-800 hover:bg-surface-200 focus-visible:ring-gray-400 border border-surface-200',
    outline:
      'border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-400',
    ghost:
      'text-gray-600 hover:bg-surface-100 hover:text-gray-900 focus-visible:ring-gray-400',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm',
    success:
      'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 shadow-sm',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    xl: 'px-8 py-4 text-base gap-2.5',
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
