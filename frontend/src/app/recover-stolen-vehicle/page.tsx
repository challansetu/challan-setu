import type { Metadata } from 'next';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RecoveryForm } from './RecoveryForm';
import { DocumentsRequired } from '@/components/DocumentsRequired';
import { WhatWeHandle } from '@/components/WhatWeHandle';
import { RecoveryFaqSection } from '@/components/RecoveryFaqSection';
import { JsonLd, faqSchema, breadcrumbSchema, serviceSchema } from '@/components/seo/JsonLd';
import { RECOVERY_FAQS } from '@/data/recovery-faqs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';
const PAGE_URL = '/recover-stolen-vehicle';
const PAGE_TITLE = 'Recover Stolen Vehicle in India | Superdari Application | ChallanSetu';
const PAGE_DESC = 'Vehicle stolen and recovered by police? ChallanSetu handles your Superdari application, FIR follow-up, court filing and vehicle release end-to-end. Get started on WhatsApp.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,

  // ── Canonical (fix: was pointing to homepage) ──────────────────────────────
  alternates: {
    canonical: `${SITE_URL}${PAGE_URL}`,
  },

  // ── Open Graph (fix: was using homepage OG tags) ───────────────────────────
  openGraph: {
    title: 'Recover Your Stolen Vehicle Legally | ChallanSetu',
    description: PAGE_DESC,
    url: `${SITE_URL}${PAGE_URL}`,
    siteName: 'ChallanSetu',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/opengraph-image?a6e433b546d61721`,
        width: 1200,
        height: 630,
        alt: 'ChallanSetu — Recover Stolen Vehicle via Superdari',
      },
    ],
  },

  // ── Twitter Card ───────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'Recover Your Stolen Vehicle Legally | ChallanSetu',
    description: PAGE_DESC,
  },

  // ── Robots ─────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
  },
};

const steps = [
  { img: '/images/recovery-step-1-documents.png', title: 'Share your documents' },
  { img: '/images/recovery-step-2-application.png', title: 'We file Superdari application' },
  { img: '/images/recovery-step-4-approved.png', title: 'Court order obtained' },
  { img: '/images/recovery-step-5-keys.png', title: 'Vehicle released to you' },
];

export default function RecoverStolenVehiclePage() {
  return (
    <>
      {/* FAQ Schema */}
      <JsonLd data={faqSchema(RECOVERY_FAQS)} />

      {/* Service Schema */}
      <JsonLd data={serviceSchema({
        name: 'Stolen Vehicle Recovery — Superdari Application',
        description: PAGE_DESC,
        url: PAGE_URL,
      })} />

      {/* Breadcrumb Schema */}
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Recover Stolen Vehicle', url: PAGE_URL },
      ])} />

      <Navbar />
      <main className="flex-1">

        <div className="relative bg-gradient-hero">

          {/* Hero */}
          <section className="sticky top-16 z-0 sm:relative sm:top-auto sm:z-auto overflow-hidden bg-gradient-hero text-white">
            <div className="absolute inset-0 pattern-dots opacity-40" />
            <div className="absolute top-0 right-0 w-[200px] sm:w-[500px] h-[200px] sm:h-[500px] bg-primary-400/10 rounded-full blur-3xl -translate-y-1/2 sm:translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[160px] sm:w-[400px] h-[160px] sm:h-[400px] bg-red-400/10 rounded-full blur-3xl translate-y-1/2 sm:-translate-x-1/4" />

            <div className="container-app relative">
              <div className="pt-10 pb-20 lg:pt-16 lg:pb-24 flex flex-col items-center justify-center gap-4">
                <div className="text-center w-full max-w-2xl mx-auto">
                  <h1 className="mb-4 tracking-tight">
                    <span className="block text-2xl sm:text-3xl font-medium text-white mb-1 leading-snug">
                      Vehicle Stolen &amp; Recovered by Police?
                    </span>
                    <span className="block text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.2] pb-3">
                      <span className="block bg-clip-text text-transparent bg-gradient-to-r from-accent-300 via-emerald-300 to-accent-200">
                        We&apos;ll Get It Back.
                      </span>
                      <span className="block bg-clip-text text-transparent bg-gradient-to-r from-accent-300 via-emerald-300 to-accent-200 pb-1">
                        Legally.
                      </span>
                    </span>
                  </h1>
                  <RecoveryForm hero />
                </div>
              </div>
            </div>
          </section>

          {/* Content sheet */}
          <div className="relative z-10 bg-white rounded-t-2xl sm:rounded-none -mt-8 sm:mt-0">

            {/* How it works */}
            <section className="py-8 bg-white">
              <div className="container-app">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="w-10 h-0.5 rounded-full bg-primary-300" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">How it Works</h2>
                  <span className="w-10 h-0.5 rounded-full bg-primary-300" />
                </div>
                <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto">
                  {steps.map((step, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="relative">
                        <div className="w-full aspect-square rounded-xl bg-[#c9b8f5] relative overflow-hidden">
                          <Image
                            src={step.img}
                            alt={step.title}
                            fill
                            className="object-cover object-center scale-[1.15]"
                            unoptimized
                          />
                        </div>
                        <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                          {i + 1}
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 text-xs leading-snug text-center">{step.title}</p>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            <WhatWeHandle />

            <DocumentsRequired />

            <RecoveryFaqSection />

            <Footer />
          </div>
        </div>

      </main>
    </>
  );
}
