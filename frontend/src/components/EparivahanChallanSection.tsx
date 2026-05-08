'use client';

import { useState, useRef } from 'react';
import { CheckCircle2, Loader2, Calendar, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { challansApi, type ChallanEntry } from '@/lib/api';

interface Props {
  vehicleNumber: string;
}

type Stage =
  | { name: 'idle' }
  | { name: 'sending' }
  | { name: 'otp_entry'; sessionId: string }
  | { name: 'verifying' }
  | { name: 'done'; challans: ChallanEntry[] }
  | { name: 'error'; message: string; canRetry: boolean };

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

function ChallanResults({ challans }: { challans: ChallanEntry[] }) {
  if (challans.length === 0) {
    return (
      <div className="rounded-2xl bg-white shadow-sm px-5 py-4 flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">No pending challans found</p>
          <p className="text-xs text-gray-400 mt-0.5">Your vehicle has a clean record on eparivahan.</p>
        </div>
      </div>
    );
  }

  const unpaid = challans.filter((c) => c.status?.toUpperCase() !== 'PAID');
  const unpaidAmount = unpaid.reduce((s, c) => s + (Number(c.amountChallan) || 0), 0);

  return (
    <div className="space-y-3">
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

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-red-50 px-4 py-5 text-center">
          <p className="text-3xl font-black text-red-500 leading-none">{formatAmountShort(unpaidAmount)}</p>
          <p className="mt-2 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Total Due</p>
        </div>
        <div className="rounded-2xl bg-green-50 px-4 py-5 text-center">
          <p className="text-4xl font-black text-green-500 leading-none">{challans.length}</p>
          <p className="mt-2 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Violations</p>
        </div>
      </div>

      <p className="text-[10px] font-black tracking-[0.22em] text-gray-400 uppercase px-1 pt-1">Violations</p>

      <div className="space-y-2.5">
        {challans.map((c, i) => {
          const isPaid = c.status?.toUpperCase() === 'PAID';
          const offense = c.detailsViolation?.[0]?.offence || 'Traffic Violation';
          const amount = Number(c.amountChallan) || 0;
          return (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="px-5 pt-4 pb-3 border-b border-gray-50">
                <p className="text-[15px] font-bold text-gray-900 leading-snug">{offense}</p>
              </div>
              <div className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(c.dateChallan)}
                  </span>
                  {c.locationChallan && (
                    <span className="inline-flex items-center gap-1 truncate max-w-[100px]">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{c.locationChallan}</span>
                    </span>
                  )}
                </div>
                <p className={`text-base font-black flex-shrink-0 ${isPaid ? 'text-emerald-500' : 'text-red-500'}`}>
                  ₹{amount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EparivahanChallanSection({ vehicleNumber }: Props) {
  const [stage, setStage] = useState<Stage>({ name: 'idle' });
  const [otp, setOtp] = useState('');
  const otpRef = useRef<HTMLInputElement>(null);

  async function handleSendOtp() {
    setStage({ name: 'sending' });
    try {
      const res = await challansApi.eparivahanInitiate(vehicleNumber);
      const data = res.data;
      if (!data.otpRequired) {
        setStage({ name: 'done', challans: data.challans });
      } else {
        setStage({ name: 'otp_entry', sessionId: data.sessionId });
        setTimeout(() => otpRef.current?.focus(), 100);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.';
      setStage({ name: 'error', message: msg, canRetry: true });
    }
  }

  async function handleVerifyOtp() {
    if (stage.name !== 'otp_entry') return;
    if (!otp.trim()) { otpRef.current?.focus(); return; }
    const sessionId = stage.sessionId;
    setStage({ name: 'verifying' });
    try {
      const res = await challansApi.eparivahanVerify(sessionId, otp.trim());
      setStage({ name: 'done', challans: res.data.challans ?? [] });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'OTP verification failed.';
      setStage({ name: 'error', message: msg, canRetry: true });
    }
  }

  if (stage.name === 'idle') {
    return (
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="flex">
          <div className="w-1 flex-shrink-0 bg-blue-400" />
          <div className="flex-1 px-5 py-5">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-blue-500" />
              <p className="text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">Live Challan Check</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Verify pending challans directly from eparivahan using OTP sent to your registered mobile.
            </p>
            <button
              onClick={handleSendOtp}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
            >
              Send OTP on eparivahan
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage.name === 'sending') {
    return (
      <div className="rounded-2xl bg-white shadow-sm px-5 py-4 flex items-center gap-3">
        <Loader2 className="h-4 w-4 animate-spin text-blue-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-700">Sending OTP to registered mobile…</p>
          <p className="text-xs text-gray-400 mt-0.5">Solving CAPTCHA in background, please wait</p>
        </div>
      </div>
    );
  }

  if (stage.name === 'otp_entry') {
    const sessionId = stage.sessionId;
    return (
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="flex">
          <div className="w-1 flex-shrink-0 bg-emerald-400" />
          <div className="flex-1 px-5 py-5">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <p className="text-[10px] font-black tracking-[0.2em] text-emerald-600 uppercase">OTP Sent</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              An OTP has been sent to the mobile number registered with your vehicle. Enter it below.
            </p>
            <div className="flex gap-2">
              <input
                ref={otpRef}
                type="number"
                inputMode="numeric"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 8))}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-bold text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={handleVerifyOtp}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all whitespace-nowrap"
              >
                Verify OTP
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Didn&apos;t receive?{' '}
              <button
                onClick={handleSendOtp}
                className="font-semibold text-blue-600 hover:underline"
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (stage.name === 'verifying') {
    return (
      <div className="rounded-2xl bg-white shadow-sm px-5 py-4 flex items-center gap-3">
        <Loader2 className="h-4 w-4 animate-spin text-blue-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-700">Fetching your challan data…</p>
          <p className="text-xs text-gray-400 mt-0.5">This takes a few seconds</p>
        </div>
      </div>
    );
  }

  if (stage.name === 'error') {
    return (
      <div className="rounded-2xl bg-white shadow-sm px-5 py-4 flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
          <span className="text-sm">⚠️</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-800">Could not fetch challan data</p>
          <p className="text-xs text-gray-500 mt-0.5">{stage.message}</p>
          {stage.canRetry && (
            <button
              onClick={() => { setOtp(''); setStage({ name: 'idle' }); }}
              className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  // done
  return <ChallanResults challans={stage.challans} />;
}
