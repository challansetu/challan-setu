'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className,
}: CheckboxProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        sizes[size],
        'flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500',
        checked
          ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
          : 'bg-white border-gray-300 hover:border-primary-400',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer',
        className,
      )}
    >
      {checked && <Check className={iconSizes[size]} strokeWidth={3} />}
    </button>
  );
}
