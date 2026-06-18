import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { InsuranceHeroForm } from './InsuranceHeroForm';
import { InsuranceFaqSection } from './InsuranceFaqSection';
import { FAQS } from './faqs';
import { UrgencyCarousel } from './UrgencyCarousel';
import {
  JsonLd,
  faqSchema,
  breadcrumbSchema,
  serviceSchema,
  howToSchema,
  webPageSchema,
} from '@/components/seo/JsonLd';
import {
  RenewalBanner,
  InsuranceCoverageTable,
  HowItWorks,
  NcbSlabTable,
  VehicleTypesGrid,
  PremiumFactorsList,
  LapseRisksList,
  DocumentsNeeded,
  InsuranceCta,
} from './components';
import { URGENCY_FACTS, BRAND_DARK } from './data';

// ── Page metadata ─────────────────────────────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';
const PAGE_URL = '/motor-insurance';
// Brand suffix (" | ChallanSetu") is appended by the root layout title template,
// so it must NOT be repeated here — otherwise the title double-brands.
const PAGE_TITLE = 'Check Motor Insurance Status by Vehicle Number — Free';
const PAGE_DESC =
  'Check if your car, bike, truck or any vehicle insurance is active, expired or expiring soon — free & instant via VAHAN. Covers all vehicle types registered in India.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}${PAGE_URL}` },
  openGraph: {
    title: 'Check Motor Insurance Status Free | ChallanSetu',
    description: PAGE_DESC,
    url: `${SITE_URL}${PAGE_URL}`,
    siteName: 'ChallanSetu',
    locale: 'en_IN',
    type: 'website',
    // og:image is supplied automatically by ./opengraph-image.tsx
  },
  robots: { index: true, follow: true },
  keywords: [
    'motor insurance check',
    'vehicle insurance status',
    'car insurance check by vehicle number',
    'bike insurance status',
    'check insurance online',
    'vehicle insurance expired',
    'VAHAN insurance check',
    'motor insurance India',
    'commercial vehicle insurance',
    'two wheeler insurance check',
  ],
};

// ── Schema data ──────────────────────────────────────────────────────────────
// FAQ schema is derived from the SAME FAQS rendered on-page (InsuranceFaqSection),
// so every visible Q&A is eligible for FAQ rich results — no drift.
const FAQS_FOR_SCHEMA = FAQS;

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MotorInsurancePage() {
  return (
    <>
      {/* Structured data */}
      <JsonLd data={faqSchema(FAQS_FOR_SCHEMA)} />
      <JsonLd data={serviceSchema({ name: 'Motor Insurance Status Check — Free & Instant', description: PAGE_DESC, url: PAGE_URL })} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Motor Insurance', url: PAGE_URL }])} />
      <JsonLd
        data={howToSchema({
          name: 'How to Check Vehicle Insurance Status Online',
          description: 'Check motor insurance status for any vehicle registered in India using the vehicle registration number.',
          steps: [
            { name: 'Enter Vehicle Number', text: 'Type your vehicle registration number (e.g. DL7SBY1234) in the search field.' },
            { name: 'Run VAHAN Check', text: 'We query the VAHAN government database to fetch your insurance record instantly.' },
            { name: 'View Status', text: 'See if your insurance is active, expiring soon, or expired, along with the expiry date.' },
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
                  <InsuranceHeroForm />
                </div>
              </div>
            </div>
          </section>

          {/* ── Content sheet ────────────────────────────────────────────────── */}
          <div className="relative z-10 bg-white rounded-t-3xl -mt-8">

            <RenewalBanner className="pt-4 pb-2 bg-white rounded-t-3xl" />

            {/* Breadcrumb (mirrors breadcrumbSchema for users) */}
            <nav aria-label="Breadcrumb" className="container-app max-w-5xl pt-2 pb-1">
              <ol className="flex items-center gap-1.5 text-xs text-gray-500">
                <li>
                  <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
                </li>
                <li aria-hidden="true" className="text-gray-300">/</li>
                <li className="font-medium text-gray-700" aria-current="page">Motor Insurance</li>
              </ol>
            </nav>

            {/* Why Check */}
            <section className="pt-4 bg-white rounded-2xl" aria-labelledby="why-check-heading">
              <div className="container-app max-w-5xl">
                <div className="mb-8">
                  <h2 id="why-check-heading" className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
                    Why Check Your Insurance Status?
                  </h2>
                  <p className="text-sm text-gray-500">
                    Expired insurance is not just a fine, it can cost you much more.
  </p>
                </div>

                {/* Mobile: auto-scroll carousel */}
                <UrgencyCarousel />

                {/* Desktop: 3-col grid */}
                <div className="hidden sm:grid sm:grid-cols-3 gap-4">
                  {URGENCY_FACTS.map((f) => (
                    <div
                      key={f.value}
                      className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <f.icon className="w-6 h-6" style={{ color: f.iconColor }} />
                        <span className="text-[10px] font-semibold" style={{ color: f.tagColor }}>{f.tag}</span>
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900 text-base mb-1.5">{f.value}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <InsuranceCoverageTable />
            <HowItWorks />
            <NcbSlabTable />
            <VehicleTypesGrid />
            <PremiumFactorsList />
            <LapseRisksList />
            <DocumentsNeeded />

            {/* In-depth content — topical depth + descriptive internal links */}
            <section className="py-10 bg-white" aria-labelledby="about-motor-insurance">
              <div className="container-app max-w-3xl">
                <h2 id="about-motor-insurance" className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">
                  Understanding Motor Insurance in India
                </h2>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    Every vehicle registered in India — a two-wheeler, private car, taxi, or commercial truck — is
                    recorded in the government&apos;s central <strong>VAHAN</strong> database, along with the status of
                    its insurance policy. Checking your <strong>motor insurance status by vehicle number</strong> simply
                    reads that official record, so you instantly know whether your cover is active, expiring soon, or
                    already expired — without digging through old policy papers or calling your insurer.
                  </p>
                  <p>
                    Under the Motor Vehicles Act, 1988, at least a <strong>Third-Party Liability</strong> policy is
                    legally mandatory to drive on Indian roads. Third-party cover pays for injury or damage you cause to
                    others, while a <strong>Comprehensive</strong> policy also protects your own vehicle against
                    accidents, theft, fire, and natural calamities. If you are unsure which you hold, a quick status
                    check is the fastest way to find out — and you can{' '}
                    <Link href="/how-it-works" className="text-blue-600 hover:underline font-medium">see exactly how the lookup works</Link>{' '}
                    before you start.
                  </p>
                  <p>
                    Insurance is only one half of staying road-legal. Unpaid fines can quietly pile up against your
                    registration number, so it is worth pairing your insurance check with a quick scan of your{' '}
                    <Link href="/" className="text-blue-600 hover:underline font-medium">pending traffic challans</Link>.
                    Drivers in major cities can also use our state guides, such as the{' '}
                    <Link href="/e-challan/delhi" className="text-blue-600 hover:underline font-medium">Delhi e-challan portal</Link>,
                    to understand local rules and penalties.
                  </p>
                  <p>
                    Renewing on time protects more than your legal standing. Letting a policy lapse beyond 90 days wipes
                    out your accumulated <strong>No Claim Bonus</strong> (worth up to a 50% premium discount) and may
                    force a fresh vehicle inspection. And if the worst happens, knowing your cover is active matters most
                    — here is what to do if you ever need to{' '}
                    <Link href="/recover-stolen-vehicle" className="text-blue-600 hover:underline font-medium">report and recover a stolen vehicle</Link>.
                  </p>
                </div>
              </div>
            </section>

            <InsuranceFaqSection />
            <InsuranceCta />

            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
