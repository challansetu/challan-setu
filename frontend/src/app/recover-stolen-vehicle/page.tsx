import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RecoveryForm } from './RecoveryForm';
import { CheckCircle2, FileText, Scale, Car, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Recover Your Stolen Vehicle | ChallanSetu',
  description: 'We handle your stolen vehicle recovery end-to-end — FIR follow-up, Superdari application, court filing, and vehicle release. Share documents on WhatsApp.',
};

const steps = [
  { icon: <FileText className="w-5 h-5" />, title: 'Share your documents', desc: 'RC, FIR copy, insurance, and ID — all via WhatsApp chat.' },
  { icon: <Scale className="w-5 h-5" />, title: 'We file the Superdari application', desc: 'Our legal team prepares and files it in the Magistrate Court.' },
  { icon: <CheckCircle2 className="w-5 h-5" />, title: 'Court order obtained', desc: 'We attend the hearing and get the release order on your behalf.' },
  { icon: <Car className="w-5 h-5" />, title: 'Vehicle released to you', desc: 'You get your vehicle back — usually within 7–15 days.' },
];

export default function RecoverStolenVehiclePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* ── Same sticky hero + content sheet pattern as homepage ── */}
        <div className="relative bg-gradient-hero">

          {/* Hero — sticky on mobile */}
          <section className="sticky top-16 z-0 sm:relative sm:top-auto sm:z-auto overflow-hidden bg-gradient-hero text-white">
            <div className="absolute inset-0 pattern-dots opacity-40" />
            <div className="absolute top-0 right-0 w-[200px] sm:w-[500px] h-[200px] sm:h-[500px] bg-primary-400/10 rounded-full blur-3xl -translate-y-1/2 sm:translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[160px] sm:w-[400px] h-[160px] sm:h-[400px] bg-red-400/10 rounded-full blur-3xl translate-y-1/2 sm:-translate-x-1/4" />

            <div className="container-app relative">
              <div className="pt-10 pb-20 lg:pt-16 lg:pb-24 flex flex-col items-center justify-center gap-4">
                <div className="text-center w-full max-w-2xl mx-auto">

                  <h1 className="mb-4 tracking-tight">
                    <span className="block text-2xl sm:text-3xl font-medium text-white mb-1 leading-snug">
                      Vehicle stolen & recovered by police?
                    </span>
                    <span className="block text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.15] pb-1">
                      <span className="block bg-clip-text text-transparent bg-gradient-to-r from-accent-300 via-emerald-300 to-accent-200">
                        We'll Get It
                      </span>
                      <span className="block bg-clip-text text-transparent bg-gradient-to-r from-accent-300 via-emerald-300 to-accent-200">
                        Back. Legally.
                      </span>
                    </span>
                  </h1>

                  {/* Form */}
                  <RecoveryForm hero />
                </div>
              </div>
            </div>
          </section>

          {/* ── Content sheet ── */}
          <div className="relative z-10 bg-white rounded-t-2xl sm:rounded-none -mt-8 sm:mt-0">

            {/* How it works */}
            <section className="py-10 bg-white">
              <div className="container-app">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">How it works</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {steps.map((step, i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500">
                        {step.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
                        <p className="text-gray-500 text-sm mt-1 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trust note */}
                <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-100 max-w-xl">
                  <p className="text-sm text-amber-800 font-medium">⚖️ Handled by verified legal professionals. Typically takes 7–15 working days.</p>
                </div>
              </div>
            </section>

            <Footer />
          </div>
        </div>

      </main>
    </>
  );
}
