import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PaymentForm } from './PaymentForm';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';

export const metadata: Metadata = {
  title: 'Make a Payment',
  description: 'Securely pay ChallanSetu for your service or consultation via Razorpay (UPI, cards, net banking).',
  alternates: { canonical: `${SITE_URL}/payments` },
  // Transactional page — keep it out of the search index.
  robots: { index: false, follow: false },
};

export default function PaymentsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="relative" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>
          <section
            className="relative overflow-hidden text-white"
            style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)', boxShadow: 'inset 0 -40px 80px rgba(0,0,0,0.3)' }}
          >
            <div className="absolute inset-0 pattern-dots opacity-10" />
            <div className="absolute top-0 right-0 w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] bg-amber-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
            <div className="container-app relative">
              <div className="pt-14 pb-12 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.15] tracking-tight" style={{ color: '#f5c842' }}>
                  Make a Payment
                </h1>
                <p className="text-base text-gray-300 mt-5 leading-relaxed">
                  Pay securely via UPI, card, or net banking. Enter the amount confirmed by our team and complete your payment in seconds.
                </p>
              </div>
            </div>
          </section>

          <div className="relative z-10 bg-white rounded-t-3xl -mt-8">
            <div className="container-app max-w-xl py-10">
              <PaymentForm />
            </div>
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
