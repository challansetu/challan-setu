'use client';

import { useState } from 'react';
import { ArrowRight, RotateCw } from 'lucide-react';
import { recoveryLeadsApi } from '@/lib/api';

interface RecoveryFormProps {
  hero?: boolean;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export function RecoveryForm({ hero }: RecoveryFormProps) {
  const [vehicle, setVehicle]   = useState('');
  const [fir, setFir]           = useState('');
  const [phone, setPhone]       = useState('');
  const [fullName, setFullName] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const isValid =
    vehicle.trim().length >= 4 &&
    phone.trim().length === 10 &&
    fullName.trim().length >= 2;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitState === 'loading') return;

    setSubmitState('loading');
    setErrorMsg('');

    const payload = {
      fullName: fullName.trim(),
      mobileNumber: phone,
      vehicleNumber: vehicle.toUpperCase().replace(/\s/g, ''),
      firNumber: fir.trim(),
      consentAccepted: true as const,
    };

    try {
      await recoveryLeadsApi.create(payload);
      setSubmitState('success');
    } catch {
      await new Promise((r) => setTimeout(r, 3000));
      try {
        await recoveryLeadsApi.create(payload);
        setSubmitState('success');
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Could not submit. Please try again.';
        setErrorMsg(Array.isArray(msg) ? msg[0] : msg);
        setSubmitState('error');
      }
    }
  }

  // ── Success state ──────────────────────────────────────────────
  if (submitState === 'success') {
    return (
      <div className={`w-full ${hero ? 'max-w-lg mx-auto' : ''}`}>
        <div className={`rounded-2xl p-8 text-center ${hero ? 'bg-white shadow-lg' : 'bg-green-50 border border-green-100'}`}>
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Request received!</h3>
          <p className="text-gray-500 text-sm">Our team will call you on <strong>{phone}</strong> shortly.</p>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────
  const inputCls = hero
    ? 'w-full h-14 px-5 rounded-2xl bg-white text-gray-900 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-300 shadow-lg text-base'
    : 'w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50 focus:bg-white transition-colors';

  return (
    <form onSubmit={handleSubmit} className={`w-full ${hero ? 'max-w-lg mx-auto space-y-2.5' : 'space-y-4'}`}>

      <input
        value={vehicle}
        onChange={(e) => setVehicle(e.target.value)}
        placeholder="Vehicle number (e.g. DL 7S BY 5194)"
        autoCapitalize="characters"
        className={inputCls}
      />

      <input
        value={fir}
        onChange={(e) => setFir(e.target.value)}
        placeholder="FIR number (e.g. 123/2024)"
        className={inputCls}
      />

      {/* Phone */}
      <div className={`flex items-center overflow-hidden ${hero
        ? 'h-14 rounded-2xl bg-white shadow-lg'
        : 'rounded-xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-primary-400 focus-within:bg-white transition-colors'}`}>
        <span className="pl-5 text-xl flex-shrink-0">🇮🇳</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="10-digit mobile number"
          inputMode="numeric"
          className={`flex-1 px-4 h-full bg-transparent text-gray-900 font-semibold placeholder-gray-400 focus:outline-none ${hero ? 'text-base' : 'py-3'}`}
        />
      </div>

      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Your full name"
        className={inputCls}
      />

      {errorMsg && <p className="text-sm text-red-500 px-1">{errorMsg}</p>}

      <button
        type="submit"
        disabled={!isValid || submitState === 'loading'}
        className={`w-full flex items-center justify-center gap-2 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${hero
          ? 'h-14 bg-white text-gray-900 rounded-2xl hover:bg-gray-50 shadow-lg text-base'
          : 'py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800'}`}
      >
        {submitState === 'loading'
          ? <><RotateCw className="w-4 h-4 animate-spin" /> Submitting...</>
          : <>Start Recovery <ArrowRight className="w-5 h-5" /></>}
      </button>

      {hero && (
        <p className="text-white/60 text-xs text-center pt-1">
          No upfront payment required, we will connect you shortly.
        </p>
      )}
    </form>
  );
}
