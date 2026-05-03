'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Calculator, ArrowRight } from 'lucide-react';
import { LeadCaptureModal } from '@/components/LeadCaptureModal';
import {
  VEHICLE_NUMBER_REGEX,
  VEHICLE_NUMBER_MIN_LENGTH,
  VEHICLE_NUMBER_MAX_LENGTH,
  VEHICLE_NUMBER_EXAMPLES,
} from '@/lib/constants';
import messages from '@/data/messages.json';
import landingData from '@/data/landing.json';

interface HeroFormProps {
  source?: 'homepage' | 'city_page';
  city?: string;
  formId?: string;
  showCalculatorLink?: boolean;
}

// ─── Format Helper ────────────────────────────────────────────────────────────

function formatVehicleNumber(val: string) {
  let cleaned = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let formatted = '';

  const stateMatch = cleaned.match(/^[A-Z]{1,2}/);
  if (!stateMatch) return cleaned;

  formatted += stateMatch[0];
  cleaned = cleaned.substring(stateMatch[0].length);
  if (stateMatch[0].length === 2 && cleaned.length > 0) {
    formatted += ' ';
  }

  const rtoMatch = cleaned.match(/^[0-9A-Z]{1,2}/);
  if (!rtoMatch) return formatted;

  formatted += rtoMatch[0];
  cleaned = cleaned.substring(rtoMatch[0].length);
  if (rtoMatch[0].length === 2 && cleaned.length > 0) {
    formatted += ' ';
  }

  const seriesMatch = cleaned.match(/^[A-Z]+/);
  if (seriesMatch) {
    formatted += seriesMatch[0];
    cleaned = cleaned.substring(seriesMatch[0].length);
    if (cleaned.length > 0) {
      formatted += ' ';
    }
  }

  if (cleaned.length > 0) {
    formatted += cleaned;
  }

  return formatted;
}

// ─── Typing animation hook ────────────────────────────────────────────────────

const EXAMPLES = ['DL 7S BY 1234', 'MH 02 AB 5678', 'KA 05 MG 2345', 'UP 16 AT 9876'];
const TYPE_MS = 90;   // ms per character typed
const DEL_MS = 45;   // ms per character deleted
const PAUSE_MS = 1800; // pause after full word shown
const GAP_MS = 350;  // pause before typing next word

function useTypingPlaceholder(active: boolean) {
  const [text, setText] = useState('');
  const s = useRef({ ex: 0, ch: 0, del: false, t: null as ReturnType<typeof setTimeout> | null });

  useEffect(() => {
    const r = s.current;
    if (r.t) clearTimeout(r.t);

    if (!active) {
      setText('');
      r.ch = 0; r.del = false;
      return;
    }

    function tick() {
      const target = EXAMPLES[r.ex];
      if (!r.del) {
        if (r.ch < target.length) {
          r.ch++;
          setText(target.slice(0, r.ch));
          r.t = setTimeout(tick, TYPE_MS);
        } else {
          r.del = true;
          r.t = setTimeout(tick, PAUSE_MS);
        }
      } else {
        if (r.ch > 0) {
          r.ch--;
          setText(target.slice(0, r.ch));
          r.t = setTimeout(tick, DEL_MS);
        } else {
          r.del = false;
          r.ex = (r.ex + 1) % EXAMPLES.length;
          r.t = setTimeout(tick, GAP_MS);
        }
      }
    }

    tick();
    return () => { if (r.t) clearTimeout(r.t); };
  }, [active]);

  return text;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroForm({
  source = 'homepage',
  city,
  formId = 'hero-lead-form',
  showCalculatorLink = true,
}: HeroFormProps) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [pendingVehicle, setPendingVehicle] = useState('');

  const showAnimation = !focused && vehicleNumber === '';
  const animatedText = useTypingPlaceholder(showAnimation);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      const cleaned = vehicleNumber.toUpperCase().replace(/[\s\-./]/g, '');
      if (cleaned.length < VEHICLE_NUMBER_MIN_LENGTH || cleaned.length > VEHICLE_NUMBER_MAX_LENGTH) {
        setError(messages.validation.vehicleNumberInvalid);
        return;
      }
      if (!VEHICLE_NUMBER_REGEX.test(cleaned)) {
        setError(messages.validation.vehicleNumberFormat.replace('{examples}', VEHICLE_NUMBER_EXAMPLES));
        return;
      }
      setPendingVehicle(cleaned);
      setLeadModalOpen(true);
    },
    [vehicleNumber],
  );

  return (
    <>
      <form id={formId} onSubmit={handleSubmit} className="max-w-xl mx-auto px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row gap-2">

          {/* Input wrapper — relative so overlay can sit inside */}
          <div className="flex-1 relative">
            <Input
              placeholder={showAnimation ? '' : landingData.hero.searchPlaceholder}
              value={vehicleNumber}
              onChange={(e) => {
                setVehicleNumber(formatVehicleNumber(e.target.value));
                if (error) setError('');
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              maxLength={VEHICLE_NUMBER_MAX_LENGTH}
              className={`text-gray-900 text-base py-3.5 bg-white shadow-lg font-medium placeholder:font-normal ${error
                ? 'border-2 border-red-400 focus:ring-2 focus:ring-red-400/40'
                : 'border-0 focus:ring-2 focus:ring-primary-400/50'
                }`}
              autoComplete="off"
              autoCapitalize="characters"
            />

            {/* Animated placeholder overlay */}
            {showAnimation && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-0 bottom-0 flex items-center text-base text-gray-400 font-normal select-none"
              >
                {animatedText}
                {/* blinking cursor */}
                <span className="inline-block w-px h-[18px] bg-gray-400/70 ml-0.5 animate-pulse" />
              </span>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="whitespace-nowrap bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:scale-[1.02] w-full sm:w-auto font-bold"
          >
            {landingData.hero.searchButton}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Validation error — rendered outside the flex row so it spans full
            width and is visible on the dark hero gradient */}
        {error && (
          <p className="flex items-center gap-1.5 mt-2 px-1 text-sm text-red-300 text-left">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {/* Calculator CTA — sits below, no wrapper box */}
        {showCalculatorLink && (
          <a
            href="#savings-calculator"
            className="group flex items-center justify-between gap-3 mt-3 mb-8 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-200"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                <Calculator className="w-3.5 h-3.5 text-accent-300" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-none">Start for free</p>
                <p className="text-[11px] text-accent-300/80 mt-0.5">Check your discount eligibility</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[11px] font-black text-accent-300 bg-accent-500/20 px-2 py-0.5 rounded-full">Up to 50% Off </span>
              <span className="text-white/40 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all duration-200">→</span>
            </div>
          </a>
        )}

      </form>

      <LeadCaptureModal
        open={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        vehicleNumber={pendingVehicle}
        source={source}
        city={city}
      />
    </>
  );
}
