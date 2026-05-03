'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Shield, ChevronRight, MessageCircle, CheckCircle2, X } from 'lucide-react';
import { Logo } from '@/components/Logo';

const STEP_DURATION = 5000;

const STEPS = [
  {
    title: 'Enter your vehicle number',
    subtitle: 'Start on the homepage with your registration number to begin your challan request.',
  },
  {
    title: 'Share your details and consent',
    subtitle: 'Add your full name, mobile number, and consent so our team can verify the best option for you.',
  },
  {
    title: 'Receive confirmation instantly',
    subtitle: 'Your request is saved right away, and we follow up shortly with the best discount option.',
  },
];

function fmt(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ── Mock phone screens ────────────────────────────────────────────────────────

function Screen1() {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 pt-3 pb-2 border-b border-gray-100 flex items-center justify-between">
        <Logo scheme="dark" height={16} />
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-gray-300" />
        </div>
      </div>
      <div className="flex-1 px-4 pt-4 flex flex-col">
        <p className="text-[11px] font-semibold text-gray-400 mb-1">START REQUEST</p>
        <h3 className="text-[16px] font-black text-gray-900 leading-snug mb-4">
          Enter vehicle<br />number
        </h3>
        <div
          className="rounded-xl mb-3 px-3 py-2.5 flex items-center gap-2"
          style={{ border: '2px solid #4f46e5', background: '#f5f3ff' }}
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#4f46e5' }} />
          <span className="text-[13px] font-bold text-gray-900 tracking-widest flex-1">
            DL 9C BB3456
          </span>
          <span className="w-[2px] h-4 rounded-full animate-pulse" style={{ background: '#4f46e5' }} />
        </div>
        <button
          className="w-full text-white text-[12px] font-bold rounded-xl py-2.5 flex items-center justify-center gap-1.5 mb-4"
          style={{ background: '#4f46e5' }}
        >
          Continue
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <div className="rounded-xl p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
            What happens next
          </p>
          <div className="space-y-1.5">
            {['Share your name', 'Add your mobile number', 'Give consent to contact'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4f46e5' }} />
                <span className="text-[9px] font-medium text-gray-500">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Screen2() {
  return (
    <div className="flex flex-col h-full" style={{ background: '#f8fafc' }}>
      <div className="px-3 pt-3 pb-2 flex items-center justify-between">
        <div className="w-8" />
        <Logo scheme="dark" height={18} />
        <X className="w-3.5 h-3.5 text-gray-300" />
      </div>
      <div className="flex-1 px-3 pt-1 pb-3 flex flex-col">
        <h3 className="text-[15px] font-black text-gray-900 text-center leading-tight mb-1.5">
          Continue with your request
        </h3>
        <p className="text-[9px] text-gray-400 text-center leading-snug mb-3 px-3">
          Share your details and we&apos;ll verify the best challan discount option for you.
        </p>

        <div className="rounded-2xl px-3 py-2.5 mb-2" style={{ background: '#eef2ff', border: '1px solid #c7d2fe' }}>
          <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: '#6366f1' }}>
            Vehicle Number
          </p>
          <p className="text-[13px] font-black text-gray-900 mt-1">DL7SBY5194</p>
        </div>

        <p className="text-[8px] font-bold text-gray-500 mb-1 ml-1">Full Name</p>
        <div className="rounded-xl px-3 py-2.5 mb-2 bg-white" style={{ border: '1px solid #e5e7eb' }}>
          <p className="text-[12px] font-semibold text-gray-900">Yash Gupta</p>
        </div>

        <p className="text-[8px] font-bold text-gray-500 mb-1 ml-1">Mobile Number</p>
        <div className="rounded-xl px-3 py-2.5 mb-2 bg-white" style={{ border: '1px solid #e5e7eb' }}>
          <p className="text-[12px] font-semibold text-gray-900">8796323876</p>
        </div>

        <button
          className="mt-auto w-full text-white text-[11px] font-black rounded-2xl py-3 flex items-center justify-center gap-1.5"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
        >
          Submit Request <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function Screen3() {
  return (
    <div className="flex flex-col h-full" style={{ background: '#f8fafc' }}>
      <div className="bg-white px-3 pt-2 pb-2.5 border-b border-gray-100 flex items-center justify-center">
        <Logo scheme="dark" height={16} />
      </div>
      <div className="flex-1 px-3 pt-3 flex flex-col gap-2.5 overflow-hidden">
        <div className="rounded-2xl p-3 flex items-center gap-2.5" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.22)' }}>
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-black text-white leading-none">Request received</p>
            <p className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.8)' }}>
              We&apos;ll verify your challan details shortly.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #f1f5f9' }}>
          <div className="px-3 pt-2.5 pb-0">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">What happens next</p>
            <div className="flex items-start gap-2 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: '#10b981' }} />
              <span className="text-[9px] text-gray-500 leading-snug">We review your vehicle number and challan details.</span>
            </div>
            <div className="flex items-start gap-2 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: '#10b981' }} />
              <span className="text-[9px] text-gray-500 leading-snug">We share the best discount option with you shortly.</span>
            </div>
          </div>
          <div className="px-3 py-2.5 flex justify-between items-center" style={{ background: '#f8fafc', borderTop: '1px dashed #e2e8f0' }}>
            <span className="text-[10px] font-black text-gray-900">Vehicle number</span>
            <span className="text-[12px] font-black" style={{ color: '#4f46e5' }}>DL7SBY5194</span>
          </div>
        </div>
      </div>
      <div className="px-3 pb-3 pt-2">
        <button
          className="w-full text-white text-[12px] font-black rounded-2xl py-3 flex items-center justify-center gap-1.5"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
        >
          WhatsApp Us <MessageCircle className="w-3.5 h-3.5" />
        </button>
        <p className="text-center text-[8px] text-gray-400 mt-1.5 flex items-center justify-center gap-1">
          <Shield className="w-2.5 h-2.5" /> We&apos;ll contact you shortly
        </p>
      </div>
    </div>
  );
}

const SCREENS = [Screen1, Screen2, Screen3];

// ── Shared phone frame ────────────────────────────────────────────────────────

function PhoneFrame({ children, scale = 1 }: { children: React.ReactNode; scale?: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 240 * scale,
        flexShrink: 0,
        borderRadius: 36 * scale,
        background: '#fff',
        overflow: 'hidden',
        border: `${6 * scale}px solid #1c1c1e`,
        boxShadow: '0 0 0 1px #2c2c2e, 0 20px 40px rgba(0,0,0,0.18)',
      }}
    >
      {/* Status bar */}
      <div style={{ position: 'relative', height: 28 * scale, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${16 * scale}px`, flexShrink: 0 }}>
        <span style={{ fontSize: 9 * scale, fontWeight: 600, color: '#1f2937', zIndex: 10 }}>9:41</span>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 4 * scale, width: 64 * scale, height: 16 * scale, background: '#000', borderRadius: 99 * scale, zIndex: 20 }} />
        <span style={{ fontSize: 9 * scale, fontWeight: 600, color: '#1f2937', zIndex: 10 }}>●●●</span>
      </div>
      {/* Screen */}
      <div style={{ height: 420 * scale, overflow: 'hidden' }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: `${100 / scale}%`, height: `${100 / scale}%` }}>
          {children}
        </div>
      </div>
      {/* Home indicator */}
      <div style={{ height: 16 * scale, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 64 * scale, height: 3 * scale, background: '#e5e7eb', borderRadius: 99 }} />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function HowItWorksCarousel() {
  const [active, setActive]   = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const goTo = useCallback((i: number) => {
    activeRef.current = i;
    setActive(i);
    setAnimKey(k => k + 1);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      goTo((activeRef.current + 1) % STEPS.length);
    }, STEP_DURATION);
  }, [goTo]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const Screen = SCREENS[active];

  if (isDesktop === null) {
    return <div style={{ background: '#f8fafc', minHeight: 560 }} />;
  }

  return (
    <section className="relative overflow-hidden select-none bg-slate-50">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'rgba(79,70,229,0.07)' }} />
      </div>

      {/* ── Mobile: original carousel ── */}
      {!isDesktop && (
        <div onClick={() => { goTo((activeRef.current + 1) % STEPS.length); startTimer(); }}>
          {/* Section heading — mobile only */}
          <div className="max-w-sm mx-auto px-5 pt-8 pb-2">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1.5 text-primary-500">
              Step by step
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 leading-none">
              How it works
            </h2>
          </div>
          {/* Progress bars */}
          <div className="flex gap-2 pt-5 pb-0 max-w-xs mx-auto">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); goTo(i); startTimer(); }}
                className="flex-1 h-[3px] rounded-full overflow-hidden"
                style={{ background: 'rgba(0,0,0,0.12)' }}
                aria-label={`Step ${i + 1}`}
              >
                {i < active && <div className="h-full w-full rounded-full" style={{ background: '#4f46e5' }} />}
                {i === active && (
                  <div
                    key={animKey}
                    className="h-full rounded-full"
                    style={{ width: 0, background: '#4f46e5', animation: `progressFill ${STEP_DURATION}ms linear forwards` }}
                  />
                )}
              </button>
            ))}
          </div>
          {/* Phone */}
          <div className="flex justify-center pt-5 pb-6 px-6">
            <PhoneFrame scale={1}><Screen /></PhoneFrame>
          </div>
        </div>
      )}

      {/* ── Desktop: 3-card grid ── */}
      {isDesktop && (
        <div className="max-w-6xl mx-auto px-8 py-14">
          {/* Heading */}
          <div className="mb-10">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1.5 text-primary-500">
              Step by step
            </p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 leading-none">
              How it works
            </h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-3 gap-6">
            {STEPS.map((step, i) => {
              const StepScreen = SCREENS[i];
              const isActive = i === active;
              return (
                <button
                  key={i}
                  onClick={() => { goTo(i); startTimer(); }}
                  className="text-left rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none"
                  style={{
                    background: '#fff',
                    border: isActive ? '1.5px solid #4f46e5' : '1.5px solid #e5e7eb',
                    boxShadow: isActive ? '0 8px 32px rgba(79,70,229,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="flex justify-center pt-8 pb-6 px-6" style={{ background: isActive ? '#f5f3ff' : '#f8fafc' }}>
                    <PhoneFrame scale={0.75}><StepScreen /></PhoneFrame>
                  </div>
                  <div className="px-6 pb-6">
                    <p className="text-[28px] font-black mb-3 tabular-nums" style={{ color: isActive ? '#4f46e5' : '#d1d5db' }}>
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <p className="text-[15px] font-black text-gray-900 leading-tight mb-1.5">{step.title}</p>
                    <p className="text-[13px] leading-snug text-gray-500">{step.subtitle}</p>
                    {isActive && (
                      <div className="mt-4 h-[3px] w-16 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
                        <div
                          key={animKey}
                          className="h-full rounded-full"
                          style={{ width: 0, background: '#4f46e5', animation: `progressFill ${STEP_DURATION}ms linear forwards` }}
                        />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
