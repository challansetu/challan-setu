import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { InsuranceHeroForm } from './InsuranceHeroForm';
import { InsuranceFaqSection } from './InsuranceFaqSection';
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
const PAGE_TITLE = 'Check Motor Insurance Status by Vehicle Number | Free | ChallanSetu';
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Check Motor Insurance Status Free | ChallanSetu',
    description: PAGE_DESC,
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

// ── Schema data (SEO only, not rendered) ─────────────────────────────────────
const FAQS_FOR_SCHEMA = [
  {
    q: 'How can I check my vehicle insurance status online?',
    a: 'Enter your vehicle registration number in the search box and click Check Status. We verify your insurance against the VAHAN government database and instantly show whether your policy is active, expiring soon, or expired.',
  },
  {
    q: 'Is motor insurance mandatory in India?',
    a: 'Yes. Under the Motor Vehicles Act 1988, every vehicle on Indian roads must have at least a valid Third-Party Liability insurance policy. Driving without insurance is punishable with a fine of up to ₹2,000 and/or imprisonment.',
  },
  {
    q: 'What is the difference between Comprehensive and Third-Party insurance?',
    a: 'Third-Party covers damage caused to others only. Comprehensive additionally covers your own vehicle from accidents, theft, fire, and natural disasters — offering much broader protection.',
  },
  {
    q: 'What is No Claim Bonus (NCB)?',
    a: 'NCB is a discount on your renewal premium for every claim-free year. It starts at 20% after 1 year and grows up to 50% after 5 consecutive claim-free years. It is lost if your policy lapses beyond 90 days.',
  },
  {
    q: 'What happens if motor insurance expires?',
    a: 'You face a ₹2,000 fine if caught driving uninsured. All accident liability falls on you personally. If lapsed beyond 90 days, you lose your accumulated No Claim Bonus.',
  },
];

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

            {/* Why Check */}
            <section className="pt-8 bg-white rounded-2xl" aria-labelledby="why-check-heading">
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

            <RenewalBanner />
            <InsuranceCoverageTable />
            <HowItWorks />
            <NcbSlabTable />
            <VehicleTypesGrid />
            <PremiumFactorsList />
            <LapseRisksList />
            <DocumentsNeeded />
            <InsuranceFaqSection />
            <InsuranceCta />

            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
