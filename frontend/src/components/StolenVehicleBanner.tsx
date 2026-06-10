import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function StolenVehicleBanner() {
  return (
    <section className="pt-0 pb-4 bg-white">
      <div className="container-app">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">Reclaiming the Stolen Vehicle</h2>
        <div
          className="relative rounded-2xl overflow-hidden flex flex-row items-stretch h-[200px] sm:h-[220px]"
          style={{ background: '#1c1c24' }}
        >
          {/* Left: text */}
          <div className="flex-1 px-6 py-6 flex flex-col justify-between z-10">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug mb-0.5">
                Police recovered<br />your vehicle?
              </h3>
              <p className="font-bold text-sm sm:text-base" style={{ color: '#f5c842' }}>
                We&apos;ll get it back. Legally.
              </p>
            </div>

            <Link
              href="/recover-stolen-vehicle"
              className="inline-flex items-center gap-1.5 font-bold text-xs px-4 py-2 rounded-lg transition-all hover:-translate-y-0.5 w-fit"
              style={{ background: '#f5c842', color: '#1c1c24' }}
            >
              Start Recovery
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Right: image with fade */}
          <div className="absolute right-0 top-0 bottom-0 w-[60%]">
            <Image
              src="/images/vehicle-recovery-banner.png"
              alt="Vehicle recovery"
              fill
              className="object-cover object-center"
              unoptimized
            />
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#1c1c24] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
