import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema, webPageSchema } from '@/components/seo/JsonLd';
import { Shield, MapPin, Zap, HeartHandshake, ArrowRight, Mail, Clock } from 'lucide-react';
import siteData from '@/data/site.json';

export const metadata: Metadata = {
  // absolute: title already contains the brand; absolute avoids the template
  // appending "| ChallanSetu" a second time.
  title: { absolute: 'About ChallanSetu - Our Mission' },
  description:
    'ChallanSetu is on a mission to make traffic challan payment simple, affordable, and stress-free for vehicle owners across Delhi, Noida, Gurgaon & Ghaziabad.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About ChallanSetu - Our Mission',
    description:
      'Learn about ChallanSetu - India\'s simplest platform to get challan assistance and settlement support, with savings up to 50% on eligible challans.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const VALUES = [
  {
    icon: Shield,
    title: 'Transparency First',
    description:
      'No hidden fees. No surprise charges. You see your challan amount, the exact discount, and the final amount you pay - before you tap Pay.',
  },
  {
    icon: Zap,
    title: 'Speed & Simplicity',
    description:
      'We built ChallanSetu because the existing process was slow, confusing, and required multiple visits. Our goal: start a challan assistance request in under 5 minutes, from your phone.',
  },
  {
    icon: MapPin,
    title: 'Local Focus',
    description:
      'We are deeply focused on Delhi NCR - Delhi, Noida, Gurgaon, and Ghaziabad. Local focus means better data, better coverage, and a service that understands your city.',
  },
  {
    icon: HeartHandshake,
    title: 'User-Side Always',
    description:
      'We work to unlock the best available discount option for each case. Savings can go up to 50%, because we believe the existing challan process should feel fairer and more useful to drivers.',
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ])}
      />
      <JsonLd
        data={webPageSchema({
          title: 'About ChallanSetu - Our Mission',
          description: 'ChallanSetu is on a mission to make traffic challan payment simple, affordable, and stress-free for vehicle owners across Delhi, Noida, Gurgaon & Ghaziabad.',
          url: '/about',
        })}
      />
      <Navbar />
      <main className="flex-1 bg-surface-50">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100 py-14 sm:py-20">
          <div className="container-app max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              About ChallanSetu
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              We started ChallanSetu because paying a traffic challan in India is unnecessarily painful - long queues, confusing government portals, and multiple trips to offices. We built a better way.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-14 sm:py-16">
          <div className="container-app max-w-3xl">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                ChallanSetu&apos;s mission is simple: make traffic challan payment and settlement fast, affordable, and accessible to every vehicle owner in India.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We currently serve <strong>Delhi, Noida, Gurgaon, and Ghaziabad</strong> - the four major urban centres of Delhi NCR. Our team reviews challan details, guides you through the settlement process, and you can pay securely online — so you never have to visit a court or police station.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We work to unlock <strong>savings up to 50%</strong> depending on the challan details and route available. This is not a government scheme - it is part of how we make the process more valuable for the people who trust our platform.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-14 bg-white">
          <div className="container-app">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">What We Stand For</h2>
            <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {VALUES.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="bg-surface-50 rounded-2xl p-6 border border-gray-100">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(245,200,66,0.12)' }}>
                      <Icon className="w-5 h-5 text-amber-500" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Service area */}
        <section className="py-14 sm:py-16">
          <div className="container-app max-w-3xl">
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-7 sm:p-9">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                Where We Operate
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                ChallanSetu currently covers challans issued by traffic authorities in:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {siteData.serviceArea.map((city) => (
                  <div key={city} className="bg-white rounded-xl border border-amber-100 p-3 text-center">
                    <span className="text-sm font-semibold text-gray-800">{city}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/service-area"
                className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                View full service area details
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section id="contact" className="py-14 bg-white border-t border-gray-100">
          <div className="container-app max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
            <p className="text-gray-500 mb-8 text-sm">
              Have a question, feedback, or a challan issue we can help with? Reach out to our team.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-surface-50 rounded-2xl border border-gray-100 p-6">
                <Mail className="w-5 h-5 text-amber-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                <p className="text-sm text-gray-500 mb-2">{siteData.contact.responseTime}</p>
                <a
                  href={`mailto:${siteData.contact.email}`}
                  className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  {siteData.contact.email}
                </a>
              </div>
              <div className="bg-surface-50 rounded-2xl border border-gray-100 p-6">
                <Clock className="w-5 h-5 text-amber-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Support Hours</h3>
                <p className="text-sm text-gray-500 mb-2">{siteData.contact.supportHours}</p>
                <Link
                  href="/faq"
                  className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Check our FAQ first →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
