'use client';

import { Scale } from 'lucide-react';

export function CtaScrollButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
      style={{ background: '#f5c842', color: '#1c1c24' }}
    >
      <Scale className="w-4 h-4" />
      {label}
    </button>
  );
}
