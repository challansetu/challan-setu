import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema, itemListSchema } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/site-url';
import { ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Traffic Challan Settlement Support | ChallanSetu' },
  description:
    'Legal traffic challan settlement support via Lok Adalat in Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad. Save up to 50% on eligible challans.',
  alternates: { canonical: '/challan-settlement' },
  openGraph: {
    title: 'Traffic Challan Settlement Support | ChallanSetu',
    description:
      'Legal traffic challan settlement support via Lok Adalat in Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad. Save up to 50% on eligible challans.',
    url: `${SITE_URL}/challan-settlement`,
  },
};

const CITIES = [
  { name: 'Delhi', href: '/delhi/challan-settlement', desc: 'Challan settlement support across all Delhi district courts.' },
  { name: 'Noida', href: '/noida/challan-settlement', desc: 'Covers Gautam Buddha Nagar District Courts and all Noida sectors.' },
  { name: 'Gurgaon', href: '/gurgaon/challan-settlement', desc: 'Settlement support for challans on NH-48, MG Road, and Golf Course Road.' },
  { name: 'Ghaziabad', href: '/ghaziabad/challan-settlement', desc: 'Covers Ghaziabad District Court and the Delhi-Meerut Expressway.' },
  { name: 'Faridabad', href: '/faridabad/challan-settlement', desc: 'Settlement support for challans across core Faridabad corridors.' },
];

export default function ChallanSettlementHubPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Challan Settlement', url: '/challan-settlement' }])} />
      <JsonLd
        data={itemListSchema(
          CITIES.map((c) => ({ name: `Challan Settlement in ${c.name}`, url: c.href, description: c.desc }))
        )}
      />
      <Navbar />
      <main className="flex-1 bg-surface-50">
        <section
          className="relative overflow-hidden text-white py-14 sm:py-18"
          style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="container-app relative">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 max-w-xl" style={{ color: '#f5c842' }}>
              Traffic Challan Settlement Support
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl">
              ChallanSetu helps vehicle owners settle pending and court traffic challans legally through Lok Adalat, saving up to 50% on eligible fines. Choose your city to get started.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container-app">
            <div className="grid sm:grid-cols-2 gap-5 max-w-4xl">
              {CITIES.map((city) => (
                <Link
                  key={city.name}
                  href={city.href}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-amber-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <h2 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors">{city.name}</h2>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{city.desc}</p>
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Up to 50% off eligible challans
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-8 text-sm text-gray-500 max-w-2xl">
              Serving a different city? See the full list at{' '}
              <Link href="/cities" className="text-amber-600 hover:underline font-medium">all supported cities</Link>, including Chandigarh.
            </p>
          </div>
        </section>

        <section
          className="py-12 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}
        >
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="container-app text-center relative">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#f5c842' }}>Not sure which city? Just enter your vehicle number</h2>
            <p className="text-white/60 mb-6">Start your challan settlement eligibility check securely with your vehicle number.</p>
            <Link
              href="/"
              className="flex w-full max-w-md mx-auto justify-center items-center gap-2 font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg"
              style={{ background: '#f5c842', color: '#1c1c24' }}
            >
              Check Challan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
