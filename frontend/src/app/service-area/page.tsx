import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema, webPageSchema } from '@/components/seo/JsonLd';
import { MapPin, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Service Area - Delhi, Noida, Gurgaon, Ghaziabad & Faridabad',
  description:
    'ChallanSetu currently serves Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad. See which challans are covered across Delhi NCR and what to expect if your vehicle is from another city.',
  alternates: { canonical: '/service-area' },
  openGraph: {
    title: 'ChallanSetu Service Area - Delhi, Noida, Gurgaon, Ghaziabad & Faridabad',
    description:
      'See which cities and challan types ChallanSetu covers. We are currently live in Delhi NCR.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const COVERED_CITIES = [
  {
    city: 'Delhi',
    authority: 'Delhi Traffic Police',
    challanTypes: ['CCTV e-challans', 'Speed challans', 'Signal jumping', 'Mobile use', 'Helmet violations', 'Physical challans'],
    notes: 'All Delhi (DL) registered vehicle challans are supported.',
    href: '/pay-vehicle-challan-in-delhi',
  },
  {
    city: 'Noida',
    authority: 'UP Traffic Police',
    challanTypes: ['UP e-challans', 'Noida expressway challans', 'Speed violations', 'Signal violations'],
    notes: 'Noida-issued challans (UP registered vehicles) are fully supported.',
    href: '/pay-vehicle-challan-in-noida',
  },
  {
    city: 'Gurgaon',
    authority: 'Haryana Traffic Police',
    challanTypes: ['Haryana e-challans', 'CCTV challans', 'Speed violations', 'Signal jumping', 'Mobile use'],
    notes: 'Gurgaon/Gurugram challans for Haryana (HR) registered vehicles are supported.',
    href: '/pay-vehicle-challan-in-gurgaon',
  },
  {
    city: 'Ghaziabad',
    authority: 'UP Traffic Police',
    challanTypes: ['UP e-challans', 'GZB expressway challans', 'Speed violations', 'Signal violations'],
    notes: 'Ghaziabad-issued challans are fully supported.',
    href: '/pay-vehicle-challan-in-ghaziabad',
  },
  {
    city: 'Faridabad',
    authority: 'Faridabad Traffic Police',
    challanTypes: ['Camera challans', 'Speed violations', 'Signal jumping', 'Helmet violations', 'Parking-related challans'],
    notes: 'Faridabad-issued challans for Haryana (HR) registered vehicles are supported.',
    href: '/pay-vehicle-challan-in-faridabad',
  },
];

export default function ServiceAreaPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Service Area', url: '/service-area' },
        ])}
      />
      <JsonLd
        data={webPageSchema({
          title: 'Service Area - Delhi, Noida, Gurgaon, Ghaziabad & Faridabad | ChallanSetu',
          description: 'ChallanSetu currently serves Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad. See which challans are covered across Delhi NCR.',
          url: '/service-area',
        })}
      />
      <Navbar />
      <main className="flex-1 bg-surface-50">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100 py-12 sm:py-16">
          <div className="container-app text-center max-w-2xl">
            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <MapPin className="w-6 h-6 text-primary-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Our Service Area
            </h1>
            <p className="text-gray-500 text-lg">
              ChallanSetu currently serves <strong>Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad</strong>. We are focused on Delhi NCR and expanding to more cities soon.
            </p>
          </div>
        </section>

        {/* Covered cities */}
        <section className="py-12 sm:py-16">
          <div className="container-app">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Covered Cities</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {COVERED_CITIES.map((c) => (
                <div key={c.city} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-primary-200 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{c.city}</h3>
                      <p className="text-xs text-gray-400">{c.authority}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                      <CheckCircle2 className="w-3 h-3" /> Covered
                    </span>
                  </div>
                  <ul className="space-y-1 mb-4">
                    {c.challanTypes.map((type) => (
                      <li key={type} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        {type}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-400 mb-4 bg-gray-50 rounded-lg px-3 py-2">{c.notes}</p>
                  <Link
                    href={c.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    Pay {c.city} challans
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Not covered */}
        <section className="py-10 sm:py-12 bg-white border-t border-gray-100">
          <div className="container-app max-w-3xl">
            <div className="flex items-start gap-4 bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <XCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold text-gray-900 mb-2">Outside Delhi NCR?</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  If your vehicle is from another city (e.g. Mumbai, Bangalore, Pune, Hyderabad), we cannot process your challans yet. You can still submit your vehicle number to start a request, and we will help you understand whether your challan falls within our current coverage area. We are expanding soon.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-surface-50 border-t border-gray-100">
          <div className="container-app text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Is your vehicle covered?</h2>
            <p className="text-gray-500 text-sm mb-5">Enter your vehicle number to start a challan eligibility request.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
            >
              Check Challan
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
