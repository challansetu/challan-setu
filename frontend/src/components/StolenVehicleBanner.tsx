import Link from 'next/link';
import { ArrowRight, ShieldAlert } from 'lucide-react';

export function StolenVehicleBanner() {
  return (
    <section className="py-10 bg-white">
      <div className="container-app">
        <div className="relative rounded-2xl overflow-hidden bg-gray-950 px-8 py-10 sm:px-12 sm:py-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">

          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          {/* Icon */}
          <div className="relative flex-shrink-0 w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-red-400" />
          </div>

          {/* Text */}
          <div className="relative flex-1 min-w-0">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary-400 mb-1">New Service</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-1">
              Did your vehicle get stolen?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
              We handle everything — FIR follow-up, Superdari application, court filing, and vehicle release. You just share the documents.
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/recover-stolen-vehicle"
            className="relative flex-shrink-0 inline-flex items-center gap-2 bg-white text-gray-900 font-bold text-sm px-5 py-3 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Start Recovery
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>
      </div>
    </section>
  );
}
