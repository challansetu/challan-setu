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

// ─── Static Generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({ city }));
}

// ─── Dynamic Metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { city: string };
}): Promise<Metadata> {
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
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CityPage({ params }: { params: { city: string } }) {
  const data = getCityPage(params.city);
  if (!data) notFound();

  return (
    <>
      {/* ── Schema markup ───────────────────────────────────────────────── */}
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

      <Navbar />

      <main className="flex-1 bg-surface-50">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-primary-700 via-primary-700 to-indigo-800 text-white py-14 sm:py-20">
          <div className="container-app">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-primary-200 text-sm mb-5" aria-label="Breadcrumb">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <Link href="/cities" className="hover:text-white transition-colors">
                All Cities
              </Link>
              <span>/</span>
              <span className="text-white font-medium">{data.cityName}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 max-w-2xl leading-tight">
              {data.h1}
            </h1>
            <p className="text-primary-100/90 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed">
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
        <section className="bg-white border-b border-gray-100 py-4">
          <div className="container-app flex flex-wrap gap-x-6 gap-y-2 items-center justify-center sm:justify-start text-sm text-gray-500">
            {data.supportBadges.map((badge, index) => (
              <div key={badge} className="flex items-center gap-1.5">
                {index === 0 ? (
                  <ShieldCheck className="w-4 h-4 text-primary-500" />
                ) : index === 1 ? (
                  <BadgePercent className="w-4 h-4 text-primary-500" />
                ) : (
                  <FileText className="w-4 h-4 text-primary-500" />
                )}
                {badge}
              </div>
            ))}
          </div>
        </section>

        {/* ── About city challans ───────────────────────────────────────── */}
        <section className="py-12 sm:py-14">
          <div className="container-app max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{data.aboutHeading}</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-4 text-gray-600 text-sm leading-relaxed shadow-sm">
              {data.aboutParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ── Violations + FAQ ──────────────────────────────────────────── */}
        {/* showFaqSchema={false}: this page already emits FAQPage schema via
            cityPageSchemas() above — we avoid a duplicate FAQPage on one page. */}
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

        {/* ── Court challan support ─────────────────────────────────────── */}
        <section className="py-12 sm:py-14">
          <div className="container-app max-w-3xl">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="w-5 h-5 text-primary-500" />
                <h2 className="text-2xl font-bold text-gray-900">{data.settlementHeading}</h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                {data.settlementParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── How to pay ────────────────────────────────────────────────── */}
        <section className="py-12 sm:py-14">
          <div className="container-app max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How ChallanSetu Works in {data.cityName}
            </h2>
            <div className="space-y-3">
              {data.steps.map((step, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4 shadow-sm"
                >
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
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
        <section className="py-12 sm:py-14 bg-white border-y border-gray-100">
          <div className="container-app max-w-3xl">
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-2xl font-bold text-gray-900">{data.unpaidHeading}</h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                {data.unpaidParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Documents needed ─────────────────────────────────────────── */}
        <section className="py-12 sm:py-14">
          <div className="container-app max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{data.documentsHeading}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.documents.map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-xl border border-gray-100 px-5 py-4 text-sm text-gray-600 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <p className="leading-relaxed">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-10 bg-white">
          <div className="container-app max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900 mb-5">{data.faqHeading}</h2>
            <div className="space-y-3">
              {data.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-surface-50 rounded-xl border border-gray-100 overflow-hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors list-none">
                    <span>{faq.q}</span>
                    <span className="ml-4 text-gray-400 flex-shrink-0 group-open:rotate-45 transition-transform duration-200 text-xl leading-none">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-4 pt-1">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-5">
              More questions?{' '}
              <Link href="/faq" className="text-primary-600 hover:underline">
                Visit our full FAQ page
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ── Related cities ────────────────────────────────────────────── */}
        <section className="py-10 sm:py-12">
          <div className="container-app">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Related City Pages</h2>
            <div className="flex flex-wrap gap-3">
              {data.relatedCities.map(({ city, slug }) => (
                <Link
                  key={slug}
                  href={`/pay-vehicle-challan-in-${slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-100 rounded-xl px-4 py-2 hover:bg-primary-100 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ────────────────────────────────────────────────── */}
        <section className="py-12 bg-primary-600">
          <div className="container-app text-center">
            <h2 className="text-2xl font-bold text-white mb-3">{data.ctaHeading}</h2>
            <p className="text-primary-100 mb-7">{data.ctaSubtext}</p>
            <a
              href={`#city-${data.slug}-lead-form`}
              className="flex w-full max-w-md mx-auto justify-center items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
            >
              Check {data.cityName} Challan Eligibility
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
