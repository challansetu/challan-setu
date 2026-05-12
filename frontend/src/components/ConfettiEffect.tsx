'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export function ConfettiEffect() {
  useEffect(() => {
    const end = Date.now() + 2500;
    const colors = ['#3D5AFE', '#00C853', '#FFD600', '#FF6D00', '#E040FB'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  return null;
}
