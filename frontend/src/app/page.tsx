import dynamic from 'next/dynamic';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import Link from 'next/link';

import { JsonLd, faqSchema, webPageSchema } from '@/components/seo/JsonLd';
import { Navbar } from '@/components/Navbar';
import { InsuranceTopBar } from '@/components/InsuranceTopBar';
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
// import { WallOfDrivers } from '@/components/WallOfDrivers';
import { StatesChallanSection } from '@/components/StatesChallanSection';
import { StolenVehicleBanner } from '@/components/StolenVehicleBanner';
import { RenewalBanner } from '@/app/motor-insurance/components/RenewalBanner';
import { CtaScrollButton } from '@/components/CtaScrollButton';

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

export default async function LandingPage() {
  const postsPath = path.join(process.cwd(), 'src/data/blog-posts.json');
  const posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));

  return (
    <>
      <JsonLd data={faqSchema([...HOMEPAGE_FAQS])} />
      <JsonLd
        data={webPageSchema({
          title: 'ChallanSetu – Settle Traffic Challans & Save 50%',
          description:
            'Challan Setu helps you settle traffic challans legally and save up to 50% on fines via Lok Adalat. Trusted by Delhi NCR vehicle owners.',
          url: '/',
        })}
      />
      <InsuranceTopBar />
      <Navbar />
      <main className="flex-1">

        {/* ── Sticky hero + content sheet wrapper ── */}
        <div className="relative">

          {/* Hero — sticky below navbar on mobile; content sheet slides over it */}
          <section className="sticky top-16 z-0 sm:relative sm:top-auto sm:z-auto overflow-hidden bg-gradient-hero text-white">
            <div className="absolute inset-0 pattern-dots opacity-40" />
            <div className="absolute top-0 right-0 w-[200px] sm:w-[600px] h-[200px] sm:h-[600px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 sm:-translate-y-1/2 sm:translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[160px] sm:w-[400px] h-[160px] sm:h-[400px] bg-yellow-400/8 rounded-full blur-3xl translate-y-1/2 sm:translate-y-1/2 sm:-translate-x-1/4" />

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

                  <h1 className="mb-5 px-2 lg:px-0 tracking-tight">
                    <span className="block text-2xl sm:text-3xl md:text-4xl font-medium text-white/70 mb-2 leading-snug">
                      Got a traffic challan?
                    </span>
                    <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.2] pb-3" style={{ color: '#f5c842' }}>
                      <span className="block">Settle &amp; Save</span>
                      <span className="block pb-1">Up to 50%, Legally.</span>
                    </span>
                  </h1>


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

            {/* Why Trust Us */}
            <section className="pt-4 pb-4 bg-white">
              <div className="container-app">
                <div className="text-left mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">
                    {landingData.whyChoose.title}
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-4 sm:gap-8">
                  {[
                    { img: '/images/why-no-court.png', title: 'No Court Visit Required' },
                    { img: '/images/why-one-portal.png', title: 'One Portal for All Challans' },
                    { img: '/images/why-expert-lawyer.png', title: 'Backed by Legal Experts' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-3">
                      <div className="w-full aspect-square rounded-2xl bg-[rgb(233,233,234)] flex items-center justify-center overflow-hidden">
                        <Image src={item.img} alt={item.title} width={280} height={280} sizes="280px" className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">{item.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Insurance Banner */}
            <RenewalBanner />

            {/* Savings Calculator + How it Works — side by side on desktop */}
            <section className="bg-surface-50">
              <div className="container-app">
                <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-100">
                  <SavingsCalculator />
                  <DiscountStepper />
                </div>
              </div>
            </section>

            {/* Challan Offences */}
            <TopChallanOffencesSection
              showFaq={false}
              showFaqSchema={false}
              showCta={false}
              title="Common Traffic Challan Offences & Fine Amounts"
              intro="Review common traffic offences and indicative government fine amounts before you move ahead with your challan request."
            />

            {/* States Challan */}
            <StatesChallanSection />

            {/* Stolen Vehicle Recovery Banner */}
            <StolenVehicleBanner />

            {/* Trust Stats */}
            <section className="py-10 bg-white border-y border-gray-100">
              <div className="container-app">
                <div className="grid grid-cols-2 md:grid-cols-4 border border-gray-100 rounded-xl overflow-hidden">
                  {landingData.trustStats.map((stat, i) => (
                    <div key={i} className={`flex flex-col items-center justify-center gap-1 px-6 py-6 text-center border-gray-100 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''} ${i < 3 ? 'md:border-r' : ''}`}>
                      <div className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-none">
                        {stat.num}
                      </div>
                      <div className="text-xs font-semibold text-gray-400 mt-1 text-center">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <TestimonialsCarousel />

            {/* Blog guides */}
            <BlogSection posts={posts} />

            {/* Wall of Responsible Drivers */}
            {/* <WallOfDrivers /> */}

            {/* Homepage FAQ */}
            <HomepageFaqSection />

            {/* CTA Section */}
            <section className="py-10 text-white relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>
              <div className="absolute inset-0 pattern-dots opacity-10" />
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-yellow-400/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
              <div className="container-app relative text-center">
                <h2 className="text-xl sm:text-2xl font-bold leading-none mb-4">
                  {landingData.cta.title}
                </h2>
                <p className="text-white/60 mb-8 max-w-lg mx-auto">
                  {landingData.cta.subtitle}
                </p>
                <CtaScrollButton label="Settle My Challan" />
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
