'use client';

import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Loader2, Calendar, MapPin, ShieldCheck, ArrowRight, X, Hash, CreditCard } from 'lucide-react';
import { challansApi, type ChallanEntry } from '@/lib/api';

interface Props {
  vehicleNumber: string;
}

function friendlyError(raw: string): string {
  const r = raw.toLowerCase();
  if (r.includes('challan_not_found') || r.includes('no_challan') || r.includes('record_not_found'))
    return 'No pending challans found for this vehicle.';
  if (r.includes('maximum search exceeded') || r.includes('max search'))
    return 'Too many requests to eparivahan. Please wait 2–3 minutes and try again.';
  if (r.includes('invalid') && (r.includes('mobile') || r.includes('vahan')))
    return raw; // already user-friendly from eparivahan
  if (r.includes('captcha'))
    return 'CAPTCHA verification failed. Please try again.';
  if (r.includes('session') && r.includes('expir'))
    return 'Session expired. Please start again.';
  if (r.includes('network') || r.includes('econnrefused') || r.includes('timeout'))
    return 'Could not connect to eparivahan. Please try again in a moment.';
  if (r.includes('otp') && (r.includes('invalid') || r.includes('wrong') || r.includes('incorrect')))
    return 'Incorrect OTP. Please check and try again.';
  if (r.includes('non-json') || r.includes('expecting value') || r.includes('json'))
    return 'eparivahan returned an unexpected response. Please try again.';
  return raw;
}

type Stage =
  | { name: 'idle' }
  | { name: 'sending' }
  | { name: 'otp_entry'; sessionId: string; otpMessage: string }
  | { name: 'verifying' }
  | { name: 'done'; challans: ChallanEntry[]; confirmed: boolean }
  | { name: 'error'; message: string; isInvalidMobile?: boolean; canRetry: boolean };

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

function ChallanDetailSheet({ challan, onClose }: { challan: ChallanEntry; onClose: () => void }) {
  const isPaid = challan.status?.toUpperCase() === 'PAID';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white px-5 pt-5 pb-28 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-1">Challan Details</p>
            <p className={`text-sm font-bold px-2 py-0.5 rounded-full inline-block ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
              {isPaid ? 'Paid' : 'Unpaid'}
            </p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Amount */}
        <div className="rounded-2xl bg-gray-50 px-5 py-4 mb-4 text-center">
          <p className={`text-4xl font-black ${isPaid ? 'text-emerald-500' : 'text-red-500'}`}>
            ₹{(Number(challan.amountChallan) || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-400 mt-1">Fine Amount</p>
        </div>

        {/* Details */}
        <div className="space-y-3">
          {challan.challanNo && (
            <div className="flex items-start gap-3">
              <Hash className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Challan No</p>
                <p className="text-sm font-semibold text-gray-800">{challan.challanNo}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</p>
              <p className="text-sm font-semibold text-gray-800">{formatDate(challan.dateChallan)}</p>
            </div>
          </div>
          {challan.locationChallan && (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
                <p className="text-sm font-semibold text-gray-800">{challan.locationChallan}</p>
              </div>
            </div>
          )}
          {challan.challan_search_source && (
            <div className="flex items-start gap-3">
              <CreditCard className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Source</p>
                <p className="text-sm font-semibold text-gray-800">{challan.challan_search_source}</p>
              </div>
            </div>
          )}
        </div>

        {/* Violations */}
        {challan.detailsViolation?.length > 0 && (
          <div className="mt-5">
            <p className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-2">Violations</p>
            <div className="space-y-2">
              {challan.detailsViolation.map((v, i) => (
                <div key={i} className="rounded-xl bg-gray-50 px-4 py-3 flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-gray-800 leading-snug">{v.offence}</p>
                  {v.penalty != null && (
                    <p className="text-sm font-bold text-red-500 flex-shrink-0">₹{v.penalty}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChallanResults({ challans, confirmed }: { challans: ChallanEntry[]; confirmed: boolean }) {
  const [selected, setSelected] = useState<ChallanEntry | null>(null);

  if (challans.length === 0) {
    if (!confirmed) {
      // Scraper returned empty but didn't get explicit confirmation from eparivahan
      return (
        <div className="rounded-2xl bg-white shadow-sm px-5 py-4 flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
            <span className="text-sm">⚠️</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Could not verify challan status</p>
            <p className="text-xs text-gray-400 mt-0.5">Our team will check manually for your vehicle.</p>
          </div>
        </div>
      );
    }
    return (
      <div className="rounded-2xl bg-white shadow-sm px-5 py-4 flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">No pending challans found</p>
          <p className="text-xs text-gray-400 mt-0.5">eparivahan confirmed your vehicle has a clean record.</p>
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
            <button key={i} onClick={() => setSelected(c)} className="w-full overflow-hidden rounded-2xl bg-white shadow-sm text-left active:scale-[0.98] transition-transform">
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
            </button>
          );
        })}
      </div>

      {selected && <ChallanDetailSheet challan={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export function PublicChallanSection({ vehicleNumber }: Props) {
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const [challans, setChallans] = useState<ChallanEntry[]>([]);

  useEffect(() => {
    challansApi.getPublic(vehicleNumber)
      .then(res => { setChallans(res.data.challans ?? []); setStatus('done'); })
      .catch(() => setStatus('error'));
  }, [vehicleNumber]);

  if (status === 'loading') {
    return (
      <div className="rounded-2xl bg-white shadow-sm px-5 py-4 flex items-center gap-3">
        <Loader2 className="h-4 w-4 animate-spin text-blue-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-700">Checking challan records…</p>
          <p className="text-xs text-gray-400 mt-0.5">Fetching from CarInfo database</p>
        </div>
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
          <p className="text-xs text-gray-400 mt-0.5">Use the live check below for real-time results.</p>
        </div>
      </div>
    );
  }

  return <ChallanResults challans={challans} confirmed={true} />;
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
        setStage({ name: 'done', challans: data.challans, confirmed: data.confirmed });
      } else {
        setStage({ name: 'otp_entry', sessionId: data.sessionId, otpMessage: data.otpMessage });
        setTimeout(() => otpRef.current?.focus(), 100);
      }
    } catch (err: any) {
      const raw = err?.response?.data?.message || err?.message || 'Something went wrong.';
      const msg = friendlyError(raw);
      const isInvalidMobile = raw.toLowerCase().includes('invalid') || raw.toLowerCase().includes('not available');
      setStage({ name: 'error', message: msg, isInvalidMobile, canRetry: true });
    }
  }

  async function handleVerifyOtp() {
    if (stage.name !== 'otp_entry') return;
    if (!otp.trim()) { otpRef.current?.focus(); return; }
    const sessionId = stage.sessionId;
    setStage({ name: 'verifying' });
    try {
      const res = await challansApi.eparivahanVerify(sessionId, otp.trim());
      setStage({ name: 'done', challans: res.data.challans ?? [], confirmed: true });
    } catch (err: any) {
      const raw = err?.response?.data?.message || err?.message || 'OTP verification failed.';
      setStage({ name: 'error', message: friendlyError(raw), canRetry: true });
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
              Get real-time challan data directly from eparivahan via OTP on your registered mobile.
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
          <p className="text-xs text-gray-400 mt-0.5">please wait</p>
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
            <p className="text-sm font-semibold text-gray-800 mb-1 font-mono">{stage.otpMessage}</p>
            <p className="text-xs text-gray-400 mb-4">Enter the OTP below to fetch your challan details.</p>
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
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="flex">
          <div className={`w-1 flex-shrink-0 ${stage.isInvalidMobile ? 'bg-red-400' : 'bg-amber-400'}`} />
          <div className="flex-1 px-5 py-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{stage.isInvalidMobile ? '📵' : '⚠️'}</span>
              <p className={`text-[10px] font-black tracking-[0.2em] uppercase ${stage.isInvalidMobile ? 'text-red-600' : 'text-amber-600'}`}>
                {stage.isInvalidMobile ? 'Mobile Not Registered' : 'Could Not Fetch Data'}
              </p>
            </div>
            <p className="text-sm font-semibold text-gray-800 mb-1">
              {stage.isInvalidMobile ? 'Mobile number not found in VAHAN' : 'Could not fetch challan data'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{stage.message}</p>
            {stage.isInvalidMobile && (
              <p className="text-xs text-gray-400 mt-2">
                Update your mobile at{' '}
                <a href="https://parivahan.gov.in/parivahan" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                  parivahan.gov.in
                </a>
              </p>
            )}
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
      </div>
    );
  }

  // done
  return <ChallanResults challans={stage.challans} confirmed={stage.confirmed} />;
}
