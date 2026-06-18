import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { InsuranceHeroForm } from '../motor-insurance/InsuranceHeroForm';
import { InsuranceFaqSection } from '../motor-insurance/InsuranceFaqSection';
import { RenewalBanner, HowItWorks, InsuranceCta } from '../motor-insurance/components';
import { BRAND_DARK } from '../motor-insurance/data';
import {
  JsonLd,
  faqSchema,
  breadcrumbSchema,
  serviceSchema,
  howToSchema,
  webPageSchema,
} from '@/components/seo/JsonLd';
import { CAR_FAQS } from './faqs';

// ── Page metadata ─────────────────────────────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';
const PAGE_URL = '/car-insurance';
// Brand suffix (" | ChallanSetu") is appended by the root layout title template.
const PAGE_TITLE = 'Check Car Insurance Status by Registration Number — Free';
const PAGE_DESC =
  'Check if your car insurance is active, expired or expiring soon — free & instant by registration number via the VAHAN government database.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}${PAGE_URL}` },
  openGraph: {
    title: 'Check Car Insurance Status Free | ChallanSetu',
    description: PAGE_DESC,
    url: `${SITE_URL}${PAGE_URL}`,
    siteName: 'ChallanSetu',
    locale: 'en_IN',
    type: 'website',
    // og:image is supplied automatically by ./opengraph-image.tsx
  },
  robots: { index: true, follow: true },
  keywords: [
    'car insurance check',
    'check car insurance by registration number',
    'car insurance status',
    'car insurance expiry check',
    'is my car insured',
    'four wheeler insurance check',
    'car insurance renewal',
    'used car insurance check',
    'car insurance status online',
    'VAHAN car insurance check',
  ],
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CarInsurancePage() {
  return (
    <>
      {/* Structured data */}
      <JsonLd data={faqSchema(CAR_FAQS)} />
      <JsonLd data={serviceSchema({ name: 'Car Insurance Status Check — Free & Instant', description: PAGE_DESC, url: PAGE_URL })} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Motor Insurance', url: '/motor-insurance' }, { name: 'Car Insurance', url: PAGE_URL }])} />
      <JsonLd
        data={howToSchema({
          name: 'How to Check Car Insurance Status by Registration Number',
          description: 'Check the insurance status of any car registered in India using its registration (number plate).',
          steps: [
            { name: 'Enter Car Number', text: 'Type your car registration number (e.g. DL3CAB1234) in the search field.' },
            { name: 'Run VAHAN Check', text: 'We query the VAHAN government database to fetch the car\'s insurance record instantly.' },
            { name: 'View Status', text: 'See if the car insurance is active, expiring soon, or expired, along with the expiry date.' },
          ],
        })}
      />
      <JsonLd data={webPageSchema({ title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL })} />

      <Navbar />
      <main className="flex-1">
        <div className="relative" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>

          {/* ── Hero ─────────────────────────────────────────────────────────── */}
          <section
            id="insurance-hero"
            className="sticky top-16 z-0 sm:relative sm:top-auto sm:z-auto overflow-hidden text-white"
            style={{
              background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)`,
              boxShadow: 'inset 0 -40px 80px rgba(0,0,0,0.3)',
            }}
          >
            <div className="absolute inset-0 pattern-dots opacity-10" />
            <div className="absolute top-0 right-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-orange-400/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

            <div className="container-app relative">
              <div className="pt-5 pb-16 lg:pt-8 lg:pb-20 flex flex-col items-center gap-5">
                <div className="text-center max-w-xl w-full">
                  <InsuranceHeroForm
                    headingLine1="Check Car Insurance Status"
                    headingLine2="by Registration Number"
                    subheading="Enter your car number to check insurance validity and find renewal options."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── Content sheet ────────────────────────────────────────────────── */}
          <div className="relative z-10 bg-white rounded-t-3xl -mt-8">

            {/* PolicyBazaar partner banners */}
            <RenewalBanner className="pt-4 pb-2 bg-white rounded-t-3xl" />

            {/* Breadcrumb (mirrors breadcrumbSchema) */}
            <nav aria-label="Breadcrumb" className="container-app max-w-5xl pt-2 pb-1">
              <ol className="flex items-center gap-1.5 text-xs text-gray-500">
                <li><Link href="/" className="hover:text-gray-700 transition-colors">Home</Link></li>
                <li aria-hidden="true" className="text-gray-300">/</li>
                <li><Link href="/motor-insurance" className="hover:text-gray-700 transition-colors">Motor Insurance</Link></li>
                <li aria-hidden="true" className="text-gray-300">/</li>
                <li className="font-medium text-gray-700" aria-current="page">Car Insurance</li>
              </ol>
            </nav>

            {/* Intro / why */}
            <section className="pt-6 pb-2 bg-white" aria-labelledby="why-car-heading">
              <div className="container-app max-w-3xl">
                <h2 id="why-car-heading" className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3">
                  Why check your car insurance status?
                </h2>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    Your car&apos;s insurance record is stored in the government&apos;s central <strong>VAHAN</strong>{' '}
                    database and tied to its registration number. Checking your <strong>car insurance status by
                    registration number</strong> tells you in seconds whether your policy is active, due for renewal,
                    or already lapsed — without hunting for old policy PDFs or calling your insurer. It is the fastest
                    way to confirm you are road-legal before a long drive, a resale, or buying a used car.
                  </p>
                </div>
              </div>
            </section>

            {/* What car insurance covers */}
            <section className="py-8 bg-white" aria-labelledby="cover-heading">
              <div className="container-app max-w-3xl">
                <h2 id="cover-heading" className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">
                  Third-party vs comprehensive car insurance
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="font-extrabold text-gray-900 mb-1.5">Third-Party (legal minimum)</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Covers injury, death or property damage you cause to others. Mandatory under the Motor Vehicles
                      Act, but pays nothing toward your own car.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="font-extrabold text-gray-900 mb-1.5">Comprehensive (full protection)</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Everything in third-party <em>plus</em> damage to your own car from accidents, theft, fire and
                      natural disasters — and you can add covers like zero-depreciation.
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    Two terms decide what a comprehensive car policy actually pays out. <strong>IDV</strong> (Insured
                    Declared Value) is your car&apos;s current market value and the most the insurer will pay if it is
                    stolen or written off — it falls each year as the car depreciates.{' '}
                    <strong>Zero-depreciation</strong> is an add-on that ignores part depreciation during a claim, so
                    you receive the full replacement cost; it is most worthwhile for cars under about five years old.
                  </p>
                </div>
              </div>
            </section>

            <HowItWorks />

            {/* Road-legal prose + internal links */}
            <section className="py-10 bg-white" aria-labelledby="road-legal-heading">
              <div className="container-app max-w-3xl">
                <h2 id="road-legal-heading" className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">
                  Keeping your car road-legal
                </h2>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    Insurance is one half of staying road-legal; pending traffic fines are the other. It is worth
                    pairing your car insurance check with a quick scan of your{' '}
                    <Link href="/" className="text-blue-600 hover:underline font-medium">pending traffic challans</Link>,
                    and reviewing local rules through guides like the{' '}
                    <Link href="/e-challan/delhi" className="text-blue-600 hover:underline font-medium">Delhi e-challan portal</Link>.
                  </p>
                  <p>
                    Renewing before expiry protects your <strong>No Claim Bonus</strong> — worth up to a 50% discount —
                    which is wiped out if the policy lapses beyond 90 days. Ride a two-wheeler or run a commercial
                    vehicle too? You can{' '}
                    <Link href="/motor-insurance" className="text-blue-600 hover:underline font-medium">check insurance status for any vehicle type</Link>{' '}
                    from our motor insurance hub.
                  </p>
                </div>
              </div>
            </section>

            <InsuranceFaqSection faqs={CAR_FAQS} heading="Car Insurance — Frequently Asked Questions" />
            <InsuranceCta />

            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
