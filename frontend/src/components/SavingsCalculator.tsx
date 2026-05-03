'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BadgePercent, Info, Sparkles, ShieldCheck } from 'lucide-react';
import { RotatingText } from '@/components/RotatingText';

// ─── Constants ────────────────────────────────────────────────────────────────

const PLATFORM_A_CONVENIENCE_RATE = 0.03;
const PLATFORM_B_CONVENIENCE_RATE = 0.05;
const MAX_CHALLAN_AMOUNT          = 500000;
const DEMO_AMOUNT                 = 2000;
const ESTIMATED_DISCOUNT_RATE     = 0.5;

function getEstimatedDiscountRate(_: number) { return ESTIMATED_DISCOUNT_RATE; }
function calcOurPrice(n: number)  { return Math.round(n * (1 - ESTIMATED_DISCOUNT_RATE)); }
function calcPlatformA(n: number) { return Math.round(n * (1 + PLATFORM_A_CONVENIENCE_RATE)); }
function calcPlatformB(n: number) { return Math.round(n * (1 + PLATFORM_B_CONVENIENCE_RATE)); }
function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n);
}

// Pre-computed demo values shown in empty state
const DEMO_RATE     = getEstimatedDiscountRate(DEMO_AMOUNT);
const DEMO_OUR      = calcOurPrice(DEMO_AMOUNT);
const DEMO_A        = calcPlatformA(DEMO_AMOUNT);
const DEMO_B        = calcPlatformB(DEMO_AMOUNT);
const DEMO_SAVE_A   = DEMO_A - DEMO_OUR;
const DEMO_SAVE_B   = DEMO_B - DEMO_OUR;
const DEMO_MAX_SAVE = Math.max(DEMO_SAVE_A, DEMO_SAVE_B);
const ROTATING_NUDGES = [
  'Compare before you pay',
  'Pending challans can lead to bigger penalties',
  'Get expert support for challan settlement',
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function SavingsCalculator() {
  const [inputValue, setInputValue] = useState('');

  const amount = useMemo(() => {
    const parsed = parseInt(inputValue.replace(/[^0-9]/g, ''), 10);
    if (isNaN(parsed)) return 0;
    return Math.min(Math.max(parsed, 0), MAX_CHALLAN_AMOUNT);
  }, [inputValue]);

  const hasAmount = amount > 0;
  const discountRate = hasAmount ? getEstimatedDiscountRate(amount) : DEMO_RATE;
  const ourPrice = calcOurPrice(amount);
  const platformAPrice = calcPlatformA(amount);
  const platformBPrice = calcPlatformB(amount);
  const savingsVsA = platformAPrice - ourPrice;
  const savingsVsB = platformBPrice - ourPrice;
  const maxSavings = Math.max(savingsVsA, savingsVsB);

  // Show demo values in empty state, real values when user types
  const dispOurPrice = hasAmount ? ourPrice       : DEMO_OUR;
  const dispA        = hasAmount ? platformAPrice : DEMO_A;
  const dispB        = hasAmount ? platformBPrice : DEMO_B;
  const dispSaveA    = hasAmount ? savingsVsA     : DEMO_SAVE_A;
  const dispSaveB    = hasAmount ? savingsVsB     : DEMO_SAVE_B;
  const dispMaxSave  = hasAmount ? maxSavings     : DEMO_MAX_SAVE;
  const dispDiscountLabel = hasAmount
    ? `Approx. ${Math.round(discountRate * 100)}% savings estimate`
    : 'Estimated savings up to 50%';

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '' || parseInt(raw, 10) <= MAX_CHALLAN_AMOUNT) setInputValue(raw);
  }

  return (
    <section id="savings-calculator" className="py-10 sm:py-14 bg-surface-50">
      <div className="container-app">

        <div className="max-w-lg mx-auto">

          <div className="w-full">

            {/* Header */}
            <div className="mb-6">
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1.5 text-primary-500">
                Save more
              </p>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 leading-none">
                Live price comparison
              </h2>
            </div>

            <div className="mb-4 flex items-center justify-center text-center min-h-[1.25rem] px-2">
              <div className="inline-flex max-w-full items-center justify-center gap-1.5 text-[11px] sm:text-xs font-medium text-gray-500">
                <BadgePercent className="w-3 h-3 text-primary-400 flex-shrink-0" />
                <RotatingText
                  texts={[...ROTATING_NUDGES]}
                  displayDuration={2700}
                  animDuration={320}
                  className="max-w-[260px] sm:max-w-[340px] leading-tight"
                />
              </div>
            </div>

            {/* Widget card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_2px_16px_rgba(0,0,0,0.07),0_0_0_1px_rgba(99,102,241,0.06)] overflow-hidden">

              {/* Input */}
              <div className="p-5 border-b border-gray-100">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Enter challan amount to compare
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg select-none">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 2000"
                    value={inputValue}
                    onChange={handleInput}
                    className="w-full pl-10 pr-4 py-3 text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:bg-white transition-colors"
                  />
                </div>
                {/* Demo label — always rendered (opacity only, zero CLS) */}
                <p className={`mt-2 transition-opacity duration-200 ${hasAmount ? 'opacity-0' : 'opacity-100'}`}>
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    <Sparkles className="w-2.5 h-2.5" />
                    Preview for ₹{DEMO_AMOUNT.toLocaleString('en-IN')} challan
                  </span>
                </p>
              </div>

              {/* Comparison table */}
              <div className="p-5 pb-4">

                {/* Column headers */}
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 px-1">
                  <span className="flex-1 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform</span>
                  <span className="w-[76px] sm:w-28 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right leading-tight">Your total</span>
                  <span className="w-[72px] sm:w-[88px] text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right leading-tight">vs us</span>
                </div>

                {/* ChallanSetu row */}
                <div className="flex items-center gap-1.5 sm:gap-2 bg-accent-50 border-2 border-accent-300 rounded-xl px-3 sm:px-4 py-3 mb-3">
                  <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-accent-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] sm:text-sm font-bold text-gray-900 leading-none mb-0.5 sm:mb-1 mt-0.5">ChallanSetu</p>
                      <p className="text-[9px] sm:text-[10px] text-accent-600 font-semibold leading-none whitespace-nowrap truncate py-0.5">
                        {dispDiscountLabel}
                      </p>
                    </div>
                  </div>
                  <span className="w-[76px] sm:w-28 text-right text-base sm:text-lg font-black text-accent-600 tabular-nums">
                    {formatINR(dispOurPrice)}
                  </span>
                  <div className="w-[72px] sm:w-[88px] flex justify-end">
                    <span className="text-[9px] sm:text-[10px] font-black bg-accent-500 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                      ✓ Lowest
                    </span>
                  </div>
                </div>

                {/* VS divider */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="h-px flex-1 bg-gray-100" />
                  <span className="text-[9px] sm:text-[10px] font-black text-gray-300 uppercase tracking-widest px-1">vs others</span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>

                {/* Platform A */}
                <div className="flex items-center gap-1.5 sm:gap-2 border border-gray-100 rounded-xl px-3 sm:px-4 py-3 mb-2">
                  <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden flex-shrink-0 select-none pointer-events-none opacity-60">
                      <Image src="/competitor-logo-blur.svg" alt="" width={32} height={32} className="w-full h-full object-cover" draggable={false} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] sm:text-sm font-semibold text-gray-400 blur-[2px] sm:blur-[3px] select-none leading-none">cars28</p>
                    </div>
                  </div>
                  <span className="w-[76px] sm:w-28 text-right text-sm sm:text-base font-bold text-gray-700 tabular-nums">
                    {formatINR(dispA)}
                  </span>
                  <div className="w-[72px] sm:w-[88px] flex justify-end">
                    <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap tabular-nums text-red-500 bg-red-50 border border-red-100">
                      +{formatINR(dispSaveA)}
                    </span>
                  </div>
                </div>

                {/* Platform B */}
                <div className="flex items-center gap-1.5 sm:gap-2 border border-gray-100 rounded-xl px-3 sm:px-4 py-3">
                  <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden flex-shrink-0 select-none pointer-events-none opacity-60">
                      <Image src="/competitor-logo-blur-2.png" alt="" width={32} height={32} className="w-full h-full object-cover" draggable={false} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] sm:text-sm font-semibold text-gray-400 blur-[2px] sm:blur-[3px] select-none leading-none">stinny</p>
                    </div>
                  </div>
                  <span className="w-[76px] sm:w-28 text-right text-sm sm:text-base font-bold text-gray-700 tabular-nums">
                    {formatINR(dispB)}
                  </span>
                  <div className="w-[72px] sm:w-[88px] flex justify-end">
                    <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap tabular-nums text-red-500 bg-red-50 border border-red-100">
                      +{formatINR(dispSaveB)}
                    </span>
                  </div>
                </div>

                {/*
                  Savings area — ZERO CLS
                  Fixed height container, two absolute layers cross-fade.
                */}
                <div className="relative mt-4" style={{ height: '64px' }}>

                  {/* Empty state */}
                  <div className={`absolute inset-0 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center transition-opacity duration-200 ${hasAmount ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-700 leading-none">Enter your challan amount above</p>
                      <p className="text-xs text-gray-400 mt-1">↑ Preview your estimated savings</p>
                    </div>
                  </div>

                  {/* Filled state */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-accent-500 to-emerald-500 flex items-center justify-between px-4 text-white transition-opacity duration-200 ${hasAmount ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="flex items-baseline gap-1.5 min-w-0">
                      <span className="text-xs text-white/70 font-medium whitespace-nowrap">Estimated savings up to</span>
                      <span className="text-xl font-black tabular-nums truncate">{formatINR(dispMaxSave)}</span>
                    </div>
                    <Link
                      href="#hero-lead-form"
                      className="flex items-center gap-1.5 bg-white text-accent-600 text-sm font-bold px-4 py-2 rounded-xl hover:bg-accent-50 transition-colors flex-shrink-0"
                    >
                      Start request <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                <Info className="w-3 h-3 text-gray-300 flex-shrink-0" />
                <p className="text-[11px] text-gray-400 flex-1">
                  Illustrative estimates based on a discount range up to 50% and typical platform convenience fee patterns. Final offers depend on challan details.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
