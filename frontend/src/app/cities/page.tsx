import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema, itemListSchema } from '@/components/seo/JsonLd';
import { ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Vehicle Challan Support by City | Delhi, Noida, Gurgaon, Ghaziabad, Faridabad',
  description:
    'ChallanSetu provides traffic challan assistance in Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad. Select your city to request challan support and discount eligibility review.',
  alternates: { canonical: '/cities' },
};

const CITIES = [
  {
    name: 'Delhi',
    href: '/pay-vehicle-challan-in-delhi',
    state: 'Delhi (DL)',
    authority: 'Delhi Traffic Police',
    desc: 'CCTV echallan, ITMS speed challans, and physical challans for all DL-registered vehicles across North, South, East, and West Delhi.',
    highlight: 'Most camera-monitored city in India',
  },
  {
    name: 'Noida',
    href: '/pay-vehicle-challan-in-noida',
    state: 'Uttar Pradesh (UP)',
    authority: 'UP Traffic Police',
    desc: 'Echallan and physical challans for UP-registered vehicles in Noida (Gautam Buddha Nagar) - including Noida-Greater Noida Expressway and DND Flyway corridors.',
    highlight: 'Covers Noida Expressway & Sector roads',
  },
  {
    name: 'Gurgaon',
    href: '/pay-vehicle-challan-in-gurgaon',
    state: 'Haryana (HR)',
    authority: 'Haryana Traffic Police',
    desc: 'Echallan and physical challans for HR-registered vehicles in Gurgaon (Gurugram) - NH-48, MG Road, Golf Course Road, and Dwarka Expressway.',
    highlight: 'Covers NH-48 & Dwarka Expressway',
  },
  {
    name: 'Ghaziabad',
    href: '/pay-vehicle-challan-in-ghaziabad',
    state: 'Uttar Pradesh (UP)',
    authority: 'UP Traffic Police',
    desc: 'Echallan and physical challans for UP-registered vehicles in Ghaziabad - including the Delhi-Meerut Expressway, NH-9, and key arterial roads.',
    highlight: 'Covers Delhi-Meerut Expressway (DME)',
  },
  {
    name: 'Faridabad',
    href: '/pay-vehicle-challan-in-faridabad',
    state: 'Haryana (HR)',
    authority: 'Faridabad Traffic Police',
    desc: 'Traffic challan support for HR-registered vehicles in Faridabad, including city-road camera notices, speed violations, and settlement support requests.',
    highlight: 'Covers core Faridabad city corridors',
  },
];

export default function CitiesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Cities', url: '/cities' }])} />
      <JsonLd
        data={itemListSchema(
          CITIES.map((c) => ({ name: `${c.name} Traffic Challan Support`, url: c.href, description: c.desc }))
        )}
      />
      <Navbar />
      <main className="flex-1 bg-surface-50">
        {/* Hero */}
        <section
          className="relative overflow-hidden text-white py-14 sm:py-18"
          style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-yellow-400/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
          <div className="container-app relative">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 max-w-xl" style={{ color: '#f5c842' }}>
              Vehicle Challan Support by City
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl">
              ChallanSetu currently serves 5 cities in the NCR region. Choose your city to request challan assistance and discount eligibility review.
            </p>
          </div>
        </section>

        {/* City cards */}
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
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-amber-500" />
                        <h2 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors">{city.name}</h2>
                      </div>
                      <p className="text-xs text-gray-400">{city.state} · {city.authority}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{city.desc}</p>
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {city.highlight}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="py-12 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}
        >
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="container-app text-center relative">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#f5c842' }}>Not sure which city? Just enter your vehicle number</h2>
            <p className="text-white/60 mb-6">Start your challan assistance request securely with your vehicle number.</p>
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
