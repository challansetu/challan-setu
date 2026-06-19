import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, AlertTriangle, Shield, Scale } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { HeroForm } from '@/components/HeroForm';

const BRAND_DARK = '#1c1c24';
const BRAND_YELLOW = '#f5c842';

export const metadata: Metadata = {
  title: 'Drink-and-Drive Challan Settlement: Legal Process & Options Explained',
  description: 'Complete guide to drink-and-drive challan settlement in India. Understand penalties, Lok Adalat options, license recovery, and legal defense. Get expert help today.',
  alternates: {
    canonical: '/blog/drink-and-drive-challan-settlement',
  },
  openGraph: {
    title: 'Drink-and-Drive Challan Settlement: Legal Process & Options Explained',
    description: 'Complete guide to drink-and-drive challan settlement in India. Understand penalties, Lok Adalat options, license recovery, and legal defense.',
    url: '/blog/drink-and-drive-challan-settlement',
    type: 'article',
  },
};

export default function DrinkAndDriveBlog() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Drink-and-Drive Challan Settlement: Legal Process & Options Explained',
    description: metadata.description,
    image: 'https://challansetu.com/og-image.png',
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'ChallanSetu',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ChallanSetu',
      logo: 'https://challansetu.com/logo.png',
    },
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <Navbar />

      <main className="flex-1 bg-surface-50">
        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden text-white py-12 sm:py-16"
          style={{ background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)` }}
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="container-app relative">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors"
            >
              ← Back to Blog
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight" style={{ color: BRAND_YELLOW }}>
              Drink-and-Drive Challan Settlement: Complete Legal Guide
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8 leading-relaxed">
              Understand the serious consequences of drink-and-drive charges, legal options, and how to minimize penalties through proper legal process.
            </p>
            <div className="flex gap-3 text-sm text-white/60">
              <span>Published: {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────────────────────── */}
        <article className="py-12 sm:py-16">
          <div className="container-app max-w-3xl prose prose-sm sm:prose">
            {/* What is Drink-and-Drive? */}
            <section className="mb-12">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is Drink-and-Drive and Why Is It Serious?</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  A drink-and-drive violation (DUI/DUW) occurs when you operate a vehicle while under the influence of alcohol. In India, this is one of the most serious traffic violations with severe legal consequences under Section 185 of the Motor Vehicles Act.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Unlike regular traffic violations like overspeeding or red light jumping, drink-and-drive cases often involve criminal charges that can lead to imprisonment, license suspension, and heavy fines. The severity increases significantly for repeat offenders.
                </p>
              </div>
            </section>

            {/* Penalties Section */}
            <section className="mb-12">
              <div className="bg-red-50 rounded-2xl border border-red-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  Legal Penalties for Drink-and-Drive in India
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">First Offense</h3>
                    <p className="text-sm text-gray-700">₹10,000 – ₹30,000 fine + 6 months license suspension + Up to 6 months imprisonment</p>
                  </div>
                  <div className="border-t border-red-200 pt-4">
                    <h3 className="font-semibold text-gray-900 mb-1">Repeat Offense (Within 5 Years)</h3>
                    <p className="text-sm text-gray-700">₹50,000 – ₹2,00,000 fine + 1+ year license suspension + Up to 2 years imprisonment</p>
                  </div>
                  <div className="border-t border-red-200 pt-4">
                    <h3 className="font-semibold text-gray-900 mb-1">Additional Consequences</h3>
                    <ul className="text-sm text-gray-700 space-y-2 ml-4">
                      <li>• Vehicle impound and possible auction</li>
                      <li>• Permanent criminal record</li>
                      <li>• Insurance premium increase</li>
                      <li>• Loss of commercial driving license (cab/auto drivers)</li>
                      <li>• Employment complications</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Legal Help Matters */}
            <section className="mb-12">
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Why Legal Help Matters in Drink-and-Drive Cases
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Many drivers don't realize the seriousness until they receive a court notice. At this point, the case becomes legally complex and requires expert guidance. Here's why professional help is critical:
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">1.</span>
                    <div>
                      <p className="font-semibold text-gray-900">Understanding Court Process</p>
                      <p className="text-sm text-gray-600">Drink-and-drive cases involve magistrate court proceedings, bail applications, and legal defense strategies that most drivers don't understand.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">2.</span>
                    <div>
                      <p className="font-semibold text-gray-900">Lok Adalat Settlement Options</p>
                      <p className="text-sm text-gray-600">Some cases qualify for Lok Adalat (pre-court settlement) with reduced penalties. An expert can identify if your case is eligible.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">3.</span>
                    <div>
                      <p className="font-semibold text-gray-900">Minimizing Imprisonment Risk</p>
                      <p className="text-sm text-gray-600">With proper legal defense and documentation, imprisonment can sometimes be waived or reduced. This requires expert guidance.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">4.</span>
                    <div>
                      <p className="font-semibold text-gray-900">License Recovery Planning</p>
                      <p className="text-sm text-gray-600">Understanding the license suspension period, appeal options, and restoration process requires expert knowledge.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* Court Process Timeline */}
            <section className="mb-12">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Typical Drink-and-Drive Court Process Timeline</h2>
                <div className="space-y-4">
                  {[
                    { title: 'Day 1-7: Challan Registration', desc: 'Police file formal case with court' },
                    { title: 'Week 2-4: First Hearing', desc: 'Court issues summons, bail consideration' },
                    { title: 'Month 2-4: Evidence Submission', desc: 'Blood test, dashcam footage, witness statements' },
                    { title: 'Month 4-8: Lok Adalat Attempt', desc: 'Optional pre-court settlement (if eligible)' },
                    { title: 'Month 6-12: Court Proceedings', desc: 'Multiple hearings, cross-examination, legal arguments' },
                    { title: 'Month 10-12: Judgment', desc: 'Final verdict and penalty determination' },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 text-white" style={{ background: BRAND_DARK }}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
                        <p className="text-sm text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-6 italic">Timeline varies by court backlog, jurisdiction, and case complexity.</p>
              </div>
            </section>

            {/* FAQs */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {[
                  {
                    q: 'Can I reduce my drink-and-drive fine?',
                    a: 'Yes, through legal defense in court or Lok Adalat settlement. Reductions depend on case facts, blood alcohol level, and available evidence. An expert can guide the best strategy for your situation.',
                  },
                  {
                    q: 'How can I recover my license after suspension?',
                    a: 'After the suspension period ends, you can apply for license renewal. Some cases allow early suspension reduction through court petition. The process requires proper documentation and timing.',
                  },
                  {
                    q: 'Is Lok Adalat possible for all drink-and-drive cases?',
                    a: 'Not all cases qualify. Lok Adalat eligibility depends on case type, court status, and jurisdiction. An expert review can determine if your case qualifies.',
                  },
                  {
                    q: 'Can I avoid imprisonment for first-time offense?',
                    a: 'Imprisonment is not mandatory for first offense but is possible. With proper legal defense, character evidence, and circumstances, courts may waive or reduce jail time.',
                  },
                  {
                    q: 'What happens if this is my second drink-and-drive case?',
                    a: 'Penalties are much harsher: ₹50K-₹2L fine and up to 2 years imprisonment. Legal defense becomes extremely important. Expert guidance is critical to minimize consequences.',
                  },
                ].map((faq, i) => (
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
            </section>

            {/* Key Takeaways */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Takeaways</h2>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span style={{ color: BRAND_YELLOW }} className="font-bold">✓</span>
                    <span className="text-sm text-gray-700">Drink-and-drive is a serious violation with potential imprisonment, not just a fine.</span>
                  </li>
                  <li className="flex gap-3">
                    <span style={{ color: BRAND_YELLOW }} className="font-bold">✓</span>
                    <span className="text-sm text-gray-700">Legal help is critical to understand court process and available settlement options.</span>
                  </li>
                  <li className="flex gap-3">
                    <span style={{ color: BRAND_YELLOW }} className="font-bold">✓</span>
                    <span className="text-sm text-gray-700">Lok Adalat settlement is possible for some cases and can reduce penalties significantly.</span>
                  </li>
                  <li className="flex gap-3">
                    <span style={{ color: BRAND_YELLOW }} className="font-bold">✓</span>
                    <span className="text-sm text-gray-700">License recovery requires planning and understanding of procedural timelines.</span>
                  </li>
                  <li className="flex gap-3">
                    <span style={{ color: BRAND_YELLOW }} className="font-bold">✓</span>
                    <span className="text-sm text-gray-700">Early expert intervention can make the difference between imprisonment and fine-only settlement.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Internal Links to City Pages */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Expert Help in Your City</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                ChallanSetu provides drink-and-drive settlement support across Delhi NCR. Choose your city:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { city: 'Delhi', slug: 'delhi' },
                  { city: 'Gurgaon', slug: 'gurgaon' },
                  { city: 'Noida', slug: 'noida' },
                  { city: 'Ghaziabad', slug: 'ghaziabad' },
                  { city: 'Faridabad', slug: 'faridabad' },
                ].map(({ city, slug }) => (
                  <Link
                    key={slug}
                    href={`/pay-vehicle-challan-in-${slug}`}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:opacity-90"
                    style={{ borderColor: 'rgba(245,200,66,0.3)', background: 'rgba(245,200,66,0.15)', color: BRAND_DARK }}
                  >
                    {city} Drink-and-Drive Settlement
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </article>

        {/* ── CTA Section ────────────────────────────────────────────── */}
        <section
          className="py-12 sm:py-16 relative overflow-hidden"
          style={{ background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)` }}
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="container-app text-center relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: BRAND_YELLOW }}>
              Face Drink-and-Drive Charges?
            </h2>
            <p className="text-white/60 mb-7 max-w-2xl mx-auto text-base">
              Don't navigate the legal process alone. Get expert guidance on settlement options, Lok Adalat eligibility, and license recovery.
            </p>
            <a
              href="#lead-form"
              className="inline-flex items-center gap-2 font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg"
              style={{ background: BRAND_YELLOW, color: BRAND_DARK }}
            >
              Get Help on WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* ── Lead Form ──────────────────────────────────────────────── */}
        <section id="lead-form" className="py-12 sm:py-16 bg-white">
          <div className="container-app max-w-3xl">
            <HeroForm
              source="homepage"
              formId="blog-drink-and-drive-lead-form"
              showCalculatorLink={false}
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
