'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { VEHICLE_NUMBER_MIN_LENGTH } from '@/lib/constants';

const VEHICLE_TABS = [
  { key: 'car',        label: 'Car',        icon: '/icons/car_white.svg' },
  { key: 'bike',       label: 'Bike',       icon: '/icons/two_wheeler_white.svg' },
  { key: 'commercial', label: 'Commercial', icon: '/icons/commercial_white.svg' },
  { key: 'auto',       label: 'Auto',       icon: '/icons/three_wheeler_white.svg' },
];

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

export function InsuranceHeroForm() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const [activeTab, setActiveTab] = useState('car');
  const router = useRouter();
  const animatedText = useTypingPlaceholder(!focused && !value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // IMPORTANT: never transform the value here. Android keyboards (Gboard)
    // compose text internally; any programmatic change (uppercase, space
    // insertion) desyncs the composition buffer and the next keystroke wipes
    // the field. Store raw, display uppercase via CSS, normalize on blur/submit.
    setValue(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    if (cleaned.length < VEHICLE_NUMBER_MIN_LENGTH) {
      setError('Please enter a valid vehicle registration number (e.g. DL7SBY1234)');
      return;
    }
    router.push(`/motor-insurance/${cleaned}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">

      {/* Vehicle types — display only, no interaction */}
      <div className="flex items-center justify-center gap-6 mb-4">
        {VEHICLE_TABS.map((tab) => (
          <div key={tab.key} className="flex items-center gap-1.5 text-sm font-medium text-white/80">
            <Image src={tab.icon} alt={tab.label} width={14} height={14} className="opacity-80" />
            {tab.label}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className={`flex items-center bg-white rounded-2xl px-4 gap-3 transition-shadow duration-200 ${focused ? 'shadow-glow-lg' : 'shadow-premium-xl'}`}>
        <div className="flex items-center gap-1.5 shrink-0 border-r border-gray-100 pr-3 py-4">
          <span className="text-xl leading-none select-none">🇮🇳</span>
          <span className="text-[10px] font-bold text-gray-400 tracking-widest select-none">IND</span>
        </div>
        <input
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setValue((v) => formatVehicleNumber(v)); }}
          placeholder={animatedText || 'MH 02 AB 1234'}
          className="flex-1 py-4 text-[16px] sm:text-lg font-bold text-gray-900 bg-transparent outline-none border-none placeholder:text-gray-300 placeholder:font-normal uppercase tracking-[0.1em] min-w-0"
          maxLength={13}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          inputMode="text"
          aria-label="Enter vehicle registration number"
        />
      </div>

      {/* CTA */}
      <button
        type="submit"
        className="mt-3 w-full py-3.5 active:scale-[0.99] font-bold text-sm rounded-2xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #f5c842 0%, #e8a800 100%)', color: '#1a1a1a' }}
        aria-label="Check insurance status"
      >
        <Search className="w-4 h-4 shrink-0" />
        Check Status &amp; Renew
      </button>

      {error && (
        <p className="mt-2.5 text-red-300 text-sm text-center animate-slide-down">{error}</p>
      )}

      {/* Single trust line — no repetition */}
      <p className="mt-3 text-center text-xs" style={{ color: 'rgba(255,255,255,0.72)' }}>
        Free check · No signup required · Works with all VAHAN-registered vehicles
      </p>
    </form>
  );
}
