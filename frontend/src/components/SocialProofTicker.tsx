'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { BadgeCheck } from 'lucide-react';
import {
  SOCIAL_PROOF_CYCLE_MS,
  SOCIAL_PROOF_TRANSITION_MS,
  SOCIAL_PROOF_MIN_MINUTES,
  SOCIAL_PROOF_MAX_MINUTES_RANGE,
  LOCALE,
} from '@/lib/constants';
import socialProofData from '@/data/social-proof.json';

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const fmt = (n: number) => new Intl.NumberFormat(LOCALE).format(n);

interface Msg {
  name: string;
  type: string;
  amount: number;
  mins: number;
}

function generate(): Msg {
  return {
    name: pick(socialProofData.names),
    type: pick(socialProofData.challanTypes),
    amount: pick(socialProofData.amounts),
    mins: Math.floor(Math.random() * SOCIAL_PROOF_MAX_MINUTES_RANGE) + SOCIAL_PROOF_MIN_MINUTES,
  };
}

/** Shared pill shell — live activity / payment strip */
function ProofPill({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        relative flex w-full max-w-md items-center gap-2.5 overflow-hidden
        rounded-full border border-emerald-100/80 bg-emerald-50/40
        px-3.5 py-2.5 pl-3 sm:gap-3 sm:px-5 sm:py-3 sm:pl-4
        shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-shadow duration-300
        ${className}
      `}
    >
      <div className="relative z-[1] flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">{children}</div>
    </div>
  );
}

// Static seed shown on SSR and before JS hydrates — no randomness
const SSR_MSG: Msg = {
  name: socialProofData.names[0],
  type: socialProofData.challanTypes[0],
  amount: socialProofData.amounts[4],
  mins: SOCIAL_PROOF_MIN_MINUTES + 3,
};

export function SocialProofTicker() {
  const [msg, setMsg] = useState<Msg>(SSR_MSG);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMsg(generate());
    setMounted(true);
  }, []);

  const cycle = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setMsg(generate());
      setVisible(true);
    }, SOCIAL_PROOF_TRANSITION_MS);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(cycle, SOCIAL_PROOF_CYCLE_MS);
    return () => clearInterval(id);
  }, [cycle, mounted]);

  return (
    <div className="flex w-full justify-center px-4">
      <ProofPill
        className={`
          transition-all duration-500 ease-out
          ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-[0.99]'}
        `}
      >
        {/* Live status dot */}
        <span className="relative flex h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.25)] sm:h-3 sm:w-3" />
        </span>

        <p className="min-w-0 flex-1 text-left text-[13px] leading-snug tracking-tight text-slate-600 sm:text-sm">
          <span className="font-semibold text-slate-900">{msg.name}</span>
          <span className="font-normal text-slate-500"> paid </span>
          <span className="font-bold tabular-nums text-emerald-700">₹{fmt(msg.amount)}</span>
          <span className="font-normal text-slate-500"> {msg.type}</span>
          <span className="mx-1.5 inline text-slate-300 sm:mx-2">·</span>
          <span className="whitespace-nowrap text-xs font-medium text-slate-400">{msg.mins}m ago</span>
        </p>

        <BadgeCheck
          className="h-[18px] w-[18px] flex-shrink-0 text-emerald-600 drop-shadow-[0_1px_1px_rgba(5,150,105,0.25)] sm:h-5 sm:w-5"
          strokeWidth={2}
          aria-hidden
        />
      </ProofPill>
    </div>
  );
}
