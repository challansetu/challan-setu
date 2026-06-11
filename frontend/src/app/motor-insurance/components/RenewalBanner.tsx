'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const CAR_URL        = 'https://ci.policybazaar.com/v1?utm_source=ChallanSetu';
const COMMERCIAL_URL = 'https://commercial.policybazaar.com/?utm_source=ChallanSetu&utm_campaign=&utm_medium';

const SLIDES = [
  { src: '/images/pb-banner-cv1.webp', alt: 'Renew your commercial vehicle insurance today',  href: CAR_URL },
  { src: '/images/pb-banner-cv2.webp', alt: 'Compare & save up to 85% on commercial vehicle', href: COMMERCIAL_URL },
];

const SLIDE_MS = 4000;

export function RenewalBanner() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive((p) => (p + 1) % SLIDES.length), SLIDE_MS);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (i: number) => { setActive(i); startTimer(); };

  return (
    <section className="pt-4 pb-8 bg-white">
      <div className="container-app max-w-5xl">

        {/* ── Desktop: both banners side by side ───────────────────── */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-4">
          {SLIDES.map((slide) => (
            <Link
              key={slide.src}
              href={slide.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden"
            >
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-fill"
                  unoptimized
                />
              </div>
            </Link>
          ))}
        </div>

        {/* ── Mobile: carousel ─────────────────────────────────────── */}
        <div className="sm:hidden">
          <div className="relative overflow-hidden rounded-2xl">
            {SLIDES.map((slide, i) => (
              <Link
                key={slide.src}
                href={slide.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`block transition-all duration-500 ${active === i ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
              >
                <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: '16/9' }}>
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-fill"
                    unoptimized
                    priority={i === 0}
                  />
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-3">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? 'w-5 bg-amber-500' : 'w-1.5 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
