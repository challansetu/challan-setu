import dynamic from 'next/dynamic';

import { JsonLd, faqSchema } from '@/components/seo/JsonLd';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroForm } from '@/components/HeroForm';
import { SocialProofTicker } from '@/components/SocialProofTicker';
import { HomepageFaqSection } from '@/components/HomepageFaqSection';
import { DiscountStepper } from '@/components/DiscountStepper';
import { TopChallanOffencesSection } from '@/components/TopChallanOffencesSection';
import { Zap, CheckCircle2, MapPin, RefreshCw, Scale } from 'lucide-react';
import { FeatureMarquee } from '@/components/FeatureMarquee';
import { HOMEPAGE_FAQS } from '@/data/homepage-faqs';
import landingData from '@/data/landing.json';
import { BlogSection } from '@/components/BlogSection';
import { WallOfDrivers } from '@/components/WallOfDrivers';

const SavingsCalculator = dynamic(
  () => import('@/components/SavingsCalculator').then((m) => ({ default: m.SavingsCalculator })),
  { ssr: false },
);
const TestimonialsCarousel = dynamic(
  () => import('@/components/TestimonialsCarousel').then((m) => ({ default: m.TestimonialsCarousel })),
  { ssr: false },
);
// Non-critical floating button — no need to SSR, load after page is interactive
const WhatsAppButton = dynamic(
  () => import('@/components/WhatsAppButton').then((m) => ({ default: m.WhatsAppButton })),
  { ssr: false },
);

export default function LandingPage() {
  return (
    <>
      <JsonLd data={faqSchema([...HOMEPAGE_FAQS])} />
      <Navbar />
      <main className="flex-1">

        {/* ── Sticky hero + content sheet wrapper ── */}
        <div className="relative">

          {/* Hero — sticky below navbar on mobile; content sheet slides over it */}
          <section className="sticky top-16 z-0 sm:relative sm:top-auto sm:z-auto overflow-hidden bg-gradient-hero text-white">
            <div className="absolute inset-0 pattern-dots opacity-40" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-300/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

            <div className="container-app relative">
              {/*
               * Two-column layout:
               *   Mobile  → flex-col:         image on top, text below
               *   Desktop → flex-row-reverse:  image on right, text on left
               * flex-row-reverse puts DOM-first child (image) on the right visually.
               */}
              <div className="py-10 lg:py-16 flex flex-col items-center justify-center gap-4 lg:gap-10 xl:gap-16">

                {/* ── Headline + form ── */}
                <div className="flex-1 min-w-0 text-center w-full max-w-3xl mx-auto">
                  {/* LCP element — no animation class, visible immediately */}
                  <h1 className="mb-5 px-2 lg:px-0 tracking-tight">
                    <span className="block text-2xl sm:text-3xl md:text-4xl font-medium text-white/60 mb-2 leading-snug">
                      Got a traffic challan?
                    </span>
                    <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05]">
                      <span className="block bg-clip-text text-transparent bg-gradient-to-r from-accent-300 via-emerald-300 to-accent-200">
                        Settle &amp; Save
                      </span>
                      <span className="block bg-clip-text text-transparent bg-gradient-to-r from-accent-300 via-emerald-300 to-accent-200">
                        Up to 50%, Legally.
                      </span>
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-md mx-auto mb-10 leading-relaxed px-4 lg:px-0">
                    Enter your vehicle number to start your challan assistance request securely.
                  </p>

                  {/* Client island: form + modal only */}
                  <HeroForm />
                </div>

              </div>
            </div>
          </section>

          {/* ── White content sheet ──
               Rounded top corners on mobile create the "app sheet sliding over hero" effect.
               Higher z-index means it covers the sticky hero as the user scrolls down. */}
          <div className="relative z-10 bg-white rounded-t-2xl sm:rounded-none -mt-8 sm:mt-0">

            {/* Social Proof Ticker */}
            <div className="mb-3 pt-5">
              <SocialProofTicker />
            </div>

            {/* Savings Calculator */}
            <SavingsCalculator />

            {/* Discount Stepper */}
            <DiscountStepper />

            {/* Challan Offences */}
            <TopChallanOffencesSection
              showFaq={false}
              showFaqSchema={false}
              showCta={false}
              title="Common Traffic Challan Offences & Fine Amounts"
              intro="Review common traffic offences and indicative government fine amounts before you move ahead with your challan request."
            />

            {/* Trust Stats */}
            <section className="py-12 bg-surface-50 pattern-grid">
              <div className="container-app">
                <div className="mb-10">
                  <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1.5 text-primary-500">
                    Our impact
                  </p>
                  <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 leading-none">
                    By the numbers
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
                  {[
                    { ...landingData.trustStats[0], icon: <CheckCircle2 className="w-5 h-5" /> },
                    { ...landingData.trustStats[1], icon: <Zap className="w-5 h-5" /> },
                    { ...landingData.trustStats[2], icon: <MapPin className="w-5 h-5" /> },
                    { ...landingData.trustStats[3], icon: <RefreshCw className="w-5 h-5" /> },
                  ].map((stat, i) => (
                    <div key={i} className="text-center group bg-white rounded-2xl p-5 border border-gray-100">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 text-primary-500 mb-3 group-hover:scale-110 transition-transform duration-300">
                        {stat.icon}
                      </div>
                      <div className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-1 tracking-tight">
                        {stat.num}
                      </div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Why Trust Us */}
            <section className="py-16 sm:py-20 bg-white overflow-hidden">
              <div className="container-app mb-10">
                <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1.5 text-primary-500">
                  Why us
                </p>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 leading-none">
                  {landingData.whyChoose.title}
                </h2>
              </div>
              <FeatureMarquee
                speed={45}
                features={[
                  { icon: <RefreshCw className="w-5 h-5" />, ...landingData.whyChoose.features[0] },
                  { icon: <Zap className="w-5 h-5" />, ...landingData.whyChoose.features[1] },
                  { icon: <CheckCircle2 className="w-5 h-5" />, ...landingData.whyChoose.features[2] },
                  { icon: <Scale className="w-5 h-5" />, ...landingData.whyChoose.features[3] },
                  { icon: <MapPin className="w-5 h-5" />, ...landingData.whyChoose.features[4] },
                ]}
              />
            </section>

            {/* Testimonials */}
            <TestimonialsCarousel />

            {/* Blog guides */}
            <BlogSection />

            {/* Wall of Responsible Drivers */}
            <WallOfDrivers />

            {/* Homepage FAQ */}
            <HomepageFaqSection />

            {/* CTA Section */}
            <section className="py-16 sm:py-20 bg-gradient-hero text-white relative overflow-hidden">
              <div className="absolute inset-0 pattern-dots opacity-30" />
              <div className="container-app relative text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-accent-300" />
                  <span className="text-sm text-white/90">{landingData.cta.badge}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none mb-4">
                  {landingData.cta.title}
                </h2>
                <p className="text-primary-200/80 mb-8 max-w-lg mx-auto">
                  {landingData.cta.subtitle}
                </p>
              </div>
            </section>

            <Footer />
          </div> {/* end white content sheet */}
        </div> {/* end sticky hero wrapper */}

      </main>
      <WhatsAppButton />
    </>
  );
}
