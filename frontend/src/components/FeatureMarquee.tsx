'use client';

import { ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FeatureItem {
  title: string;
  desc: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}

interface FeatureMarqueeProps {
  features: FeatureItem[];
  /** px/s speed — default 40 */
  speed?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FeatureMarquee({ features, speed = 40 }: FeatureMarqueeProps) {
  // Duplicate list so the loop is seamless
  const items = [...features, ...features];

  // Duration derived from speed: one "lap" = features.length cards × 300px each
  const duration = (features.length * 300) / speed;

  return (
    <div
      className="relative overflow-hidden w-full"
      aria-label="Feature highlights"
    >
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, white 0%, transparent 100%)',
        }}
      />
      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to left, white 0%, transparent 100%)',
        }}
      />

      {/* Scrolling track */}
      <div
        className="flex gap-4 w-max feature-marquee-track"
        style={
          {
            '--marquee-duration': `${duration}s`,
          } as React.CSSProperties
        }
      >
        {items.map((item, i) => (
          <FeatureCard key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function FeatureCard({ item }: { item: FeatureItem }) {
  return (
    <div
      className="
        flex items-start gap-4 p-5
        w-[280px] sm:w-[300px] flex-shrink-0
        rounded-2xl border border-gray-100
        bg-white
        shadow-[0_1px_6px_rgba(0,0,0,0.06)]
        hover:shadow-[0_4px_16px_rgba(0,0,0,0.09)]
        transition-shadow duration-300
      "
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0`}
      >
        {item.icon}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">
          {item.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
      </div>
    </div>
  );
}
