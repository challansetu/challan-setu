import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { HeroForm } from '@/components/HeroForm';

const BRAND_DARK = '#1c1c24';
const BRAND_YELLOW = '#f5c842';

export const metadata: Metadata = {
  title: 'License Suspension After Drink-and-Drive: Recovery & Appeal Process',
  description: 'Complete guide to license suspension after drink-and-drive challan. Learn about appeal options, recovery timeline, and how to get your license back.',
  alternates: {
    canonical: '/blog/license-suspension-appeal-drink-and-drive',
  },
};

export default function LicenseSuspensionBlog() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'License Suspension After Drink-and-Drive: Recovery & Appeal Process',
          description: metadata.description,
          datePublished: new Date().toISOString(),
          author: { '@type': 'Organization', name: 'ChallanSetu' },
        }}
      />
      <Navbar />

      <main className="flex-1 bg-surface-50">
        <section
          className="relative overflow-hidden text-white py-12 sm:py-16"
          style={{ background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)` }}
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="container-app relative">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors">
              ← Back to Blog
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight" style={{ color: BRAND_YELLOW }}>
              License Suspension After Drink-and-Drive: How to Recover
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              Understand license suspension periods, appeal options, and the complete recovery process after a drink-and-drive challan.
            </p>
          </div>
        </section>

        <article className="py-12 sm:py-16">
          <div className="container-app max-w-3xl prose prose-sm sm:prose">
            <section className="mb-12">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">License Suspension Explained</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  When you receive a drink-and-drive challan, license suspension is automatic in many cases. The suspension period varies based on offense history:
                </p>
                <div className="mt-6 space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <p className="font-semibold text-gray-900 text-sm mb-1">First Offense</p>
                    <p className="text-sm text-gray-700">6 months minimum license suspension</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="font-semibold text-gray-900 text-sm mb-1">Repeat Offense (Within 5 Years)</p>
                    <p className="text-sm text-gray-700">1 year or more license suspension</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">License Recovery Timeline</h2>
                <div className="space-y-4">
                  {[
                    { title: 'During Suspension', desc: 'Cannot legally drive. Commercial drivers lose livelihood.' },
                    { title: 'After Suspension Ends', desc: 'Apply for license renewal at RTO with required documents.' },
                    { title: 'RTO Processing', desc: 'Typically 5-10 days for license reissue after approval.' },
                    { title: 'License Restoration', desc: 'New license issued, restrictions may apply.' },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
                        <p className="text-sm text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Can You Appeal Your License Suspension?</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                In some cases, you may be able to appeal or reduce your suspension period through:
              </p>
              <div className="space-y-3">
                {[
                  { title: 'Court Petition', desc: 'File petition for early suspension reduction based on case circumstances.' },
                  { title: 'Lok Adalat Settlement', desc: 'Some cases allow reduced suspension through pre-court settlement.' },
                  { title: 'Legal Defense', desc: 'Strong legal defense may result in suspension waiver in rare cases.' },
                ].map((option, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="font-semibold text-gray-900 text-sm mb-1">{option.title}</p>
                    <p className="text-sm text-gray-600">{option.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="bg-green-50 rounded-2xl border border-green-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Documents Needed for License Restoration</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Original driving license</li>
                  <li>✓ Court order/dismissal document</li>
                  <li>✓ Suspension period completion proof</li>
                  <li>✓ Medical certificate (in some states)</li>
                  <li>✓ Proof of address</li>
                  <li>✓ Proof of vehicle registration</li>
                  <li>✓ Court judgment copy</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Points to Remember</h2>
              <div className="space-y-3">
                {[
                  'License suspension is mandatory — you cannot drive legally during this period.',
                  'Early recovery is possible through court appeals in some cases.',
                  'Commercial drivers (cab/auto) can return to work after license restoration.',
                  'Plan ahead for license renewal to avoid delays after suspension ends.',
                  'Professional legal guidance can help you explore suspension reduction options.',
                ].map((point, i) => (
                  <div key={i} className="flex gap-3">
                    <span style={{ color: BRAND_YELLOW }} className="font-bold text-lg">•</span>
                    <p className="text-sm text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </article>

        <section
          className="py-12 sm:py-16 relative overflow-hidden"
          style={{ background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)` }}
        >
          <div className="container-app text-center relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: BRAND_YELLOW }}>
              Need Help With License Recovery?
            </h2>
            <p className="text-white/60 mb-7 max-w-2xl mx-auto">
              Our team specializes in helping drivers recover licenses and understand appeal options after drink-and-drive cases.
            </p>
            <a
              href="#lead-form"
              className="inline-flex items-center gap-2 font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg"
              style={{ background: BRAND_YELLOW, color: BRAND_DARK }}
            >
              Get Legal Guidance
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        <section id="lead-form" className="py-12 sm:py-16 bg-white">
          <div className="container-app max-w-3xl">
            <HeroForm source="homepage" formId="blog-license-suspension-form" showCalculatorLink={false} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
