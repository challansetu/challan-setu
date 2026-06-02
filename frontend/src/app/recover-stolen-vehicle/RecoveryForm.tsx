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
        {hero ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-900/30">
              <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
                <path d="M8 18.5L14.5 25.5L28 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Request received!</h3>
            <p className="text-white/70 text-sm mb-5">
              Our team will call you on <span className="font-bold text-white">{phone}</span> within 30 minutes.
            </p>
            <a href="https://wa.me/918796323876"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors">
              💬 WhatsApp us your documents
            </a>
            <p className="text-white/40 text-xs mt-4">No upfront payment · Legal experts only</p>
          </div>
        ) : (
          <div className="rounded-2xl px-6 py-6 text-center bg-green-50 border border-green-100">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none">
                <path d="M8 18.5L14.5 25.5L28 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Request received!</h3>
            <p className="text-gray-500 text-sm">Our team will call you on <strong>{phone}</strong> within 30 minutes.</p>
          </div>
        )}
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
        onChange={(e) => setVehicle(e.target.value.toUpperCase())}
        placeholder="Vehicle number (e.g. DL 7S BY 5194)"
        autoCapitalize="characters"
        className={inputCls}
      />

      {/* Phone */}
      <div className={`flex items-center ${hero
        ? 'h-14 rounded-2xl bg-white shadow-lg overflow-hidden'
        : 'rounded-xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-primary-400 focus-within:bg-white transition-colors overflow-hidden'}`}>
        <span className="pl-4 pr-2 text-xl flex-shrink-0 leading-none">🇮🇳</span>
        <span className={`flex-shrink-0 w-px self-stretch ${hero ? 'bg-gray-200' : 'bg-gray-200'} my-3`} />
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
