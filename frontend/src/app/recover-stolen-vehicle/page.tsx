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
  // absolute: PAGE_TITLE already ends in "| ChallanSetu"; absolute stops the
  // layout template from appending it again (avoids double-branding).
  title: { absolute: PAGE_TITLE },
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

        <div className="relative" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>

          {/* Hero */}
          <section className="overflow-hidden text-white py-14 sm:py-20" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-yellow-400/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

            <div className="container-app relative">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-center w-full max-w-2xl mx-auto">
                  <h1 className="mb-6 tracking-tight">
                    <span className="block text-2xl sm:text-3xl font-medium text-white/70 mb-2 leading-snug">
                      Vehicle Stolen &amp; Recovered by Police?
                    </span>
                    <span className="block text-4xl sm:text-5xl md:text-6xl font-black leading-[1.2] pb-3" style={{ color: '#f5c842' }}>
                      We&apos;ll Get It Back. Legally.
                    </span>
                  </h1>
                  <RecoveryForm hero />
                </div>
              </div>
            </div>
          </section>

          {/* Content sheet */}
          <div className="relative z-10 bg-white rounded-t-2xl sm:rounded-none">

            {/* How it works */}
            <section className="py-8 bg-white">
              <div className="container-app">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="w-10 h-0.5 rounded-full bg-amber-300" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">How it Works</h2>
                  <span className="w-10 h-0.5 rounded-full bg-amber-300" />
                </div>
                <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto">
                  {steps.map((step, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="relative">
                        <div className="w-full aspect-square rounded-xl relative overflow-hidden" style={{ background: 'rgba(245,200,66,0.15)' }}>
                          <Image
                            src={step.img}
                            alt={step.title}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover object-center scale-[1.15]"
                          />
                        </div>
                        <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shadow" style={{ background: '#1c1c24', color: '#f5c842' }}>
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
