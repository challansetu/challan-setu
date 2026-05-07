'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { challansApi, type ChallanEntry } from '@/lib/api';

interface Props {
  vehicleNumber: string;
}

export function ChallanSection({ vehicleNumber }: Props) {
  const [challans, setChallans] = useState<ChallanEntry[]>([]);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    if (!vehicleNumber) { setStatus('done'); return; }

    challansApi
      .getPublic(vehicleNumber)
      .then((res) => {
        setChallans(res.data.challans ?? []);
        setStatus('done');
      })
      .catch(() => setStatus('error'));
  }, [vehicleNumber]);

  if (status === 'loading') {
    return (
      <div className="mb-4 rounded-2xl border border-primary-100 bg-white px-5 py-4 flex items-center gap-3 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin text-primary-500 flex-shrink-0" />
        Checking challan status for {vehicleNumber}…
      </div>
    );
  }

  if (status === 'error' || challans.length === 0) {
    return (
      <div className="mb-4 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-green-800">No pending challans found</p>
          <p className="text-xs text-green-600 mt-0.5">Vehicle {vehicleNumber} has no active challans on record.</p>
        </div>
      </div>
    );
  }

  const unpaid = challans.filter((c) => c.status?.toUpperCase() !== 'PAID');
  const totalAmount = challans.reduce((s, c) => s + (Number(c.amountChallan) || 0), 0);
  const unpaidAmount = unpaid.reduce((s, c) => s + (Number(c.amountChallan) || 0), 0);

  return (
    <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3 bg-red-100/60 border-b border-red-100">
        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
        <p className="text-sm font-bold text-red-800">
          {challans.length} Challan{challans.length > 1 ? 's' : ''} Found
        </p>
        <span className="ml-auto text-xs font-semibold text-red-600">
          ₹{unpaidAmount.toLocaleString('en-IN')} unpaid
        </span>
      </div>

      {/* Summary row */}
      <div className="px-5 py-2.5 flex gap-4 text-xs text-red-700 border-b border-red-100">
        <span>Total: <strong>₹{totalAmount.toLocaleString('en-IN')}</strong></span>
        <span>Unpaid: <strong>{unpaid.length}</strong></span>
        <span>Paid: <strong>{challans.length - unpaid.length}</strong></span>
      </div>

      {/* Challan list */}
      <div className="divide-y divide-red-100">
        {challans.map((c, i) => {
          const isPaid = c.status?.toUpperCase() === 'PAID';
          const offense = c.detailsViolation?.[0]?.offence || 'Violation';
          const date = c.dateChallan ? c.dateChallan.split(' ')[0] : '—';
          const amount = Number(c.amountChallan) || 0;

          return (
            <div key={i} className="px-5 py-3 flex items-start gap-3">
              <span className={`mt-0.5 text-lg leading-none flex-shrink-0 ${isPaid ? 'text-green-500' : 'text-red-500'}`}>
                {isPaid ? '✅' : '❌'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{offense}</p>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">₹{amount.toLocaleString('en-IN')}</p>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                  <span>{date}</span>
                  {c.locationChallan && <><span>·</span><span className="truncate">{c.locationChallan}</span></>}
                  <span className={`ml-auto flex-shrink-0 font-medium ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
                    {c.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
