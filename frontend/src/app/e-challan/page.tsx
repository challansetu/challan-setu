import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema, itemListSchema } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/site-url';
import { STATES } from '@/data/e-challan-states';

export const metadata: Metadata = {
  title: { absolute: 'E-Challan Check by State — All 34 States & UTs | ChallanSetu' },
  description:
    'Check pending e-challans and traffic fines by state anywhere in India. Select your state for challan status, fine amounts, and Lok Adalat settlement support.',
  alternates: { canonical: '/e-challan' },
  openGraph: {
    title: 'E-Challan Check by State — All 34 States & UTs | ChallanSetu',
    description:
      'Check pending e-challans and traffic fines by state anywhere in India. Select your state for challan status, fine amounts, and Lok Adalat settlement support.',
    url: `${SITE_URL}/e-challan`,
  },
};

const STATE_LIST = Object.entries(STATES).map(([slug, state]) => ({ slug, ...state }));

export default function EChallanIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'E-Challan by State', url: '/e-challan' }])} />
      <JsonLd
        data={itemListSchema(
          STATE_LIST.map((s) => ({
            name: `${s.name} E-Challan Check & Settlement`,
            url: `/e-challan/${s.slug}`,
            description: s.description,
          }))
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
              Check E-Challan by State
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl">
              ChallanSetu covers e-challan checks across all 28 states and 6 union territories. Select your state to see pending challans, fine amounts, and settlement support.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container-app">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {STATE_LIST.map((state) => (
                <Link
                  key={state.slug}
                  href={`/e-challan/${state.slug}`}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-square sm:aspect-[2/3] block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <Image
                    src={state.image}
                    alt={`Check e-challan in ${state.name}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                    <span className="text-white font-bold text-xs sm:text-sm leading-tight drop-shadow-md block">
                      {state.name}
                    </span>
                    <span className="text-white/70 text-[10px] sm:text-xs">RTO: {state.rtoCode}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          className="py-12 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}
        >
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="container-app text-center relative">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#f5c842' }}>Don&apos;t see your exact city? Just enter your vehicle number</h2>
            <p className="text-white/60 mb-6">We match your vehicle to the right state automatically.</p>
            <Link
              href="/"
              className="flex w-full max-w-md mx-auto justify-center items-center gap-2 font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg"
              style={{ background: '#f5c842', color: '#1c1c24' }}
            >
              Check My Challan
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
