'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
}

export function Card({ children, className, onClick, variant = 'default' }: CardProps) {
  const variants = {
    default: 'bg-white rounded-2xl border border-gray-100 shadow-premium',
    elevated: 'bg-white rounded-2xl shadow-premium-lg border-0',
    bordered: 'bg-white rounded-2xl border-2 border-gray-100',
    glass: 'glass rounded-2xl shadow-premium',
  };

  return (
    <div
      className={cn(
        variants[variant],
        'transition-all duration-300',
        onClick && 'cursor-pointer hover:shadow-premium-lg hover:-translate-y-0.5 active:translate-y-0',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-5 border-b border-gray-50', className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-5', className)}>{children}</div>;
}
