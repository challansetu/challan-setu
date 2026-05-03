'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const TESTIMONIALS = [
  {
    name: 'Yash Gupta',
    location: 'Delhi',
    rating: 5,
    review: 'The request flow was simple and clear. I submitted my vehicle number and got the next step without any confusion.',
    photo: '/testimonials/t1.webp',
  },
  {
    name: 'Rahul Sharma',
    location: 'Noida',
    rating: 5,
    review: 'I liked that no payment was required upfront. The process felt straightforward and easy to trust.',
    photo: '/testimonials/t2.webp',
  },
  {
    name: 'Vikas Joshi',
    location: 'Gurgaon',
    rating: 5,
    review: 'The mobile flow was smooth and fast. I could submit my request in a couple of minutes and continue on WhatsApp.',
    photo: '/testimonials/t3.webp',
  },
  {
    name: 'Deepak Singh',
    location: 'Ghaziabad',
    rating: 5,
    review: 'Helpful for understanding the next step before paying anything. The request page and status felt clear and professional.',
    photo: '/testimonials/t4.webp',
  },
];

// Mobile card: 72vw wide, 12px gap, centered with 14vw padding on each side
const CARD_VW    = 0.72;
const GAP_PX     = 12;
const PADDING_VW = 0.14;
const AUTO_INTERVAL = 3500;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill={i < rating ? '#FBBF24' : 'rgba(255,255,255,0.25)'}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsCarousel() {
  const trackRef  = useRef<HTMLDivElement>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  const scrollToIndex = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const cardPx = CARD_VW * window.innerWidth + GAP_PX;
    el.scrollTo({ left: i * cardPx, behavior: 'smooth' });
  }, []);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const cardPx = CARD_VW * window.innerWidth + GAP_PX;
    const idx = Math.max(0, Math.min(Math.round(el.scrollLeft / cardPx), TESTIMONIALS.length - 1));
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      const next = (activeRef.current + 1) % TESTIMONIALS.length;
      scrollToIndex(next);
    }, AUTO_INTERVAL);
  }, [scrollToIndex]);

  const onTouchStart = useCallback(() => { pausedRef.current = true; }, []);
  const onTouchEnd   = useCallback(() => {
    pausedRef.current = false;
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll',     onScroll,     { passive: true });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });
    startTimer();
    return () => {
      el.removeEventListener('scroll',     onScroll);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend',   onTouchEnd);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onScroll, onTouchStart, onTouchEnd, startTimer]);

  const handleDotClick = (i: number) => {
    pausedRef.current = false;
    scrollToIndex(i);
    startTimer();
  };

  return (
    <section className="py-12 sm:py-20 bg-gray-950 overflow-hidden">
      <div className="container-app">

        {/* Heading */}
        <div className="mb-8 sm:mb-12 px-1">
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2 text-primary-400">
            Happy customers
          </p>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
            What our customers say
          </h2>
        </div>

        {/* ── Mobile carousel ── */}
        <div className="sm:hidden">
          <div
            ref={trackRef}
            className="flex overflow-x-auto snap-x snap-mandatory select-none"
            style={{
              gap: `${GAP_PX}px`,
              paddingLeft:  `${PADDING_VW * 100}vw`,
              paddingRight: `${PADDING_VW * 100}vw`,
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
            }}
          >
            {TESTIMONIALS.map((t, i) => {
              const isActive = active === i;
              return (
                <div
                  key={i}
                  className="snap-center flex-shrink-0 transition-all duration-300 ease-out"
                  style={{
                    width:     `${CARD_VW * 100}vw`,
                    opacity:   isActive ? 1 : 0.45,
                    transform: isActive ? 'scale(1)' : 'scale(0.94)',
                    transformOrigin: 'center top',
                  }}
                >
                  <TestimonialCard testimonial={t} />
                </div>
              );
            })}
          </div>

          {/* Dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                aria-label={`Review ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  active === i
                    ? 'w-5 h-[7px] bg-primary-400'
                    : 'w-[7px] h-[7px] bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Desktop grid ── */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>

      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof TESTIMONIALS[number] }) {
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
      {/* Photo */}
      <Image
        src={testimonial.photo}
        alt={testimonial.name}
        fill
        className="object-cover object-top"
        sizes="(max-width: 640px) 72vw, (max-width: 1024px) 50vw, 25vw"
      />

      {/* Dark gradient overlay — bottom 65% */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.15) 65%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <StarRating rating={testimonial.rating} />
        <p className="mt-2 text-base font-bold text-white leading-tight">
          {testimonial.name}
        </p>
        <p className="text-[11px] text-white/50 font-medium mb-2">{testimonial.location}</p>
        <p className="text-[13px] text-white/80 leading-relaxed line-clamp-3">
          {testimonial.review}
        </p>
      </div>
    </div>
  );
}
