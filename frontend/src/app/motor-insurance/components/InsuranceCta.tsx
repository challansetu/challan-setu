import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { BRAND_DARK, BRAND_YELLOW } from '../data';

const OTHER_SERVICES = [
  { href: '/', emoji: '🚦', label: 'Check Traffic Challans' },
  { href: '/recover-stolen-vehicle', emoji: '🚗', label: 'Recover Stolen Vehicle' },
];

export function InsuranceCta() {
  return (
    <section
      className="py-8 text-white relative overflow-hidden"
      style={{ background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)` }}
    >
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-orange-400/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="container-app text-center relative">
        <ShieldCheck className="w-10 h-10 mx-auto mb-4" style={{ color: BRAND_YELLOW }} />
        <h2 className="text-2xl sm:text-3xl font-black mb-3 text-white">
          Check Your Insurance Status Now
        </h2>
        <p className="text-sm text-white/60 mb-6 max-w-md mx-auto">
          Free, instant, and covers all vehicle types registered in India. No login required.
        </p>
        <Link
          href="#insurance-hero"
          className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: BRAND_YELLOW, color: BRAND_DARK }}
        >
          <ShieldCheck className="w-4 h-4" />
          Check Insurance Status
        </Link>

        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-xs text-white/40 mb-1">Explore our other services</p>
          <div className="flex flex-wrap justify-center gap-3">
            {OTHER_SERVICES.map(({ href, emoji, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-200 text-white/80 hover:text-white text-xs font-medium"
              >
                <span className="text-base">{emoji}</span>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
