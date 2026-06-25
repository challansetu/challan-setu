import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema, webPageSchema, faqSchema, howToSchema } from '@/components/seo/JsonLd';
import {
  getDrinkDriveCity,
  getAllDrinkDriveCitySlugs,
  getAllDrinkDriveCities,
  getDrinkDriveCityFaqs,
  DRINK_DRIVE_PENALTY_ROWS,
  DRINK_DRIVE_SETTLEMENT_ROWS,
  DRINK_DRIVE_PROCESS_STEPS,
  DRINK_DRIVE_FIRST_STEPS,
} from '@/data/drink-drive-cities';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';
const BRAND_DARK = '#1c1c24';

// Freshness signal — bump when penalties/process content is reviewed.
const LAST_UPDATED_ISO = '2026-06-23';
const LAST_UPDATED_LABEL = 'June 2026';

const WHATSAPP_NUMBER = '918796323876';

export function generateStaticParams() {
  return getAllDrinkDriveCitySlugs().map((city) => ({ city }));
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const city = getDrinkDriveCity(params.city);
  if (!city) return {};
  const url = `${SITE_URL}/drink-and-drive/${city.slug}`;
  return {
    title: { absolute: `${city.metaTitle} | ChallanSetu` },
    description: city.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: city.metaTitle,
      description: city.metaDescription,
      url,
      siteName: 'ChallanSetu',
      locale: 'en_IN',
      type: 'website',
    },
    robots: { index: true, follow: true },
    keywords: [
      `drink and drive ${city.cityName}`,
      `drunk driving case ${city.cityName}`,
      `drink and drive lawyer ${city.cityName}`,
      `drink and drive settlement ${city.cityName}`,
      `caught for drink and drive ${city.cityName}`,
      `drink and drive court ${city.cityName}`,
      'section 185 motor vehicles act',
      'Lok Adalat drink drive',
    ],
  };
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.742 5.49 2.041 7.8L0 32l8.419-2.203A15.934 15.934 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.771-1.853l-.485-.287-5.03 1.315 1.34-4.894-.317-.502A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333z" />
      <path d="M23.18 19.385c-.388-.194-2.301-1.134-2.656-1.264-.356-.13-.615-.194-.874.194-.26.388-1.003 1.264-1.23 1.523-.226.26-.452.292-.84.097-.388-.194-1.638-.603-3.12-1.92-1.153-1.026-1.933-2.292-2.16-2.68-.226-.388-.024-.598.17-.791.174-.174.388-.453.582-.68.194-.226.26-.388.388-.647.13-.26.065-.485-.033-.68-.097-.194-.874-2.107-1.197-2.884-.315-.756-.636-.653-.874-.665-.226-.01-.485-.013-.743-.013-.26 0-.68.097-1.036.485-.355.388-1.357 1.328-1.357 3.238s1.39 3.756 1.584 4.015c.194.26 2.737 4.18 6.63 5.862.927.4 1.65.639 2.213.817.93.296 1.778.255 2.447.155.747-.11 2.301-.94 2.627-1.848.325-.907.325-1.684.227-1.848-.097-.163-.355-.26-.743-.453z" />
    </svg>
  );
}

function CTAButton({ label, subtitle, message, size = 'md' }: { label: string; subtitle?: string; message: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };
  const iconSizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-gray-900 font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl group ${sizeClasses[size]}`}
    >
      <WhatsAppIcon className={`${iconSizes[size]} text-green-600 group-hover:scale-110 transition-transform`} />
      <div className="text-left">
        <div>{label}</div>
        {subtitle && <div className="text-xs opacity-75">{subtitle}</div>}
      </div>
    </a>
  );
}

export default function DrinkAndDriveCityPage({ params }: { params: { city: string } }) {
  const city = getDrinkDriveCity(params.city);
  if (!city) notFound();

  const faqs = getDrinkDriveCityFaqs(city);
  const pagePath = `/drink-and-drive/${city.slug}`;
  const waMessage = `Hi, I was caught for drink & drive in ${city.cityName}. Please review my case and explain my settlement options.`;

  // Other cities for internal linking
  const otherCities = getAllDrinkDriveCities().filter((c) => c.slug !== city.slug);

  return (
    <>
      {/* Structured data */}
      <JsonLd data={webPageSchema({ title: city.metaTitle, description: city.metaDescription, url: pagePath, dateModified: LAST_UPDATED_ISO })} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Drink & Drive Support', url: '/drink-and-drive' },
        { name: city.cityName, url: pagePath },
      ])} />
      <JsonLd data={howToSchema({
        name: `How to Handle a Drink & Drive Case in ${city.cityName}`,
        description: `Step-by-step guide to legally settle your drink and drive case in ${city.cityName} through Lok Adalat or court.`,
        steps: DRINK_DRIVE_PROCESS_STEPS,
      })} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `Drink & Drive Case Settlement Support in ${city.cityName}`,
        description: city.metaDescription,
        url: `${SITE_URL}${pagePath}`,
        serviceType: 'Legal Consultation & Drink-and-Drive Settlement Support',
        areaServed: {
          '@type': 'City',
          name: city.cityName,
          containedInPlace: { '@type': 'State', name: city.stateName },
        },
        provider: { '@type': 'Organization', name: 'ChallanSetu', url: SITE_URL },
      }} />

      <Navbar />
      <main className="flex-1">
        <div className="relative" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>

          {/* ── Hero ─────────────────────────────────────────────────────────── */}
          <section className="relative overflow-hidden text-white" style={{ background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)`, boxShadow: 'inset 0 -40px 80px rgba(0,0,0,0.3)' }}>
            <div className="absolute inset-0 pattern-dots opacity-10" />
            <div className="absolute top-0 right-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-red-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
            <div className="container-app relative">
              <div className="pt-14 pb-14 lg:pt-16 lg:pb-16 flex flex-col items-center gap-6">
                <div className="text-center max-w-2xl w-full">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] mb-5 tracking-tight" style={{ color: '#f5c842' }}>
                    {city.h1}
                  </h1>
                  <p className="text-base sm:text-lg text-gray-300 mt-5 leading-relaxed max-w-xl mx-auto">
                    {city.heroSubheading}
                  </p>
                  <p className="text-xs text-gray-400 mt-4">
                    Updated {LAST_UPDATED_LABEL} · Reflects the Motor Vehicles (Amendment) Act, 2019
                  </p>
                  <div className="mt-7 flex justify-center">
                    <CTAButton label="Get Free Legal Review" subtitle="Via WhatsApp (5 mins)" message={waMessage} size="lg" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Content sheet ────────────────────────────────────────────────── */}
          <div className="relative z-10 bg-white rounded-t-3xl -mt-8">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="container-app max-w-3xl pt-6 pb-2">
              <ol className="flex items-center gap-1.5 text-xs text-gray-500">
                <li><Link href="/" className="hover:text-gray-700 transition-colors">Home</Link></li>
                <li aria-hidden="true" className="text-gray-300">/</li>
                <li><Link href="/drink-and-drive" className="hover:text-gray-700 transition-colors">Drink &amp; Drive</Link></li>
                <li aria-hidden="true" className="text-gray-300">/</li>
                <li className="font-medium text-gray-700" aria-current="page">{city.cityName}</li>
              </ol>
            </nav>

            {/* Intro */}
            <section className="pt-4 pb-8 bg-white">
              <div className="container-app max-w-3xl">
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  {city.introParagraphs.map((p, i) => <p key={i}>{p}</p>)}
                  <p className="mt-2 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <strong>⚠️ Important:</strong> Drink &amp; drive in {city.cityName} is a <strong>criminal case</strong> under Section 185 — not a normal challan you can clear online. Ignoring it can lead to arrest, vehicle seizure, and licence cancellation.
                  </p>
                </div>
              </div>
            </section>

            {/* First 24 hours checklist */}
            <section className="py-8 bg-amber-50 border-y border-amber-100">
              <div className="container-app max-w-3xl">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  What to Do in the First 24 Hours
                </h2>
                <ul className="space-y-3">
                  {DRINK_DRIVE_FIRST_STEPS.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <CTAButton label="Get a Free Case Review" subtitle="Before your court date" message={waMessage} size="sm" />
                </div>
              </div>
            </section>

            {/* Penalty at a glance */}
            <section className="py-8 bg-white">
              <div className="container-app max-w-3xl">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Drink &amp; Drive Penalty in {city.cityName} (2026)
                </h2>
                <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed mb-5">
                  Penalties under Section 185 of the Motor Vehicles Act, 1988 (post-2019 amendment). The legal blood-alcohol limit is <strong>30 mg per 100 ml of blood</strong> — anything above is an offence.
                </p>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-900">
                      <tr>
                        <th className="px-4 py-3 font-bold">Offence</th>
                        <th className="px-4 py-3 font-bold">Fine</th>
                        <th className="px-4 py-3 font-bold">Imprisonment</th>
                        <th className="px-4 py-3 font-bold">Licence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                      {DRINK_DRIVE_PENALTY_ROWS.map((row, i) => (
                        <tr key={row.offence} className={i % 2 === 1 ? 'bg-gray-50/50' : ''}>
                          <td className="px-4 py-3 font-medium text-gray-900">{row.offence}</td>
                          <td className="px-4 py-3">{row.fine}</td>
                          <td className="px-4 py-3">{row.jail}</td>
                          <td className="px-4 py-3">{row.licence}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  A few states apply different fine amounts — we confirm the exact figure for {city.cityName} before you decide anything. A conviction is also recorded permanently in your criminal history.
                </p>
              </div>
            </section>

            {/* Local angle */}
            <section className="py-8 bg-blue-50">
              <div className="container-app max-w-3xl">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{city.localAngleHeading}</h2>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  {city.localAngleParagraphs.map((p, i) => <p key={i}>{p}</p>)}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-white rounded-lg border border-blue-100 p-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Enforcement</p>
                      <p className="text-sm text-gray-800 mt-1">{city.trafficPolice}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-blue-100 p-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Court</p>
                      <p className="text-sm text-gray-800 mt-1">{city.court}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Settlement options comparison */}
            <section className="py-8 bg-white">
              <div className="container-app max-w-3xl">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  How to Settle Your {city.cityName} Case: 4 Options Compared
                </h2>
                <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed mb-5">
                  There is no single &ldquo;settlement fee&rdquo; — what you pay and how it ends depends on the route you take. Here is an honest comparison of every legal path.
                </p>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-900">
                      <tr>
                        <th className="px-4 py-3 font-bold">Option</th>
                        <th className="px-4 py-3 font-bold">Typical Cost</th>
                        <th className="px-4 py-3 font-bold">Timeline</th>
                        <th className="px-4 py-3 font-bold">Best For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                      {DRINK_DRIVE_SETTLEMENT_ROWS.map((row, i) => (
                        <tr key={row.option} className={i % 2 === 1 ? 'bg-gray-50/50' : ''}>
                          <td className="px-4 py-3 font-medium text-gray-900">{row.option}</td>
                          <td className="px-4 py-3">{row.cost}</td>
                          <td className="px-4 py-3">{row.timeline}</td>
                          <td className="px-4 py-3">{row.bestFor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Costs include legal assistance plus court fees and are indicative — exact amounts depend on your BAC reading and whether an accident was involved. We tell you which route realistically applies <strong>before</strong> you pay anything.
                </p>
                <div className="mt-5">
                  <CTAButton label="Find My Best Settlement Option" subtitle="Free review on WhatsApp" message={waMessage} size="md" />
                </div>
              </div>
            </section>

            {/* Process */}
            <section className="py-8 bg-white border-t border-gray-100">
              <div className="container-app max-w-3xl">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  How ChallanSetu Helps With Your {city.cityName} Case
                </h2>
                <div className="space-y-6">
                  {DRINK_DRIVE_PROCESS_STEPS.map((item, i) => (
                    <div key={item.name} className="flex gap-6">
                      <div className="flex-shrink-0">
                        <span className="text-3xl font-black text-amber-500">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base mb-2">{item.name}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="py-8 bg-white border-t border-gray-100" aria-labelledby="faq-section">
              <div className="container-app max-w-3xl">
                <h2 id="faq-section" className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  Drink &amp; Drive in {city.cityName}: Common Questions
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <details key={i} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <summary className="px-6 py-4 cursor-pointer font-bold text-gray-900 flex items-center justify-between bg-gray-50 group-open:bg-amber-50">
                        <span>{faq.q}</span>
                        <span className="text-amber-500 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="px-6 py-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </section>

            {/* Related: hub + other cities */}
            <section className="py-8 bg-gray-50 border-t border-gray-200">
              <div className="container-app max-w-3xl">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Drink &amp; Drive Help in Other Cities</h2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/drink-and-drive" className="inline-flex items-center gap-1.5 text-sm font-medium rounded-xl px-4 py-2 border border-amber-300 bg-amber-50 text-gray-800 hover:opacity-90 transition-opacity">
                    All Drink &amp; Drive Help
                  </Link>
                  {otherCities.map((c) => (
                    <Link key={c.slug} href={`/drink-and-drive/${c.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium rounded-xl px-4 py-2 border border-gray-200 bg-white text-gray-700 hover:border-amber-200 transition-colors">
                      {c.cityName}
                    </Link>
                  ))}
                </div>
                <p className="mt-5 text-sm text-gray-500">
                  Also see:{' '}
                  <Link href={`/pay-vehicle-challan-in-${city.slug}`} className="text-amber-600 hover:text-amber-700 font-medium">
                    {city.cityName} traffic challan settlement
                  </Link>
                  {' '}·{' '}
                  <Link href="/motor-insurance" className="text-amber-600 hover:text-amber-700 font-medium">
                    Check your motor insurance status
                  </Link>
                </p>
              </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-10 text-white relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>
              <div className="absolute inset-0 pattern-dots opacity-10" />
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-red-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
              <div className="container-app relative text-center">
                <h2 className="text-xl sm:text-2xl font-bold leading-none mb-4">
                  Facing a Drink &amp; Drive Case in {city.cityName}?
                </h2>
                <p className="text-white/60 mb-8 max-w-lg mx-auto">
                  Get expert legal guidance before your court date. Understand your rights, options, and the fastest path to settlement.
                </p>
                <CTAButton label="Talk to a Legal Expert" subtitle="Via WhatsApp" message={waMessage} size="lg" />
              </div>
            </section>

            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
