'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { VEHICLE_NUMBER_MIN_LENGTH } from '@/lib/constants';
import { leadsApi } from '@/lib/api';
import { trackBannerClick } from '@/lib/analytics';

const BRAND_YELLOW = '#f5c842';

const VEHICLE_TABS = [
  { key: 'car', label: 'Car', icon: '/icons/car_white.svg' },
  { key: 'bike', label: 'Bike', icon: '/icons/two_wheeler_white.svg' },
  { key: 'commercial', label: 'Commercial', icon: '/icons/commercial_white.svg' },
  { key: 'auto', label: 'Auto', icon: '/icons/three_wheeler_white.svg' },
];

// PolicyBazaar partner links (same as the RenewalBanner slides).
const PB_OPTIONS = [
  { name: 'insurance_car', label: 'Car Insurance', benefit: 'Up to 91% off · Cashless claims · 20+ insurers', topPick: true, href: 'https://ci.policybazaar.com/v1?utm_source=ChallanSetu' },
  { name: 'insurance_two_wheeler', label: 'Two-Wheeler', benefit: 'Plans from ₹1.3/day · Instant policy', topPick: false, href: 'https://twowheeler.policybazaar.com/?utm_source=ChallanSetu' },
  { name: 'insurance_commercial', label: 'Commercial Vehicle', benefit: 'Starting at ₹3,139/year · Taxi, truck & fleet', topPick: false, href: 'https://commercial.policybazaar.com/?utm_source=ChallanSetu&utm_campaign=&utm_medium' },
];

const PHONE_REGEX = /^[6-9]\d{9}$/;

function formatVehicleNumber(val: string) {
  let cleaned = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let formatted = '';
  const stateMatch = cleaned.match(/^[A-Z]{1,2}/);
  if (!stateMatch) return cleaned;
  formatted += stateMatch[0];
  cleaned = cleaned.substring(stateMatch[0].length);
  if (stateMatch[0].length === 2 && cleaned.length > 0) formatted += ' ';
  const rtoMatch = cleaned.match(/^[0-9A-Z]{1,2}/);
  if (!rtoMatch) return formatted;
  formatted += rtoMatch[0];
  cleaned = cleaned.substring(rtoMatch[0].length);
  if (rtoMatch[0].length === 2 && cleaned.length > 0) formatted += ' ';
  const seriesMatch = cleaned.match(/^[A-Z]+/);
  if (seriesMatch) {
    formatted += seriesMatch[0];
    cleaned = cleaned.substring(seriesMatch[0].length);
    if (cleaned.length > 0) formatted += ' ';
  }
  if (cleaned.length > 0) formatted += cleaned;
  return formatted;
}

const EXAMPLES = ['DL 7S BY 1234', 'MH 02 AB 5678', 'KA 05 MG 2345', 'HR 26 DX 8421'];
const TYPE_MS = 90;
const DEL_MS = 45;
const PAUSE_MS = 1800;
const GAP_MS = 350;

function useTypingPlaceholder(active: boolean) {
  const [text, setText] = useState('');
  const s = useRef({ ex: 0, ch: 0, del: false, t: null as ReturnType<typeof setTimeout> | null });

  useEffect(() => {
    const r = s.current;
    if (r.t) clearTimeout(r.t);
    if (!active) { setText(''); r.ch = 0; r.del = false; return; }

    function tick() {
      const target = EXAMPLES[r.ex];
      if (!r.del) {
        if (r.ch < target.length) { r.ch++; setText(target.slice(0, r.ch)); r.t = setTimeout(tick, TYPE_MS); }
        else { r.del = true; r.t = setTimeout(tick, PAUSE_MS); }
      } else {
        if (r.ch > 0) { r.ch--; setText(target.slice(0, r.ch)); r.t = setTimeout(tick, DEL_MS); }
        else { r.del = false; r.ex = (r.ex + 1) % EXAMPLES.length; r.t = setTimeout(tick, GAP_MS); }
      }
    }
    tick();
    return () => { if (r.t) clearTimeout(r.t); };
  }, [active]);

  return text;
}

type Step = 'vehicle' | 'mobile' | 'options';

interface InsuranceHeroFormProps {
  /** First line of the H1 (yellow). Defaults to the generic motor-insurance copy. */
  headingLine1?: string;
  /** Second line of the H1 (yellow). */
  headingLine2?: string;
  /** Sub-heading shown under the H1 on the vehicle-number step. */
  subheading?: string;
}

export function InsuranceHeroForm({
  headingLine1 = 'Check & Renew Motor Insurance',
  headingLine2 = 'Save up to 85% Online',
  subheading = 'Free VAHAN check, enter your vehicle number to check status & compare renewal quotes from 20+ insurers.',
}: InsuranceHeroFormProps = {}) {
  const [step, setStep] = useState<Step>('vehicle');
  const [value, setValue] = useState('');
  const [vehicleClean, setVehicleClean] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const animatedText = useTypingPlaceholder(!focused && !value && step === 'vehicle');

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Store raw, display uppercase via CSS, normalize on blur/submit (Gboard-safe).
    setValue(e.target.value);
    if (error) setError('');
  };

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    if (cleaned.length < VEHICLE_NUMBER_MIN_LENGTH) {
      setError('Please enter a valid vehicle registration number (e.g. DL7SBY1234)');
      return;
    }
    setVehicleClean(cleaned);
    setError('');
    setStep('mobile');
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const m = mobile.replace(/\D/g, '');
    if (!PHONE_REGEX.test(m)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setSubmitting(true);

    const payload = {
      fullName: 'Insurance Lead',
      mobileNumber: m,
      vehicleNumber: vehicleClean,
      consentAccepted: true as const,
      source: 'insurance' as const,
    };

    try {
      await leadsApi.create(payload);
    } catch {
      // Retry once, gives Railway's cold-starting backend time to wake up.
      await new Promise((resolve) => setTimeout(resolve, 5000));
      try {
        await leadsApi.create(payload);
      } catch {
        // Best-effort: never block the user from their renewal options.
      }
    }

    setSubmitting(false);
    setStep('options');
  };

  /* ── Step 3: PolicyBazaar options ─────────────────────────────────── */
  if (step === 'options') {
    return (
      <div className="w-full max-w-xl mx-auto animate-slide-down">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle2 className="w-6 h-6" style={{ color: BRAND_YELLOW }} />
          <h2 className="text-xl sm:text-2xl font-black text-white">You&apos;re all set!</h2>
        </div>
        <p className="text-[14px] text-white/70 mb-6">
          Pick your vehicle type to get the best renewal quotes for{' '}
          <span className="font-bold text-white">{vehicleClean}</span> from our partner.
        </p>

        <div className="flex flex-col gap-3">
          {PB_OPTIONS.map((opt) => (
            <a
              key={opt.name}
              href={opt.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBannerClick(opt.name, { placement: 'insurance_hero' })}
              className="relative group flex items-start gap-3.5 bg-white rounded-2xl border border-gray-100 px-4 py-3.5 text-left shadow-premium-xl transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.99]"
            >
              {opt.topPick && (
                <span className="absolute -top-2 left-4 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ★ Top Pick
                </span>
              )}
              {/* radio affordance */}
              <span className="mt-0.5 w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-amber-400 transition-colors shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-extrabold text-gray-900 text-[16px] leading-tight">{opt.label}</span>
                  <Image src="/icons/policybazaar-logo.png" alt="PolicyBazaar" width={104} height={15} className="shrink-0" />
                </span>
                <span className="block text-[13px] text-gray-500 leading-snug">{opt.benefit}</span>
              </span>
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => { setMobile(''); setError(''); setStep('mobile'); }}
          className="mt-4 text-xs text-white/55 hover:text-white/80 underline underline-offset-2 transition-colors"
        >
          Entered wrong number? Change it
        </button>
      </div>
    );
  }

  /* ── Steps 1 & 2 share the heading ────────────────────────────────── */
  return (
    <div className="w-full max-w-xl mx-auto">
      <h1 className="tracking-tight mb-2 leading-[1.2]">
        <span className="block text-[34px] sm:text-[40px] font-black" style={{ color: BRAND_YELLOW }}>
          {headingLine1}
        </span>{' '}
        <span className="block text-[34px] sm:text-[40px] font-black pb-1" style={{ color: BRAND_YELLOW }}>
          {headingLine2}
        </span>
      </h1>
      <p className="text-[15px] sm:text-[17px] text-white/70 leading-[1.4] mb-5">
        {step === 'vehicle'
          ? subheading
          : 'Almost done, enter your mobile number to view your status & renewal options.'}
      </p>

      {step === 'vehicle' && (
        <form onSubmit={handleVehicleSubmit}>
          {/* Vehicle types, display only */}
          <div className="flex items-center justify-center gap-6 mb-4">
            {VEHICLE_TABS.map((tab) => (
              <div key={tab.key} className="flex items-center gap-1.5 text-sm font-medium text-white/80">
                <Image src={tab.icon} alt={tab.label} width={14} height={14} className="opacity-80" />
                {tab.label}
              </div>
            ))}
          </div>

          <div className={`flex items-center bg-white rounded-2xl px-4 gap-3 transition-shadow duration-200 ${focused ? 'shadow-glow-lg' : 'shadow-premium-xl'}`}>
            <div className="flex items-center gap-1.5 shrink-0 border-r border-gray-100 pr-3 py-4">
              <span className="text-xl leading-none select-none">🇮🇳</span>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest select-none">IND</span>
            </div>
            <input
              value={value}
              onChange={handleVehicleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => { setFocused(false); setValue((v) => formatVehicleNumber(v)); }}
              placeholder={animatedText || 'MH 02 AB 1234'}
              className="flex-1 py-4 text-[16px] sm:text-lg font-bold text-gray-900 bg-transparent outline-none border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-300 placeholder:font-normal uppercase tracking-[0.1em] min-w-0"
              maxLength={13}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
              aria-label="Enter vehicle registration number"
            />
          </div>

          <button
            type="submit"
            className="mt-3 w-full py-3.5 active:scale-[0.99] font-bold text-sm rounded-2xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #f5c842 0%, #e8a800 100%)', color: '#1a1a1a' }}
            aria-label="Check insurance status"
          >
            <Search className="w-4 h-4 shrink-0" />
            Check Status &amp; Renew
          </button>

          {error && <p className="mt-2.5 text-red-300 text-sm text-center animate-slide-down">{error}</p>}

          <p className="mt-3 text-center text-xs" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Free check · No signup required · Works with all VAHAN-registered vehicles
          </p>
        </form>
      )}

      {step === 'mobile' && (
        <form onSubmit={handleMobileSubmit} className="animate-slide-down">
          <div className="bg-white/10 border border-white/15 rounded-2xl px-3 py-2.5 mb-3 flex items-center justify-center gap-2 text-sm text-white/80">
            <Search className="w-4 h-4 shrink-0" style={{ color: BRAND_YELLOW }} />
            Checking <span className="font-bold text-white">{vehicleClean}</span>
            <button
              type="button"
              onClick={() => { setError(''); setStep('vehicle'); }}
              className="ml-1 text-xs underline underline-offset-2 text-white/60 hover:text-white transition-colors"
            >
              Change
            </button>
          </div>

          <div className={`flex items-center bg-white rounded-2xl px-4 gap-3 transition-shadow duration-200 ${focused ? 'shadow-glow-lg' : 'shadow-premium-xl'}`}>
            <div className="flex items-center gap-1.5 shrink-0 border-r border-gray-100 pr-3 py-4">
              <span className="text-xl leading-none select-none">🇮🇳</span>
              <span className="text-[12px] font-bold text-gray-500 tracking-wide select-none">+91</span>
            </div>
            <input
              value={mobile}
              onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); if (error) setError(''); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="10-digit mobile number"
              className="flex-1 py-4 text-[16px] sm:text-lg font-bold text-gray-900 bg-transparent outline-none border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-300 placeholder:font-normal tracking-[0.1em] min-w-0"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              aria-label="Enter your mobile number"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 w-full py-3.5 active:scale-[0.99] font-bold text-sm rounded-2xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #f5c842 0%, #e8a800 100%)', color: '#1a1a1a' }}
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Getting your options…</> : <>View My Renewal Options <ArrowRight className="w-4 h-4" /></>}
          </button>

          {error && <p className="mt-2.5 text-red-300 text-sm text-center animate-slide-down">{error}</p>}

          <p className="mt-3 text-center text-xs" style={{ color: 'rgba(255,255,255,0.72)' }}>
            We&apos;ll only use this to share your insurance options. No spam.
          </p>
        </form>
      )}
    </div>
  );
}
