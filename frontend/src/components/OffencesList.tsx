'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { CityViolation } from '@/data/city-pages';

const INITIAL_COUNT = 5;

export function OffencesList({ violations }: { violations: CityViolation[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? violations : violations.slice(0, INITIAL_COUNT);
  const hasMore = violations.length > INITIAL_COUNT;

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Traffic Offence</th>
              <th className="text-right px-5 py-3.5 text-xs font-bold text-red-600 uppercase tracking-wide w-40">Govt Fine Amount</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide w-44">Legal Section</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visible.map((v, i) => (
              <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4 text-gray-900 font-medium leading-snug">{v.offence.trim()}</td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-sm font-bold text-red-600 tabular-nums tracking-tight whitespace-nowrap">
                      {v.fine?.trim() || 'Penalty varies'}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs text-gray-400">{v.section?.trim() || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="sm:hidden space-y-2">
        {visible.map((v, i) => (
          <li key={i} className="bg-white rounded-xl border border-gray-100 px-4 py-4 shadow-sm">
            <div className="flex items-start justify-between gap-3 min-w-0">
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-base font-bold text-gray-900 leading-snug break-words">{v.offence.trim()}</p>
                {v.section?.trim() && <p className="text-[11px] text-gray-400">{v.section.trim()}</p>}
              </div>
              <div className="flex flex-col items-end flex-shrink-0 ml-2 mt-0.5">
                <span className="text-[10px] font-bold uppercase text-red-500/80 tracking-widest leading-none mb-1.5">Govt Fine</span>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-sm font-bold text-red-600 tabular-nums tracking-tight whitespace-nowrap">
                    {v.fine?.trim() || 'Penalty varies'}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setExpanded((p) => !p)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            {expanded ? 'Show less ↑' : `Show all ${violations.length} offences ↓`}
          </button>
        </div>
      )}
    </>
  );
}
