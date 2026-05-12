'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export function ConfettiEffect() {
  useEffect(() => {
    const end = Date.now() + 1500;
    const colors = ['#3D5AFE', '#00C853', '#FFD600', '#FF6D00', '#E040FB'];

    let last = 0;
    (function frame(ts: number) {
      if (ts - last > 80) {
        confetti({ particleCount: 2, angle: 60, spread: 50, origin: { x: 0 }, colors });
        confetti({ particleCount: 2, angle: 120, spread: 50, origin: { x: 1 }, colors });
        last = ts;
      }
      if (Date.now() < end) requestAnimationFrame(frame);
    })(0);
  }, []);

  return null;
}
