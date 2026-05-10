import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, faqSchema, breadcrumbSchema } from '@/components/seo/JsonLd';
import { ArrowRight, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'How to Reduce Traffic Challan Fine – FAQ | ChallanSetu' },
  description:
    'Can you legally reduce a traffic challan? Yes. Learn how Lok Adalat works, what documents you need, and how much you can save.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'How to Reduce Traffic Challan Fine – FAQ | ChallanSetu',
    description:
      'Can you legally reduce a traffic challan? Yes. Learn how Lok Adalat works, what documents you need, and how much you can save.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const FAQ_SECTIONS = [
  {
    title: 'Request & Process Questions',
    id: 'payment-questions',
    faqs: [
      {
        q: 'How do I check if my vehicle has pending challans?',
        a: 'Enter your vehicle registration number on the ChallanSetu homepage to start a challan discount eligibility check. No login is required for the current MVP flow.',
      },
      {
        q: 'What happens after I enter my vehicle number?',
        a: 'We ask for your full name, mobile number, and consent so our team can review the request. Once submitted, we verify the challan details and share the best available discount option with you shortly.',
      },
      {
        q: 'Can I submit a request if my vehicle has multiple challans?',
        a: 'Yes. Submit the vehicle once and we review the challans linked to that registration number together. Our team then shares the best next step for the full case.',
      },
      {
        q: 'Do you charge a convenience fee?',
        a: 'No payment is required to start. If your request moves forward, the available option is shared before any payment step.',
      },
      {
        q: 'How long do I have to pay a traffic challan?',
        a: 'There is no fixed nationwide deadline, but unpaid challans can accumulate and may complicate vehicle registration renewal, fitness certificate renewal, or cause issues at police checkpoints. It is best to clear them promptly.',
      },
      {
        q: 'Can I pay someone else\'s challan?',
        a: 'You can submit a request using any valid vehicle number. The request is then reviewed based on the details provided.',
      },
    ],
  },
  {
    title: 'Settlement Questions',
    id: 'settlement-questions',
    faqs: [
      {
        q: 'What is the difference between challan payment and challan settlement?',
        a: 'Challan payment means paying the fine amount for a traffic violation. Challan settlement (also called compounding) is a legal process where a court-referred or pending challan is formally resolved - the case is closed rather than just the fine being paid. ChallanSetu supports both.',
      },
      {
        q: 'Can I settle an old challan that has been pending for years?',
        a: 'In most cases, yes. Old challans can be settled through our platform. However, very old challans that have progressed to court may require additional steps - contact our support team for help with these cases.',
      },
      {
        q: 'How long does challan settlement take?',
        a: 'Timelines vary by challan type, city, and court status. Once the request is reviewed, the next step is shared with you.',
      },
      {
        q: 'Will the challan status update automatically on government portals?',
        a: 'Government portal updates depend on the underlying challan process and cannot be guaranteed instantly. If your case moves ahead, you should keep any official receipt or confirmation for reference.',
      },
    ],
  },
  {
    title: 'Safety & Trust Questions',
    id: 'safety-questions',
    faqs: [
      {
        q: 'Is it safe to pay my traffic challan through ChallanSetu?',
        a: 'Yes. All payments are processed through Razorpay - a PCI-DSS Level 1 compliant payment gateway used by thousands of Indian businesses including Zomato, HDFC, and Airtel. We never see or store your card, UPI, or bank details.',
      },
      {
        q: 'Is ChallanSetu affiliated with the traffic police or government?',
        a: 'No. ChallanSetu is an independent private platform. We are not affiliated with any government department, traffic police, or RTO. We help you navigate the challan payment and settlement process more conveniently.',
      },
      {
        q: 'Is paying a challan through a third-party service legal?',
        a: 'Yes, paying your government-issued challan through any payment platform is completely legal. The challan amount goes directly to the relevant government authority. ChallanSetu facilitates the payment - it is equivalent to paying via a bank or payment app.',
      },
      {
        q: 'How does ChallanSetu make money if there is no convenience fee?',
        a: 'ChallanSetu may earn when a case moves forward. Any savings or settlement support depend on the challan details and are reviewed case by case.',
      },
    ],
  },
  {
    title: 'Technical & Account Questions',
    id: 'technical-questions',
    faqs: [
      {
        q: 'Do I need to create an account to use ChallanSetu?',
        a: 'No. You can start by entering your vehicle number and then sharing your name, mobile number, and consent. There is no separate account creation required for the MVP flow.',
      },
      {
        q: 'What if my request submission fails?',
        a: 'If your request does not go through, simply retry from the modal. If the issue continues, contact challansetu@gmail.com and we will help you submit the request manually.',
      },
      {
        q: 'When will I hear back after submitting my request?',
        a: 'After you submit your request, the next update is shared once the case is reviewed. Timing can vary by challan type and location.',
      },
      {
        q: 'Which cities does ChallanSetu support?',
        a: 'We currently support Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad.',
      },
    ],
  },
];

// Flatten all FAQs for schema
const ALL_FAQS = FAQ_SECTIONS.flatMap((s) => s.faqs.map((f) => ({ q: f.q, a: f.a })));

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(ALL_FAQS)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'FAQ', url: '/faq' },
        ])}
      />
      <Navbar />
      <main className="flex-1 bg-surface-50">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100 py-12 sm:py-16">
          <div className="container-app text-center max-w-2xl">
            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <HelpCircle className="w-6 h-6 text-primary-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              How to Legally Reduce Your Traffic Challan Fine
            </h1>
            <p className="text-gray-500 text-lg">
              Everything you need to know about challan eligibility checks, settlement support, and the current ChallanSetu flow.
            </p>
          </div>
        </section>

        {/* FAQ content */}
        <section className="py-12 sm:py-16">
          <div className="container-app max-w-3xl">
            {/* Jump links */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 hidden sm:block">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Jump to section</p>
              <div className="flex flex-wrap gap-2">
                {FAQ_SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium bg-primary-50 hover:bg-primary-100 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              {FAQ_SECTIONS.map((section) => (
                <div key={section.id} id={section.id}>
                  <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.faqs.map((faq, i) => (
                      <details
                        key={i}
                        className="group bg-white rounded-xl border border-gray-100 overflow-hidden"
                      >
                        <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors list-none">
                          <span>{faq.q}</span>
                          <span className="ml-4 text-gray-400 flex-shrink-0 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                        </summary>
                        <div className="px-5 pb-4 pt-1">
                          <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Still have questions? */}
            <div className="mt-12 bg-primary-50 rounded-2xl border border-primary-100 p-6 text-center">
              <h3 className="font-bold text-gray-900 mb-2">Still have a question?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Our support team responds within 4 business hours.
              </p>
              <a
                href="mailto:challansetu@gmail.com"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors"
              >
                Email us at challansetu@gmail.com
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container-app text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to clear your challans?</h2>
            <p className="text-gray-500 text-sm mb-5">
              See our{' '}
              <Link href="/how-it-works" className="text-primary-600 hover:underline">
                how it works
              </Link>{' '}
              page first, or jump straight in.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
            >
              Check Eligibility
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
