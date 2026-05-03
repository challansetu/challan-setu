import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description:
    'ChallanSetu\'s refund policy for challan payments. Failed payments are refunded automatically. Know your rights.',
  alternates: { canonical: '/refund-policy' },
};

const LAST_UPDATED = 'March 2025';

const REFUND_CASES = [
  {
    scenario: 'Payment deducted but order not confirmed',
    outcome: 'Full refund within 5–7 business days.',
    eligible: true,
  },
  {
    scenario: 'Double payment made for the same challan',
    outcome: 'Full refund of the duplicate payment within 5–7 business days.',
    eligible: true,
  },
  {
    scenario: 'Technical error on our platform caused payment failure',
    outcome: 'Full refund within 3–5 business days.',
    eligible: true,
  },
  {
    scenario: 'Challan successfully paid but you changed your mind',
    outcome: 'Not eligible - the challan has already been paid to the government authority.',
    eligible: false,
  },
  {
    scenario: 'Government system delayed in reflecting paid status',
    outcome: 'Not eligible for refund - the payment was successful. Keep your receipt as proof.',
    eligible: false,
  },
];

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Refund Policy', url: '/refund-policy' }])} />
      <Navbar />
      <main className="flex-1 bg-surface-50 py-12 sm:py-16">
        <div className="container-app max-w-3xl">
          <div className="bg-white rounded-2xl border border-gray-100 p-7 sm:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h1>
              <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
            </div>

            {/* Summary box */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-8 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">Our commitment</p>
                <p className="text-sm text-gray-600">If a payment fails or a technical error occurs on our end, you will receive a full refund - no questions asked. We process refunds promptly.</p>
              </div>
            </div>

            <div className="space-y-6 text-sm text-gray-600">
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">When Are Refunds Issued?</h2>
                <p>Refunds are issued in the following situations:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Your payment was deducted but the order was not successfully placed on our platform.</li>
                  <li>A technical error on our side caused a failed or duplicate transaction.</li>
                  <li>The challan could not be processed after payment was collected.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Refund Scenarios</h2>
                <div className="space-y-3">
                  {REFUND_CASES.map((c, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-4 ${c.eligible ? 'border-emerald-100 bg-emerald-50/50' : 'border-gray-100 bg-gray-50'}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`mt-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${c.eligible ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'}`}>
                          {c.eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                        </span>
                      </div>
                      <p className="font-medium text-gray-800 mt-2 mb-1">{c.scenario}</p>
                      <p className="text-gray-500 text-xs">{c.outcome}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">How to Request a Refund</h2>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>Email us at <a href="mailto:challansetu@gmail.com" className="text-primary-600 hover:underline">challansetu@gmail.com</a></li>
                  <li>Include your order number and the phone number associated with your account.</li>
                  <li>Describe the issue briefly.</li>
                </ol>
                <p className="mt-3">We will review and respond within 2 business days. Approved refunds are processed within 5–7 business days and credited back to the original payment method.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Important Notes</h2>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Once a challan has been successfully paid to the government authority, it cannot be reversed or refunded - the payment is final.</li>
                  <li>If a refund is issued, it is based on the amount you actually paid after any discount or savings adjustment applied to your case.</li>
                  <li>Razorpay may take additional time to process the refund depending on your bank or payment method.</li>
                </ul>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:challansetu@gmail.com"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors"
              >
                Email challansetu@gmail.com
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                Read our FAQ
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
