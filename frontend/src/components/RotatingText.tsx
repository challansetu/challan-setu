'use client';

import { useState, useEffect, useRef } from 'react';

interface RotatingTextProps {
  /** Array of phrases to cycle through. */
  texts: string[];
  /** How long each phrase is shown before the exit animation begins (ms). Default: 2500 */
  displayDuration?: number;
  /** Duration of the fade + slide transition (ms). Default: 350 */
  animDuration?: number;
  /** Extra Tailwind classes forwarded to the wrapping <span>. */
  className?: string;
}

/**
 * Cycles through `texts` with a fade-up/fade-down transition.
 * – Pauses on hover and resumes on mouse-leave.
 * – Respects `prefers-reduced-motion`: keeps the current text static when enabled.
 * – SSR-safe: renders texts[0] on the server so LCP / SEO are unaffected.
 */
export function RotatingText({
  texts,
  displayDuration = 2500,
  animDuration = 350,
  className = '',
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  // Use state for prefersReduced so the transition style re-renders correctly.
  const [prefersReduced, setPrefersReduced] = useState(false);
  // Refs allow the interval callback to read current values without needing
  // to be included in the dependency array (which would restart the timer).
  const pausedRef = useRef(false);
  const prefersReducedRef = useRef(false);
  const swapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect reduced-motion preference on the client only (window is unavailable on server).
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedRef.current = mq.matches;
    setPrefersReduced(mq.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      prefersReducedRef.current = event.matches;
      setPrefersReduced(event.matches);
    };

    mq.addEventListener('change', handleChange);

    return () => {
      mq.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (texts.length <= 1) return;

    // Total time per slot: display time + one transition out.
    // This keeps every phrase on screen for exactly `displayDuration` ms.
    const slotDuration = displayDuration + animDuration;

    const id = setInterval(() => {
      // Skip the transition tick while paused or if motion is reduced.
      if (pausedRef.current || prefersReducedRef.current) return;

      // Exit: fade out and slide up.
      setVisible(false);

      swapTimeoutRef.current = setTimeout(() => {
        // Swap text while invisible, then fade in (slide down into place).
        setIndex((i) => (i + 1) % texts.length);
        setVisible(true);
        swapTimeoutRef.current = null;
      }, animDuration);
    }, slotDuration);

    return () => {
      clearInterval(id);
      if (swapTimeoutRef.current) {
        clearTimeout(swapTimeoutRef.current);
        swapTimeoutRef.current = null;
      }
    };
  }, [texts.length, displayDuration, animDuration]);

  return (
    <span
      className={`inline-block will-change-[opacity,transform] ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(-10px)',
        // No transition when motion is reduced — text just swaps instantly.
        transition: prefersReduced
          ? 'none'
          : `opacity ${animDuration}ms ease-in-out, transform ${animDuration}ms ease-in-out`,
      }}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      // Screen readers announce each new phrase as it appears.
      aria-live="polite"
      aria-atomic="true"
    >
      {texts[index]}
    </span>
  );
}
