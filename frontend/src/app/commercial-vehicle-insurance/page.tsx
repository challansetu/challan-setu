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
import { COMMERCIAL_FAQS } from './faqs';

// ── Page metadata ─────────────────────────────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';
const PAGE_URL = '/commercial-vehicle-insurance';
const PAGE_TITLE = 'Commercial Vehicle Insurance Renewal, Save up to 85% | Truck, Taxi & Fleet';
const PAGE_DESC =
  'Check commercial vehicle insurance status free by registration number via VAHAN. Renew truck, taxi, bus & fleet insurance online, compare 20+ insurers, save up to 85%.';
const DATE_MODIFIED = '2026-06-20';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}${PAGE_URL}` },
  openGraph: {
    title: 'Commercial Vehicle Insurance Renewal, Save up to 85% | ChallanSetu',
    description: PAGE_DESC,
    url: `${SITE_URL}${PAGE_URL}`,
    siteName: 'ChallanSetu',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
  keywords: [
    'commercial vehicle insurance renewal',
    'commercial vehicle insurance',
    'truck insurance renewal',
    'taxi insurance renewal',
    'goods carrier insurance',
    'bus insurance renewal',
    'tempo insurance',
    'auto rickshaw insurance',
    'fleet insurance India',
    'cheap commercial vehicle insurance',
    'compare commercial vehicle insurance',
    'commercial vehicle insurance check by registration number',
    'transport vehicle insurance',
    'goods in transit insurance',
    'cab insurance renewal',
    'VAHAN commercial vehicle insurance check',
  ],
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CommercialVehicleInsurancePage() {
  return (
    <>
      {/* Structured data */}
      <JsonLd data={faqSchema(COMMERCIAL_FAQS)} />
      <JsonLd data={serviceSchema({ name: 'Commercial Vehicle Insurance Renewal & Status Check, Free VAHAN', description: PAGE_DESC, url: PAGE_URL })} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Motor Insurance', url: '/motor-insurance' }, { name: 'Commercial Vehicle Insurance', url: PAGE_URL }])} />
      <JsonLd data={howToSchema({
        name: 'How to Check & Renew Commercial Vehicle Insurance Online in India',
        description: 'Check commercial vehicle insurance status free via VAHAN and renew online to save up to 85%.',
        steps: [
          { name: 'Enter Vehicle Number', text: 'Type your commercial vehicle registration number (e.g. DL1LAB1234) in the search field.' },
          { name: 'Run VAHAN Check', text: 'We query the VAHAN government database to fetch the vehicle insurance record instantly.' },
          { name: 'Enter Mobile Number', text: 'Enter your mobile number to view personalised renewal quotes for your vehicle category.' },
          { name: 'Compare & Renew', text: 'Compare quotes from 20+ insurers via PolicyBazaar and renew at up to 85% discount.' },
        ],
      })} />
      <JsonLd data={webPageSchema({ title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, dateModified: DATE_MODIFIED })} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'InsuranceAgency',
        name: 'ChallanSetu, Commercial Vehicle Insurance Check & Renewal',
        url: `${SITE_URL}${PAGE_URL}`,
        description: PAGE_DESC,
        areaServed: 'IN',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Commercial Vehicle Insurance Plans',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Truck & Goods Carrier Insurance' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Taxi & Cab Insurance' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bus & Passenger Vehicle Insurance' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Fleet Insurance' } },
          ],
        },
      }} />

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
                    headingLine1="Renew Commercial Vehicle Insurance"
                    headingLine2="Save up to 85% Online"
                    subheading="Free VAHAN check by registration number for trucks, taxis, buses & fleets. Compare quotes from 20+ insurers & renew instantly."
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
                <li className="font-medium text-gray-700" aria-current="page">Commercial Vehicle Insurance</li>
              </ol>
            </nav>

            {/* Vehicle types covered */}
            <section className="py-8 bg-gray-50" aria-labelledby="types-heading">
              <div className="container-app max-w-4xl">
                <h2 id="types-heading" className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6">
                  Commercial Vehicles We Help You Insure
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Trucks & Goods Carriers', note: 'From ₹3,139/year' },
                    { label: 'Taxis & Cabs', note: 'Passenger cover included' },
                    { label: 'Buses & Vans', note: 'Higher liability limits' },
                    { label: 'Autos & Tempos', note: 'Affordable plans' },
                  ].map((v) => (
                    <div key={v.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                      <p className="font-bold text-gray-900 text-sm mb-1">{v.label}</p>
                      <p className="text-xs text-gray-500">{v.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <HowItWorks />

            {/* Intro / why */}
            <section className="pt-6 pb-2 bg-white" aria-labelledby="why-commercial-heading">
              <div className="container-app max-w-5xl">
                <h2 id="why-commercial-heading" className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3">
                  Why check & renew your commercial vehicle insurance?
                </h2>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    Every commercial vehicle in India, whether a truck, taxi, bus, tempo or auto, has its insurance
                    record stored in the government&apos;s central <strong>VAHAN</strong> database and tied to its
                    registration number. Checking your <strong>commercial vehicle insurance status by registration
                    number</strong> tells you in seconds whether the policy is active, due for renewal, or already
                    lapsed. For a business, a lapsed policy is not just a legal risk, it can suspend your route permit
                    and leave you exposed to lakhs in accident liability.
                  </p>
                  <p>
                    Commercial vehicle insurance is a separate category from private car or two-wheeler cover. It carries
                    higher third-party liability limits and lets you add protection for the paid driver and cleaner,
                    legal liability to passengers, and goods carried in transit. Operators running multiple vehicles can
                    also opt for fleet insurance, covering every vehicle under a single policy and renewal date.
                  </p>
                </div>
              </div>
            </section>

            {/* Third-party vs comprehensive */}
            <section className="py-8 bg-white" aria-labelledby="cover-heading">
              <div className="container-app max-w-5xl">
                <h2 id="cover-heading" className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">
                  Third-party vs comprehensive commercial vehicle insurance
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="font-extrabold text-gray-900 mb-1.5">Third-Party (legal minimum)</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Covers injury, death or property damage you cause to others. Mandatory for every commercial
                      vehicle, but pays nothing toward your own vehicle, driver, or goods.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="font-extrabold text-gray-900 mb-1.5">Comprehensive (full protection)</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Everything in third-party plus own-damage from accidents, theft, fire and natural disasters, with
                      add-ons for the paid driver, passengers, and goods in transit. Recommended for any vehicle that
                      earns you income.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Road-legal prose + internal links */}
            <section className="py-10 bg-white" aria-labelledby="road-legal-heading">
              <div className="container-app max-w-5xl">
                <h2 id="road-legal-heading" className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">
                  Keeping your commercial vehicle road-legal
                </h2>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    Insurance is one half of staying compliant; pending traffic fines are the other. Commercial vehicles
                    attract frequent overloading, permit and document challans, so it is worth pairing your insurance
                    check with a scan of your{' '}
                    <Link href="/" className="text-blue-600 hover:underline font-medium">pending traffic challans</Link>,
                    and reviewing state rules through guides like the{' '}
                    <Link href="/e-challan/delhi" className="text-blue-600 hover:underline font-medium">Delhi e-challan portal</Link>.
                  </p>
                  <p>
                    Renewing before expiry keeps your permit valid and protects your <strong>No Claim Bonus</strong>,
                    which is wiped out if the policy lapses beyond 90 days. Also run private vehicles? You can{' '}
                    <Link href="/car-insurance" className="text-blue-600 hover:underline font-medium">check car insurance status</Link>,{' '}
                    <Link href="/bike-insurance" className="text-blue-600 hover:underline font-medium">renew two-wheeler insurance</Link>, or use our{' '}
                    <Link href="/motor-insurance" className="text-blue-600 hover:underline font-medium">motor insurance hub</Link>{' '}
                    for any vehicle type.
                  </p>
                </div>
              </div>
            </section>

            {/* Affiliate Disclosure (kept in DOM for compliance, hidden from UI) */}
            <p className="sr-only">
              Disclosure: ChallanSetu earns a referral commission when you renew commercial vehicle insurance through our PolicyBazaar partner links. This does not affect your premium, prices are identical to buying directly. We only partner with IRDA-approved insurers.
            </p>

            <InsuranceFaqSection faqs={COMMERCIAL_FAQS} heading="Commercial Vehicle Insurance, Frequently Asked Questions" />
            <InsuranceCta />

            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
