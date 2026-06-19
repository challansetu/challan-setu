import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroForm } from '@/components/HeroForm';
import { JsonLd, cityPageSchemas } from '@/components/seo/JsonLd';
import { getCityPage, getAllCitySlugs } from '@/data/city-pages';
import { ArrowRight, MapPin, BadgePercent, FileText, Landmark, ShieldCheck, AlertTriangle } from 'lucide-react';
import { TopChallanOffencesSection } from '@/components/TopChallanOffencesSection';
import { RenewalBanner } from '@/app/motor-insurance/components/RenewalBanner';
import { ViolationTypeSection } from '@/components/ViolationTypeSection';
import { getViolationContent } from '@/data/violation-types';

const BRAND_DARK = '#1c1c24';
const BRAND_YELLOW = '#f5c842';

export function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const data = getCityPage(params.city);
  if (!data) return {};
  return {
    title: { absolute: data.metaTitle },
    description: data.metaDescription,
    alternates: { canonical: data.canonicalPath },
    openGraph: {
      title: data.ogTitle,
      description: data.ogDescription,
      url: data.canonicalPath,
    },
  };
}

const BADGE_ICONS = [ShieldCheck, BadgePercent, FileText];

// Cities with high drink-and-drive rates that get priority display
const DRINK_AND_DRIVE_PRIORITY_CITIES = ['gurgaon', 'delhi', 'noida', 'ghaziabad', 'faridabad', 'chandigarh'];

export default function CityPage({ params }: { params: { city: string } }) {
  const data = getCityPage(params.city);
  if (!data) notFound();

  const shouldShowDrinkAndDrive = DRINK_AND_DRIVE_PRIORITY_CITIES.includes(params.city.toLowerCase());
  const drinkAndDriveContent = shouldShowDrinkAndDrive ? getViolationContent('drink-and-drive') : null;

  return (
    <>
      {cityPageSchemas({
        title: data.metaTitle,
        cityName: data.cityName,
        description: data.metaDescription,
        canonicalPath: data.canonicalPath,
        vehiclePrefix: data.vehiclePrefix,
        faqs: data.faqs,
      }).map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}

      {/* Drink-and-Drive Schema Markup (if applicable) */}
      {drinkAndDriveContent && (
        <JsonLd
          data={{
            '@context': 'https://schema.org/',
            '@type': 'Service',
            name: `Drink-and-Drive Challan Settlement in ${data.cityName}`,
            description: drinkAndDriveContent.metaDescription,
            areaServed: {
              '@type': 'City',
              name: data.cityName,
              'containedIn': {
                '@type': 'State',
                name: data.stateName,
              },
            },
            provider: {
              '@type': 'Organization',
              name: 'ChallanSetu',
              url: 'https://challansetu.com',
            },
            serviceType: 'Legal Consultation & Challan Settlement Support',
            offers: {
              '@type': 'Offer',
              description: 'Expert guidance for drink-and-drive cases, Lok Adalat settlement, and court support',
            },
          }}
        />
      )}

      {/* Drink-and-Drive FAQ Schema */}
      {drinkAndDriveContent && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: drinkAndDriveContent.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }}
        />
      )}

      <Navbar />

      <main className="flex-1 bg-surface-50">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden text-white py-14 sm:py-20"
          style={{ background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)` }}
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-yellow-400/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

          <div className="container-app relative">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-white/50 text-sm mb-5" aria-label="Breadcrumb">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <Link href="/cities" className="hover:text-white transition-colors">All Cities</Link>
              <span>/</span>
              <span className="text-white/80 font-medium">{data.cityName}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 max-w-2xl leading-tight" style={{ color: BRAND_YELLOW }}>
              {data.h1}
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed">
              {data.heroSubheading}
            </p>
            <HeroForm
              source="city_page"
              city={data.slug}
              formId={`city-${data.slug}-lead-form`}
              showCalculatorLink={false}
            />
          </div>
        </section>

        {/* ── Trust strip ───────────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-amber-50/50 to-orange-50/30 border-y border-amber-100/50 py-8 sm:py-10">
          <div className="container-app">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {data.supportBadges.map((badge, index) => {
                const Icon = BADGE_ICONS[index] ?? ShieldCheck;
                return (
                  <div key={badge} className="flex items-center gap-3 flex-1 bg-white rounded-lg px-5 py-4 border border-gray-150 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-amber-100 to-orange-100">
                      <Icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-medium text-gray-800 text-sm leading-snug">{badge}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── About city challans ───────────────────────────────────────── */}
        <section className="py-6 sm:py-8">
          <div className="container-app max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{data.aboutHeading}</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-4 text-gray-600 text-sm leading-relaxed shadow-sm">
              {data.aboutParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </section>

        {/* ── Violations ─────────────────────────────────────────────────── */}
        <TopChallanOffencesSection
          violations={data.violations}
          cityName={data.cityName}
          stateName={data.stateName}
          authority={data.authority}
          title={data.violationsHeading}
          showFaqSchema={false}
          showFaq={false}
          showCta={false}
        />

        {/* ── Drink-and-Drive Section (High-Priority Cities) ───────────── */}
        {drinkAndDriveContent && (
          <ViolationTypeSection
            content={drinkAndDriveContent}
            cityName={data.cityName}
            formId={`city-${data.slug}-lead-form`}
          />
        )}

        {/* ── Court challan support ─────────────────────────────────────── */}
        <section className="py-12 sm:py-14">
          <div className="container-app max-w-3xl">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="w-5 h-5 text-amber-500" />
                <h2 className="text-2xl font-bold text-gray-900">{data.settlementHeading}</h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                {data.settlementParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </div>
        </section>

        {/* ── How ChallanSetu Works ─────────────────────────────────────── */}
        <section className="py-6 sm:py-8">
          <div className="container-app max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How ChallanSetu Works in {data.cityName}
            </h2>
            <div className="space-y-3">
              {data.steps.map((step, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4 shadow-sm">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: BRAND_DARK, color: BRAND_YELLOW }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1 text-sm">{step.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── If not paid ──────────────────────────────────────────────── */}
        <section className="py-6 sm:py-8 bg-white border-y border-gray-100">
          <div className="container-app max-w-3xl">
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-2xl font-bold text-gray-900">{data.unpaidHeading}</h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                {data.unpaidParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </div>
        </section>

        {/* ── Documents needed ─────────────────────────────────────────── */}
        <section className="py-6 sm:py-8">
          <div className="container-app max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{data.documentsHeading}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.documents.map((item) => (
                <div key={item} className="bg-white rounded-xl border border-gray-100 px-5 py-4 text-sm text-gray-600 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,200,66,0.15)' }}>
                      <FileText className="w-4 h-4" style={{ color: BRAND_YELLOW }} />
                    </div>
                    <p className="leading-relaxed">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-6 sm:py-8 bg-white">
          <div className="container-app max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900 mb-5">{data.faqHeading}</h2>
            <div className="space-y-3">
              {data.faqs.map((faq, i) => (
                <details key={i} className="group bg-surface-50 rounded-xl border border-gray-100 overflow-hidden">
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors list-none">
                    <span>{faq.q}</span>
                    <span className="ml-4 text-gray-400 flex-shrink-0 group-open:rotate-45 transition-transform duration-200 text-xl leading-none">+</span>
                  </summary>
                  <div className="px-5 pb-4 pt-1">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-5">
              More questions?{' '}
              <Link href="/faq" className="text-amber-600 hover:underline">Visit our full FAQ page</Link>.
            </p>
          </div>
        </section>

        {/* ── Related cities ────────────────────────────────────────────── */}
        <section className="py-6 sm:py-8">
          <div className="container-app">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Related City Pages</h2>
            <div className="flex flex-wrap gap-3">
              {data.relatedCities.map(({ city, slug }) => (
                <Link
                  key={slug}
                  href={`/pay-vehicle-challan-in-${slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium rounded-xl px-4 py-2 border transition-colors hover:opacity-90"
                  style={{ color: BRAND_DARK, background: 'rgba(245,200,66,0.15)', borderColor: 'rgba(245,200,66,0.3)' }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ────────────────────────────────────────────────── */}
        <section
          className="py-8 relative overflow-hidden"
          style={{ background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)` }}
        >
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="container-app text-center relative">
            <h2 className="text-2xl font-bold mb-3" style={{ color: BRAND_YELLOW }}>{data.ctaHeading}</h2>
            <p className="text-white/60 mb-7">{data.ctaSubtext}</p>
            <a
              href={`#city-${data.slug}-lead-form`}
              className="inline-flex w-full max-w-md mx-auto justify-center items-center gap-2 font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg"
              style={{ background: BRAND_YELLOW, color: BRAND_DARK }}
            >
              Check {data.cityName} Challan Eligibility
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        <RenewalBanner />

      </main>
      <Footer />
    </>
  );
}
