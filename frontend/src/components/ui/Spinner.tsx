'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Spinner({ className, text }: { className?: string; text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
          <Loader2 className={cn('h-6 w-6 animate-spin text-primary-600', className)} />
        </div>
      </div>
      {text && (
        <p className="mt-4 text-sm text-gray-500 font-medium animate-pulse-soft">{text}</p>
      )}
    </div>
  );
}
