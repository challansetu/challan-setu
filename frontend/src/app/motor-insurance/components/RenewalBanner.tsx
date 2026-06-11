'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { RENEWAL_BANNER_TAGS, BRAND_BLUE } from '../data';

const CAR_URL         = 'https://ci.policybazaar.com/v1?utm_source=ChallanSetu';
const COMMERCIAL_URL  = 'https://commercial.policybazaar.com/?utm_source=ChallanSetu&utm_campaign=motor_insurance_page&utm_medium=banner';
const GENERAL_URL     = 'https://www.policybazaar.com/motor-insurance/?utm_source=ChallanSetu';

const TOTAL = 4;
const SLIDE_MS = 4000;

const IMAGE_SLIDES = [
  { src: '/images/pb-banner-car.jpg',          alt: 'Car insurance expired – Renew now',           href: CAR_URL },
  { src: '/images/pb-banner-commercial1.jpg',  alt: 'Renew commercial vehicle insurance today',    href: COMMERCIAL_URL },
  { src: '/images/pb-banner-commercial2.jpg',  alt: 'Compare & save on commercial vehicle',        href: COMMERCIAL_URL },
];

export function RenewalBanner() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive((p) => (p + 1) % TOTAL), SLIDE_MS);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (i: number) => { setActive(i); startTimer(); };

  return (
    <section className="pt-8 bg-white">
      <div className="container-app max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl">

          {/* ── Image slides 0-2 ─────────────────────────────────────── */}
          {IMAGE_SLIDES.map((slide, i) => (
            <Link
              key={slide.src}
              href={slide.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block transition-all duration-500 ${active === i ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
            >
              <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: '16/5' }}>
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  unoptimized
                  priority={i === 0}
                />
              </div>
            </Link>
          ))}

          {/* ── Slide 3 — General renewal HTML card ──────────────────── */}
          <Link
            href={GENERAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`block rounded-2xl transition-all duration-500 ${active === 3 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
            style={{ background: '#f0f6ff' }}
          >
            <div className="px-6 py-5 sm:px-10 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl" style={{ background: '#f0f6ff' }}>
              <div>
                <Image src="/icons/policybazaar.png" alt="PolicyBazaar" width={160} height={32} className="mb-2" />
                <h3 className="text-base font-bold text-gray-900 mb-1.5">Renew Your Insurance Instantly</h3>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {RENEWAL_BANNER_TAGS.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-xs text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs text-white" style={{ background: BRAND_BLUE }}>
                  Get Free Quotes →
                </span>
              </div>
            </div>
          </Link>

        </div>

        {/* ── Dots ─────────────────────────────────────────────────────── */}
        <div className="flex justify-center gap-2 mt-3">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? 'w-5 bg-amber-500' : 'w-1.5 bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
