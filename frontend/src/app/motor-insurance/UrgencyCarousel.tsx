'use client';

import { useEffect, useRef, useState } from 'react';
import { URGENCY_FACTS } from './data';

export function UrgencyCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isPausedRef = useRef(false);

  // Auto-advance every 2.8 seconds
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      if (isPausedRef.current) return;
      const next = (activeIndex + 1) % URGENCY_FACTS.length;
      const cardWidth = el.scrollWidth / URGENCY_FACTS.length;
      el.scrollTo({ left: cardWidth * next, behavior: 'smooth' });
    }, 2800);

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Sync active dot with scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const cardWidth = el.scrollWidth / URGENCY_FACTS.length;
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(idx);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="sm:hidden -mx-4 px-4">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
        onTouchStart={() => { isPausedRef.current = true; }}
        onTouchEnd={() => { isPausedRef.current = false; }}
      >
        {URGENCY_FACTS.map((f) => (
          <div
            key={f.value}
            className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-4 shadow-sm shrink-0"
            style={{ scrollSnapAlign: 'start', width: 'calc(85vw - 2rem)' }}
          >
            <div className="flex items-center justify-between">
              <f.icon className="w-6 h-6" style={{ color: f.iconColor }} />
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ color: f.tagColor }}>
                {f.tag}
              </span>
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-base mb-1.5">{f.value}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll dots */}
      <div className="flex justify-center gap-1.5 mt-1">
        {URGENCY_FACTS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-4 bg-amber-400' : 'w-1.5 bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
