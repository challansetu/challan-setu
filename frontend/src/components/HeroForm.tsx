'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Calculator, ArrowRight, X, ChevronRight, Car } from 'lucide-react';
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

const EXAMPLES = ['DL 7S BY 1234', 'MH 02 AB 5678', 'KA 05 MG 2345', 'UP 16 AT 9876'];
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
        if (r.ch < target.length) {
          r.ch++; setText(target.slice(0, r.ch)); r.t = setTimeout(tick, TYPE_MS);
        } else {
          r.del = true; r.t = setTimeout(tick, PAUSE_MS);
        }
      } else {
        if (r.ch > 0) {
          r.ch--; setText(target.slice(0, r.ch)); r.t = setTimeout(tick, DEL_MS);
        } else {
          r.del = false; r.ex = (r.ex + 1) % EXAMPLES.length; r.t = setTimeout(tick, GAP_MS);
        }
      }
    }

    tick();
    return () => { if (r.t) clearTimeout(r.t); };
  }, [active]);

  return text;
}

const RECENT_KEY = 'challan_recent_vehicles';

export function HeroForm({
  source = 'homepage',
  city,
  formId = 'hero-lead-form',
  showCalculatorLink = true,
}: HeroFormProps) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [pendingVehicle, setPendingVehicle] = useState('');

  // Search overlay
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayVehicle, setOverlayVehicle] = useState('');
  const [overlayError, setOverlayError] = useState('');
  const [recentVehicles, setRecentVehicles] = useState<string[]>([]);
  const overlayInputRef = useRef<HTMLInputElement>(null);

  const showAnimation = !showOverlay && vehicleNumber === '';
  const animatedText = useTypingPlaceholder(showAnimation);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) setRecentVehicles(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    if (!showOverlay) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [showOverlay]);

  useEffect(() => {
    if (!showOverlay) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowOverlay(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showOverlay]);

  const saveRecent = useCallback((vehicle: string) => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      const recent: string[] = stored ? JSON.parse(stored) : [];
      const updated = [vehicle, ...recent.filter((v) => v !== vehicle)].slice(0, 6);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      setRecentVehicles(updated);
    } catch {}
  }, []);

  const openOverlay = useCallback(() => {
    setOverlayVehicle(vehicleNumber);
    setOverlayError('');
    setShowOverlay(true);
  }, [vehicleNumber]);

  const submitVehicle = useCallback((vehicle: string) => {
    const cleaned = vehicle.toUpperCase().replace(/[\s\-./]/g, '');
    if (cleaned.length < VEHICLE_NUMBER_MIN_LENGTH || cleaned.length > VEHICLE_NUMBER_MAX_LENGTH) {
      setOverlayError(messages.validation.vehicleNumberInvalid);
      return;
    }
    if (!VEHICLE_NUMBER_REGEX.test(cleaned)) {
      setOverlayError(messages.validation.vehicleNumberFormat.replace('{examples}', VEHICLE_NUMBER_EXAMPLES));
      return;
    }
    saveRecent(cleaned);
    setVehicleNumber(formatVehicleNumber(cleaned));
    setShowOverlay(false);
    setOverlayError('');
    setPendingVehicle(cleaned);
    setLeadModalOpen(true);
  }, [saveRecent]);

  return (
    <>
      <form
        id={formId}
        onSubmit={(e) => { e.preventDefault(); openOverlay(); }}
        className="max-w-xl mx-auto px-4 sm:px-0"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            {/* Read-only trigger — tapping opens the overlay */}
            <div
              role="button"
              tabIndex={0}
              onClick={openOverlay}
              onKeyDown={(e) => e.key === 'Enter' && openOverlay()}
              className={`w-full h-12 flex items-center px-4 rounded-xl bg-white shadow-lg text-base font-medium text-gray-900 cursor-pointer select-none ${
                vehicleNumber ? '' : 'text-gray-400'
              }`}
            >
              {vehicleNumber || (
                <span className="flex items-center">
                  {animatedText}
                  <span className="inline-block w-px h-[18px] bg-gray-400/70 ml-0.5 animate-pulse" />
                </span>
              )}
            </div>
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

      {/* ── Search overlay: full-screen on mobile, centred modal on desktop ── */}
      {showOverlay && createPortal(
        <div className="fixed inset-0 z-[150] flex flex-col sm:items-center sm:justify-center sm:bg-gray-900/50 sm:backdrop-blur-sm sm:p-4">
          {/* Card */}
          <div className="flex flex-col bg-white w-full h-full sm:h-auto sm:max-w-lg sm:rounded-3xl sm:shadow-2xl sm:max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 sm:border-b sm:border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Enter your vehicle number</h2>
              <button
                type="button"
                onClick={() => setShowOverlay(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Input */}
            <div className="px-5 pt-1 sm:pt-5">
              <div className={`flex items-center rounded-2xl border-2 overflow-hidden ${overlayError ? 'border-red-400' : 'border-primary-500'}`}>
                <div className="flex items-center gap-1.5 bg-primary-600 px-3 self-stretch">
                  <span className="text-base leading-none">🇮🇳</span>
                  <span className="text-xs font-bold text-white tracking-wider">IND</span>
                </div>
                <input
                  ref={overlayInputRef}
                  autoFocus
                  type="text"
                  value={overlayVehicle}
                  onChange={(e) => {
                    setOverlayVehicle(formatVehicleNumber(e.target.value));
                    if (overlayError) setOverlayError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && submitVehicle(overlayVehicle)}
                  placeholder="e.g. DL 7S BY 5194"
                  maxLength={VEHICLE_NUMBER_MAX_LENGTH + 3}
                  autoComplete="off"
                  autoCapitalize="characters"
                  className="flex-1 py-4 px-4 text-base font-semibold text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                />
              </div>
              {overlayError ? (
                <p className="mt-2 text-sm text-red-500 px-1">{overlayError}</p>
              ) : (
                <p className="mt-2 text-sm text-gray-400 px-1">Same as your vehicle registration number</p>
              )}
            </div>

            {/* Recent searches */}
            {recentVehicles.length > 0 && (
              <div className="flex-1 overflow-y-auto mt-4">
                <p className="px-5 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Recent searches</p>
                <div className="divide-y divide-gray-100">
                  {recentVehicles.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => submitVehicle(v)}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Car className="w-5 h-5 text-gray-400" />
                      </div>
                      <span className="flex-1 text-base font-semibold text-gray-900">{formatVehicleNumber(v)}</span>
                      <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {recentVehicles.length === 0 && <div className="flex-1 sm:hidden" />}

            {/* CTA */}
            <div className="p-5 border-t border-gray-100 sm:mt-4">
              <Button
                type="button"
                size="lg"
                onClick={() => submitVehicle(overlayVehicle)}
                disabled={!overlayVehicle.trim()}
                className="w-full rounded-2xl h-14"
              >
                {landingData.hero.searchButton}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>,
        document.body,
      )}

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
