'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema, localBusinessSchema, serviceSchema, webPageSchema, faqSchema } from '@/components/seo/JsonLd';
import { MessageCircle } from 'lucide-react';

interface CityPageData {
  id: string;
  name: string;
  slug: string;
  state: string;
  searchVolume: number;
  competition: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  localContext: string;
  courts: Array<{ name: string; location: string; type: string }>;
  commonProblems: string[];
  caseStudies: Array<{ title: string; story: string }>;
  faqs: Array<{ q: string; a: string }>;
  localKeywords: string[];
  phone: string;
  serviceArea: string;
}

export function CityPageTemplate({ city }: { city: CityPageData }) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';
  const PAGE_URL = `/${city.slug}/challan-settlement`;
  const WHATSAPP_LINK = `https://wa.me/919876543210?text=Hi, I need help with my challan in ${city.name}. Please review my case.`;

  return (
    <>
      {/* Schema Markup */}
      <JsonLd data={faqSchema(city.faqs.map(faq => ({ q: faq.q, a: faq.a })))} />
      <JsonLd data={localBusinessSchema({
        name: `ChallanSetu - ${city.name} Challan Settlement Support`,
        description: city.description,
        address: `${city.name}, ${city.state}`,
        phone: city.phone,
        areaServed: city.serviceArea,
        url: PAGE_URL,
      })} />
      <JsonLd data={serviceSchema({
        name: `Challan Settlement Support in ${city.name}`,
        description: city.description,
        url: PAGE_URL,
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/challan-settlement' },
        { name: city.name, url: PAGE_URL }
      ])} />
      <JsonLd data={webPageSchema({
        title: city.metaTitle,
        description: city.metaDescription,
        url: PAGE_URL,
      })} />

      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden text-white py-16 lg:py-20" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>
          <div className="absolute inset-0 pattern-dots opacity-10" />
          <div className="absolute top-0 right-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />

          <div className="container-app relative">
            <div className="max-w-3xl">
              <p className="text-amber-400 font-semibold mb-2">{city.name} Challan Support</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.2] mb-6" style={{ color: '#f5c842' }}>
                Traffic Challan Settlement in {city.name}
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                Expert legal guidance for pending, court & drink-drive challans. Lok Adalat support with {city.competition?.toLowerCase()} competition.
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                Get Free Legal Review on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* White Content Sheet */}
        <div className="relative z-10 bg-white rounded-t-3xl -mt-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="container-app max-w-5xl pt-6 pb-2">
            <ol className="flex items-center gap-1.5 text-xs text-gray-500">
              <li>
                <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">/</li>
              <li className="font-medium text-gray-700" aria-current="page">{city.name} Challan Settlement</li>
            </ol>
          </nav>

          {/* Local Context Section */}
          <section className="pt-8 pb-8 bg-white" aria-labelledby="local-context">
            <div className="container-app max-w-3xl">
              <h2 id="local-context" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Traffic Challan Settlement in {city.name}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {city.localContext}
              </p>
              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Service Area:</strong> {city.serviceArea}
                </p>
              </div>
            </div>
          </section>

          {/* Common Problems Section */}
          <section className="py-8 bg-gray-50" aria-labelledby="problems">
            <div className="container-app max-w-3xl">
              <h2 id="problems" className="text-2xl font-bold text-gray-900 mb-6">
                Common Challan Issues in {city.name}
              </h2>
              <ul className="space-y-3">
                {city.commonProblems.map((problem, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-amber-500 font-bold flex-shrink-0">•</span>
                    <span className="text-gray-700">{problem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Local Courts Section */}
          <section className="py-8 bg-white" aria-labelledby="courts">
            <div className="container-app max-w-3xl">
              <h2 id="courts" className="text-2xl font-bold text-gray-900 mb-6">
                {city.name} Courts & Challan Settlement
              </h2>
              <div className="space-y-4">
                {city.courts.map((court, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-2">{court.name}</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Location:</strong> {court.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Type:</strong> {court.type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How We Help Section */}
          <section className="py-8 bg-gray-50" aria-labelledby="process">
            <div className="container-app max-w-3xl">
              <h2 id="process" className="text-2xl font-bold text-gray-900 mb-6">
                How ChallanSetu Helps in {city.name}
              </h2>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Share Your Details', desc: 'Vehicle number, challan details, and which court in ' + city.name },
                  { step: '02', title: 'Case Review', desc: 'We check your case status and eligibility for ' + city.name + ' Lok Adalat' },
                  { step: '03', title: 'Explain Options', desc: 'Lok Adalat (fastest), court compromise, or legal defense' },
                  { step: '04', title: 'File & Support', desc: 'File with appropriate ' + city.name + ' court with full support' },
                  { step: '05', title: 'Resolution', desc: 'Case settled with court confirmation' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="text-3xl font-black text-amber-500 flex-shrink-0">{item.step}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Case Studies Section */}
          {city.caseStudies.length > 0 && (
            <section className="py-8 bg-white" aria-labelledby="cases">
              <div className="container-app max-w-3xl">
                <h2 id="cases" className="text-2xl font-bold text-gray-900 mb-6">
                  Success Stories from {city.name}
                </h2>
                <div className="space-y-4">
                  {city.caseStudies.map((study, i) => (
                    <div key={i} className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                      <h3 className="font-bold text-gray-900 mb-2">✓ {study.title}</h3>
                      <p className="text-sm text-gray-700">{study.story}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* FAQ Section */}
          <section className="py-8 bg-gray-50" aria-labelledby="faqs">
            <div className="container-app max-w-3xl">
              <h2 id="faqs" className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions - {city.name}
              </h2>
              <div className="space-y-3">
                {city.faqs.map((faq, i) => (
                  <details key={i} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <summary className="px-4 py-3 cursor-pointer font-bold text-gray-900 flex items-center justify-between bg-white group-open:bg-amber-50">
                      <span className="text-sm">{faq.q}</span>
                      <span className="text-amber-500 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 py-3 text-sm text-gray-600 bg-white border-t border-gray-100">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 text-white relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>
            <div className="absolute inset-0 pattern-dots opacity-10" />
            <div className="container-app relative text-center max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Ready to Settle Your {city.name} Challan?</h2>
              <p className="text-white/70 mb-8">
                Get expert legal guidance tailored to {city.name} courts. Free review, no obligation.
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg"
              >
                <MessageCircle className="w-6 h-6" />
                Talk to Our Experts
              </a>
            </div>
          </section>

          {/* Internal Links / Related Services */}
          <section className="py-8 bg-white" aria-labelledby="related">
            <div className="container-app max-w-3xl">
              <h3 id="related" className="text-lg font-bold text-gray-900 mb-6">Related Services & Resources</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/challan-settlement" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-900">Challan Settlement Overview</h4>
                  <p className="text-sm text-gray-600 mt-1">Learn about settlement options and process</p>
                </Link>
                <Link href="/drink-and-drive" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-900">Drink & Drive Support</h4>
                  <p className="text-sm text-gray-600 mt-1">Expert guidance for Section 185 cases</p>
                </Link>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      </main>
    </>
  );
}
