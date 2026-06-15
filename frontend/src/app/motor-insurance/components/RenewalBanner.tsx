'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { trackBannerClick } from '@/lib/analytics';

const CAR_URL         = 'https://ci.policybazaar.com/v1?utm_source=ChallanSetu';
const COMMERCIAL_URL  = 'https://commercial.policybazaar.com/?utm_source=ChallanSetu&utm_campaign=&utm_medium';
const TWO_WHEELER_URL = 'https://twowheeler.policybazaar.com/?utm_source=ChallanSetu';

const SLIDES = [
  { src: '/images/pb-banner-car.jpg',  alt: 'Renew your car insurance policy today',           href: CAR_URL,         name: 'insurance_car' },
  { src: '/images/pb-banner-cv2.webp', alt: 'Compare & save up to 85% on commercial vehicle',  href: COMMERCIAL_URL,  name: 'insurance_commercial' },
  { src: '/images/pb-banner-2w.jpg',   alt: 'Buy two-wheeler insurance starting ₹1.3/day',     href: TWO_WHEELER_URL, name: 'insurance_two_wheeler' },
];

const SLIDE_MS = 4000;

export function RenewalBanner({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);

  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * i, behavior: 'smooth' });
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      scrollTo((active + 1) % SLIDES.length);
    }, SLIDE_MS);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync dot with scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setActive(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className={className ?? 'pt-4 pb-8 bg-white'}>
      <div className="container-app max-w-5xl">

        {/* ── Desktop: both banners side by side ───────────────────── */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-4">
          {SLIDES.map((slide) => (
            <Link
              key={slide.src}
              href={slide.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBannerClick(slide.name)}
              className="block rounded-2xl overflow-hidden"
            >
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <Image src={slide.src} alt={slide.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-fill" />
              </div>
            </Link>
          ))}
        </div>

        {/* ── Mobile: swipeable scroll-snap carousel ───────────────── */}
        <div className="sm:hidden">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto rounded-2xl"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
            onTouchStart={() => { isPausedRef.current = true; }}
            onTouchEnd={() => { isPausedRef.current = false; }}
          >
            {SLIDES.map((slide) => (
              <Link
                key={slide.src}
                href={slide.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBannerClick(slide.name)}
                className="shrink-0 w-full block"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <Image src={slide.src} alt={slide.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-fill" priority />
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? 'w-5 bg-amber-500' : 'w-1.5 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
