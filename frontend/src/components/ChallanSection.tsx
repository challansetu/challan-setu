'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Calendar, MapPin } from 'lucide-react';
import { challansApi, type ChallanEntry } from '@/lib/api';

interface Props {
  vehicleNumber: string;
}

function formatDate(raw: string) {
  if (!raw) return '—';
  const d = new Date(raw.split(' ')[0]);
  if (isNaN(d.getTime())) return raw.split(' ')[0];
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}

function formatAmountShort(amount: number) {
  if (amount >= 1000) {
    const k = amount / 1000;
    return `₹${k % 1 === 0 ? k : k.toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function ChallanSection({ vehicleNumber }: Props) {
  const [challans, setChallans] = useState<ChallanEntry[]>([]);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    if (!vehicleNumber) { setStatus('done'); return; }

    const cacheKey = `challans:${vehicleNumber}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setChallans(JSON.parse(cached));
        setStatus('done');
        return;
      }
    } catch { }

    challansApi
      .getPublic(vehicleNumber)
      .then((res) => {
        const data = res.data.challans ?? [];
        setChallans(data);
        setStatus('done');
        try { sessionStorage.setItem(cacheKey, JSON.stringify(data)); } catch { }
      })
      .catch(() => setStatus('error'));
  }, [vehicleNumber]);

  if (status === 'loading') {
    return (
      <div className="rounded-2xl bg-white shadow-sm px-5 py-4 flex items-center gap-3">
        <Loader2 className="h-4 w-4 animate-spin text-blue-400 flex-shrink-0" />
        <span className="text-sm text-gray-400">
          Checking challans for <span className="font-semibold text-gray-600">{vehicleNumber}</span>…
        </span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="rounded-2xl bg-white shadow-sm px-5 py-4 flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
          <span className="text-sm">⚠️</span>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">Could not fetch challan data</p>
          <p className="text-xs text-gray-400 mt-0.5">Our team will check manually for {vehicleNumber}.</p>
        </div>
      </div>
    );
  }

  if (challans.length === 0) {
    return (
      <div className="rounded-2xl bg-white shadow-sm px-5 py-4 flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">No pending challans</p>
          <p className="text-xs text-gray-400 mt-0.5">{vehicleNumber} has a clean record.</p>
        </div>
      </div>
    );
  }

  const unpaid = challans.filter((c) => c.status?.toUpperCase() !== 'PAID');
  const unpaidAmount = unpaid.reduce((s, c) => s + (Number(c.amountChallan) || 0), 0);

  return (
    <div className="space-y-3">
      {/* Orange alert banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 px-5 py-5 shadow-md shadow-orange-200">
        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />
        <div className="relative">
          <h2 className="text-2xl font-black uppercase tracking-wide text-white">Challan Alert 🚨</h2>
          <p className="mt-1 text-sm text-orange-100">
            {challans.length} violation{challans.length > 1 ? 's' : ''} found on your vehicle
          </p>
        </div>
      </div>

      {/* Stat boxes */}
      <div className="rounded-2xl bg-white shadow-sm flex divide-x divide-gray-100">
        <div className="flex-1 px-4 py-3 text-center">
          <p className="text-lg font-black text-red-500 leading-none">{formatAmountShort(unpaidAmount)}</p>
          <p className="mt-1 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">Total Due</p>
        </div>
        <div className="flex-1 px-4 py-3 text-center">
          <p className="text-lg font-black text-gray-800 leading-none">{challans.length}</p>
          <p className="mt-1 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">Violations</p>
        </div>
      </div>

      {/* Violations label */}
      <p className="text-[10px] font-black tracking-[0.22em] text-gray-400 uppercase px-1 pt-1">
        Violations
      </p>

      {/* Individual violation cards */}
      <div className="space-y-2.5">
        {challans.map((c, i) => {
          const isPaid = c.status?.toUpperCase() === 'PAID';
          const offense = c.detailsViolation?.[0]?.offence || 'Traffic Violation';
          const amount = Number(c.amountChallan) || 0;

          return (
            <div key={i} className="rounded-2xl bg-white shadow-sm px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 leading-snug truncate">{offense}</p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(c.dateChallan)}
                  </span>
                  {c.locationChallan && (
                    <span className="inline-flex items-center gap-1 truncate max-w-[90px]">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{c.locationChallan}</span>
                    </span>
                  )}
                </div>
              </div>
              <p className={`text-sm font-black flex-shrink-0 ${isPaid ? 'text-emerald-500' : 'text-red-500'}`}>
                ₹{amount.toLocaleString('en-IN')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
