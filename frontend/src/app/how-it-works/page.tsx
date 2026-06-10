import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, serviceSchema, breadcrumbSchema, howToSchema, faqSchema } from '@/components/seo/JsonLd';
import {
  Search,
  CheckCircle2,
  Shield,
  Clock,
  FileText,
  ArrowRight,
  Contact,
} from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'How Lok Adalat Challan Settlement Works | ChallanSetu' },
  description:
    'See how ChallanSetu settles your challan in 3 steps via Lok Adalat. No court visits, no stress — just a legal fine reduction up to 50%.',
  alternates: { canonical: '/how-it-works' },
  openGraph: {
    title: 'How Lok Adalat Challan Settlement Works | ChallanSetu',
    description:
      'See how ChallanSetu settles your challan in 3 steps via Lok Adalat. No court visits, no stress — just a legal fine reduction up to 50%.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const BRAND_DARK = '#1c1c24';
const BRAND_YELLOW = '#f5c842';

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Enter Your Vehicle Number',
    description:
      'Type your vehicle registration number (e.g. DL7SBY5194) to begin a challan discount eligibility request.',
    detail: 'No login required to start.',
  },
  {
    number: '02',
    icon: Contact,
    title: 'Share Your Details',
    description:
      'Add your full name, mobile number, and consent in the secure lead form so our team can review your challan and find the best available option.',
    detail: 'No OTP, UPI PIN, or bank details are required.',
  },
  {
    number: '03',
    icon: CheckCircle2,
    title: 'Receive the Next Step',
    description:
      'Our team verifies your challan details and contacts you with the best available settlement option. If eligible, you can proceed with payment securely through Razorpay.',
    detail: 'No payment is required at the request stage.',
  },
];

const FEATURES = [
  {
    icon: Shield,
    title: 'No Payment Upfront',
    description:
      'You can start your request without making a payment. The available option is shared before any payment step.',
  },
  {
    icon: Shield,
    title: 'Secure & Minimal Data',
    description:
      "All payments go through Razorpay's PCI-DSS compliant gateway. Challan settlement is processed through official government channels. We never store your card or bank details.",
  },
  {
    icon: Clock,
    title: 'Clear Status Flow',
    description:
      'You get a clear request confirmation page with request ID, status, and the next expected update.',
  },
  {
    icon: FileText,
    title: 'Court & Settlement Support',
    description:
      'Eligible challans may qualify for settlement support depending on challan type, city, and current case status.',
  },
  {
    icon: FileText,
    title: 'Optional Screenshot Sharing',
    description:
      'If you already have a challan screenshot, PDF, or notice, you can share it to help speed up the review.',
  },
  {
    icon: Shield,
    title: 'Built for Delhi NCR',
    description:
      'ChallanSetu currently supports Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad.',
  },
];

const FAQS = [
  {
    q: 'What happens after I submit my vehicle number?',
    a: 'After you submit your vehicle number and details, your request is recorded and the next step is shared after review.',
  },
  {
    q: 'Do I need to create an account to use ChallanSetu?',
    a: 'No. The current MVP flow only asks for your vehicle number, name, mobile number, and consent.',
  },
  {
    q: 'What cities does ChallanSetu currently support?',
    a: 'We currently support Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad.',
  },
  {
    q: 'Do I need to pay before checking eligibility?',
    a: 'No. No payment is required at the request stage.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Traffic Challan Eligibility & Settlement Support',
          description:
            'Submit your vehicle number to check traffic challan discount eligibility and get settlement support for eligible cases in Delhi NCR.',
          url: '/how-it-works',
        })}
      />
      <JsonLd
        data={howToSchema({
          name: 'How to Settle Your Traffic Challan via Lok Adalat with ChallanSetu',
          description:
            'A 3-step guide to getting your traffic challan discount eligibility checked and settled through ChallanSetu in Delhi NCR.',
          steps: STEPS.map((s) => ({ name: s.title, text: s.description })),
        })}
      />
      <JsonLd data={faqSchema(FAQS.map((f) => ({ q: f.q, a: f.a })))} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'How It Works', url: '/how-it-works' },
        ])}
      />
      <Navbar />
      <main className="flex-1 bg-surface-50">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden text-white py-16 sm:py-20"
          style={{ background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)` }}
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-yellow-400/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

          <div className="container-app text-center relative">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight" style={{ color: BRAND_YELLOW }}>
              How ChallanSetu Settles Your Challan via Lok Adalat
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
              Start with your vehicle number, submit your request securely, and receive the next step for eligible challans.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg"
              style={{ background: BRAND_YELLOW, color: BRAND_DARK }}
            >
              Submit Your Request
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ── Steps ─────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">3 Simple Steps</h2>
              <p className="text-gray-500 max-w-lg mx-auto">From vehicle number to request submission, the flow is simple, secure, and mobile-first.</p>
            </div>

            <div className="space-y-8 max-w-3xl mx-auto">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex gap-5 sm:gap-7">
                    <div className="flex-shrink-0">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(245,200,66,0.12)' }}
                      >
                        <Icon className="w-7 h-7" style={{ color: BRAND_YELLOW }} />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: BRAND_YELLOW }}>
                        Step {step.number}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">{step.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 rounded-lg px-3 py-2 w-fit border border-gray-100 bg-gray-50">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: BRAND_YELLOW }} />
                        {step.detail}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Why ChallanSetu?</h2>
              <p className="text-gray-500 max-w-lg mx-auto">Every detail is designed to make challan support requests feel clear, trustworthy, and easy to start.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(245,200,66,0.12)' }}>
                      <Icon className="w-5 h-5" style={{ color: BRAND_YELLOW }} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20">
          <div className="container-app max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Questions</h2>
              <p className="text-gray-500 text-sm">
                More questions? See our{' '}
                <Link href="/faq" className="text-amber-600 hover:underline">
                  full FAQ page
                </Link>.
              </p>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{faq.q}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section
          className="py-12 relative overflow-hidden"
          style={{ background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)` }}
        >
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="container-app text-center relative">
            <h2 className="text-2xl font-bold mb-3" style={{ color: BRAND_YELLOW }}>
              Ready to clear your challans?
            </h2>
            <p className="text-white/60 mb-6">Enter your vehicle number to start your eligibility request securely.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg"
              style={{ background: BRAND_YELLOW, color: BRAND_DARK }}
            >
              Submit Your Request
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
