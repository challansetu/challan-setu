import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema, serviceSchema, webPageSchema } from '@/components/seo/JsonLd';

// ── Page metadata ─────────────────────────────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';
const PAGE_URL = '/drink-and-drive';
const PAGE_TITLE = 'Drink & Drive Challan Settlement Support — Legal Guidance';
const PAGE_DESC =
  'Expert guidance for drink and drive challans. Understand penalties, settlement options, and legal process for DUI/drink driving cases in India.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}${PAGE_URL}` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: `${SITE_URL}${PAGE_URL}`,
    siteName: 'ChallanSetu',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
  keywords: [
    'drink and drive challan',
    'DUI penalty India',
    'drink driving fine',
    'alcohol driving challan',
    'drink drive settlement',
    'motor vehicle act 185',
    'drink driving case',
    'breath analyzer test',
    'alcohol test challan',
  ],
};

const BRAND_DARK = '#1c1c24';

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DrinkAndDrivePage() {
  return (
    <>
      {/* Structured data */}
      <JsonLd data={serviceSchema({ name: 'Drink & Drive Challan Settlement Support', description: PAGE_DESC, url: PAGE_URL })} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Drink & Drive', url: PAGE_URL }])} />
      <JsonLd data={webPageSchema({ title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL })} />

      <Navbar />
      <main className="flex-1">
        <div className="relative" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>

          {/* ── Hero ─────────────────────────────────────────────────────────── */}
          <section
            id="drink-drive-hero"
            className="relative overflow-hidden text-white"
            style={{
              background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)`,
              boxShadow: 'inset 0 -40px 80px rgba(0,0,0,0.3)',
            }}
          >
            <div className="absolute inset-0 pattern-dots opacity-10" />
            <div className="absolute top-0 right-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-red-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-orange-400/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

            <div className="container-app relative">
              <div className="pt-16 pb-16 lg:pt-20 lg:pb-20 flex flex-col items-center gap-8">
                <div className="text-center max-w-2xl w-full">
                  <h1 className="mb-5 px-2 lg:px-0 tracking-tight">
                    <span className="block text-2xl sm:text-3xl md:text-4xl font-medium text-white/70 mb-3 leading-snug">
                      Drink & Drive Challan?
                    </span>
                    <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.2]" style={{ color: '#f5c842' }}>
                      Get Legal Guidance
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg text-gray-300 mt-6 leading-relaxed max-w-xl mx-auto">
                    Understand your rights, penalties, and settlement options. Expert support through the legal process.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded-xl transition-colors">
                      Get Help on WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Content sheet ────────────────────────────────────────────────── */}
          <div className="relative z-10 bg-white rounded-t-3xl -mt-8">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="container-app max-w-5xl pt-6 pb-2">
              <ol className="flex items-center gap-1.5 text-xs text-gray-500">
                <li>
                  <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
                </li>
                <li aria-hidden="true" className="text-gray-300">/</li>
                <li className="font-medium text-gray-700" aria-current="page">Drink & Drive Support</li>
              </ol>
            </nav>

            {/* What is Drink & Drive */}
            <section className="pt-4 pb-8 bg-white" aria-labelledby="what-section">
              <div className="container-app max-w-3xl">
                <h2 id="what-section" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  What is Drink & Drive Challan?
                </h2>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    Drink and drive (DUI — Driving Under Influence) is one of the most serious traffic violations under Indian law. Under <strong>Section 185 of the Motor Vehicles Act, 1988</strong>, driving a vehicle under the influence of alcohol or drugs is a criminal offense.
                  </p>
                  <p>
                    If you are caught driving under the influence, police will issue a challan for:
                  </p>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li><strong>First offense:</strong> ₹2,000 fine or 6 months imprisonment (or both)</li>
                    <li><strong>Second offense within 3 years:</strong> ₹3,000 fine or 2 years imprisonment (or both)</li>
                    <li><strong>License suspension:</strong> Driving license may be suspended for 6-12 months</li>
                    <li><strong>Criminal record:</strong> A conviction is recorded in your criminal history</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Why Get Help */}
            <section className="py-8 bg-surface-50" aria-labelledby="why-help-section">
              <div className="container-app max-w-3xl">
                <h2 id="why-help-section" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Why You Need Expert Help
                </h2>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    Drink & drive cases are complex because they often involve:
                  </p>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li>Criminal law (not just traffic penalty)</li>
                    <li>Breathalyzer/blood test accuracy challenges</li>
                    <li>Court procedures and hearings</li>
                    <li>License suspension appeals</li>
                    <li>Potential jail time</li>
                  </ul>
                  <p className="mt-6">
                    <strong>ChallanSetu helps you:</strong>
                  </p>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li>Understand the case against you</li>
                    <li>Explore legal settlement options (Lok Adalat, court compromise, etc.)</li>
                    <li>Get proper documentation and guidance</li>
                    <li>Navigate the court process with confidence</li>
                    <li>Protect your license and legal standing</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Process */}
            <section className="py-8 bg-white" aria-labelledby="process-section">
              <div className="container-app max-w-3xl">
                <h2 id="process-section" className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  How We Help
                </h2>
                <div className="space-y-6">
                  {[
                    { step: '01', title: 'Share Your Case Details', desc: 'Tell us about your drink & drive case — when, where, and what happened.' },
                    { step: '02', title: 'We Review & Analyze', desc: 'Our team reviews the challan, offense details, and potential legal options.' },
                    { step: '03', title: 'Explain Your Options', desc: 'We explain settlement possibilities, court procedures, and the best path forward.' },
                    { step: '04', title: 'Guidance & Support', desc: 'Get step-by-step support through documentation, court dates, and the legal process.' },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-6">
                      <div className="flex-shrink-0">
                        <span className="text-3xl font-black text-amber-500">{item.step}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="py-10 text-white relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>
              <div className="absolute inset-0 pattern-dots opacity-10" />
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-red-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
              <div className="container-app relative text-center">
                <h2 className="text-xl sm:text-2xl font-bold leading-none mb-4">
                  Don't Face This Alone
                </h2>
                <p className="text-white/60 mb-8 max-w-lg mx-auto">
                  Get expert legal guidance and support for your drink & drive case. Understand your rights and options.
                </p>
                <button className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded-xl transition-colors">
                  Talk to Our Team
                </button>
              </div>
            </section>

            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
