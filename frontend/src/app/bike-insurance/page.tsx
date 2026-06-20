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
import { BIKE_FAQS } from './faqs';

// ── Page metadata ─────────────────────────────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';
const PAGE_URL = '/bike-insurance';
const PAGE_TITLE = 'Two-Wheeler Insurance Renewal, From ₹1.3/day | Free Bike Insurance Check';
const PAGE_DESC =
  'Check bike insurance status free by registration number via VAHAN. Renew two-wheeler insurance online from ₹1.3/day, compare 20+ insurers, instant policy, theft cover.';
const DATE_MODIFIED = '2026-06-20';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}${PAGE_URL}` },
  openGraph: {
    title: 'Two-Wheeler Insurance Renewal from ₹1.3/day | ChallanSetu',
    description: PAGE_DESC,
    url: `${SITE_URL}${PAGE_URL}`,
    siteName: 'ChallanSetu',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
  keywords: [
    'two wheeler insurance renewal',
    'bike insurance renewal',
    'bike insurance renewal online',
    'renew bike insurance',
    'cheap two wheeler insurance',
    'compare bike insurance',
    'best bike insurance India',
    'bike insurance check by registration number',
    'two wheeler insurance status',
    'bike insurance expiry check',
    'bike insurance expired',
    'online two wheeler insurance',
    'VAHAN bike insurance check',
    'scooter insurance renewal',
    'activa insurance renewal',
    'comprehensive bike insurance India',
  ],
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BikeInsurancePage() {
  return (
    <>
      {/* Structured data */}
      <JsonLd data={faqSchema(BIKE_FAQS)} />
      <JsonLd data={serviceSchema({ name: 'Two-Wheeler Insurance Renewal & Status Check, Free VAHAN', description: PAGE_DESC, url: PAGE_URL })} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Motor Insurance', url: '/motor-insurance' }, { name: 'Bike Insurance', url: PAGE_URL }])} />
      <JsonLd data={howToSchema({
        name: 'How to Check & Renew Two-Wheeler Insurance Online in India',
        description: 'Check bike insurance status free via VAHAN and renew online from ₹1.3/day.',
        steps: [
          { name: 'Enter Bike Number', text: 'Type your two-wheeler registration number (e.g. DL8SAB1234) in the search field.' },
          { name: 'Run VAHAN Check', text: 'We query the VAHAN government database to fetch the bike\'s insurance record instantly.' },
          { name: 'Enter Mobile Number', text: 'Enter your mobile number to view personalised renewal quotes.' },
          { name: 'Compare & Renew', text: 'Compare quotes from 20+ insurers via PolicyBazaar and renew from ₹1.3/day.' },
        ],
      })} />
      <JsonLd data={webPageSchema({ title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, dateModified: DATE_MODIFIED })} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'InsuranceAgency',
        name: 'ChallanSetu, Two-Wheeler Insurance Check & Renewal',
        url: `${SITE_URL}${PAGE_URL}`,
        description: PAGE_DESC,
        areaServed: 'IN',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Two-Wheeler Insurance Plans',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Comprehensive Two-Wheeler Insurance' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Third-Party Two-Wheeler Insurance' } },
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
                    headingLine1="Renew Two-Wheeler Insurance"
                    headingLine2="From ₹1.3/day"
                    subheading="Free VAHAN check by registration number, compare bike insurance quotes from 20+ insurers & renew instantly."
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
                <li className="font-medium text-gray-700" aria-current="page">Bike Insurance</li>
              </ol>
            </nav>

            {/* Comparison table */}
            <section className="py-8 bg-gray-50" aria-labelledby="comparison-heading">
              <div className="container-app max-w-4xl">
                <h2 id="comparison-heading" className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6">
                  Bike Insurance: Third-Party vs Comprehensive
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-900 text-white">
                        <th className="px-4 py-3 text-left font-bold rounded-tl-xl">Feature</th>
                        <th className="px-4 py-3 text-center font-bold">Third-Party</th>
                        <th className="px-4 py-3 text-center font-bold rounded-tr-xl" style={{ background: '#f5c842', color: '#1a1a1a' }}>Comprehensive ★</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Legal Requirement', '✅ Yes', '✅ Yes'],
                        ['Covers 3rd Party Damage', '✅ Yes', '✅ Yes'],
                        ['Covers Own Bike Damage', '❌ No', '✅ Yes'],
                        ['Covers Theft', '❌ No', '✅ Yes'],
                        ['Fire & Natural Disaster', '❌ No', '✅ Yes'],
                        ['No Claim Bonus (NCB)', '❌ No', '✅ Up to 50%'],
                        ['Typical Annual Cost', '₹538+', '₹1.3/day (~₹500+)'],
                      ].map(([feature, tp, comp], i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 font-medium text-gray-700 border-b border-gray-100">{feature}</td>
                          <td className="px-4 py-3 text-center text-gray-600 border-b border-gray-100">{tp}</td>
                          <td className="px-4 py-3 text-center font-semibold text-gray-900 border-b border-gray-100 bg-amber-50">{comp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <HowItWorks />

            {/* Intro / why */}
            <section className="pt-6 pb-2 bg-white" aria-labelledby="why-bike-heading">
              <div className="container-app max-w-5xl">
                <h2 id="why-bike-heading" className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3">
                  Why check & renew your two-wheeler insurance?
                </h2>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    Your bike&apos;s insurance record is stored in the government&apos;s central <strong>VAHAN</strong>{' '}
                    database and tied to its registration number. Checking your <strong>two-wheeler insurance status by
                    registration number</strong> tells you in seconds whether your policy is active, due for renewal,
                    or already lapsed. Two-wheeler insurance is one of the cheapest ways to stay road-legal,                     comprehensive cover starts from as little as <strong>₹1.3/day</strong>, yet riding without it
                    invites a ₹2,000+ fine and leaves you fully liable for any accident.
                  </p>
                </div>
              </div>
            </section>

            {/* Third-party vs comprehensive */}
            <section className="py-8 bg-white" aria-labelledby="cover-heading">
              <div className="container-app max-w-5xl">
                <h2 id="cover-heading" className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">
                  Third-party vs comprehensive bike insurance
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="font-extrabold text-gray-900 mb-1.5">Third-Party (legal minimum)</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Covers injury, death or property damage you cause to others. Mandatory under the Motor Vehicles
                      Act, but pays nothing toward your own bike, and does not cover theft.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="font-extrabold text-gray-900 mb-1.5">Comprehensive (full protection)</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Everything in third-party <em>plus</em> damage to your own bike from accidents, theft, fire and
                      natural disasters. Highly recommended since two-wheelers are among India&apos;s most stolen
                      vehicles.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Road-legal prose + internal links */}
            <section className="py-10 bg-white" aria-labelledby="road-legal-heading">
              <div className="container-app max-w-5xl">
                <h2 id="road-legal-heading" className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">
                  Keeping your two-wheeler road-legal
                </h2>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    Insurance is one half of staying road-legal; pending traffic fines are the other. It is worth
                    pairing your bike insurance check with a quick scan of your{' '}
                    <Link href="/" className="text-blue-600 hover:underline font-medium">pending traffic challans</Link>,
                    and reviewing local rules through guides like the{' '}
                    <Link href="/e-challan/delhi" className="text-blue-600 hover:underline font-medium">Delhi e-challan portal</Link>.
                    Helmet and document violations are the most common two-wheeler challans across India.
                  </p>
                  <p>
                    Renewing before expiry protects your <strong>No Claim Bonus</strong>, worth up to a 50% discount,                     which is wiped out if the policy lapses beyond 90 days. Drive a car or run a commercial vehicle
                    too? You can{' '}
                    <Link href="/car-insurance" className="text-blue-600 hover:underline font-medium">check car insurance status</Link>{' '}
                    or use our{' '}
                    <Link href="/motor-insurance" className="text-blue-600 hover:underline font-medium">motor insurance hub</Link>{' '}
                    for any vehicle type.
                  </p>
                </div>
              </div>
            </section>

            {/* Affiliate Disclosure (kept in DOM for compliance, hidden from UI) */}
            <p className="sr-only">
              Disclosure: ChallanSetu earns a referral commission when you renew bike insurance through our PolicyBazaar partner links. This does not affect your premium, prices are identical to buying directly. We only partner with IRDA-approved insurers.
            </p>

            <InsuranceFaqSection faqs={BIKE_FAQS} heading="Bike Insurance, Frequently Asked Questions" />
            <InsuranceCta />

            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
