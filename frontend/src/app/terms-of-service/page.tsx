import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ChallanSetu\'s terms of service - the rules and conditions for using our challan payment platform.',
  alternates: { canonical: '/terms-of-service' },
};

const LAST_UPDATED = 'March 2025';

export default function TermsOfServicePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Terms of Service', url: '/terms-of-service' }])} />
      <Navbar />
      <main className="flex-1 bg-surface-50 py-12 sm:py-16">
        <div className="container-app max-w-3xl">
          <div className="bg-white rounded-2xl border border-gray-100 p-7 sm:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
              <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
            </div>

            <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-6">
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
                <p className="text-gray-600">By accessing or using ChallanSetu (challansetu.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">2. What ChallanSetu Does</h2>
                <p className="text-gray-600">ChallanSetu is an independent private platform that helps users get assistance with traffic challan payment and settlement. We are not affiliated with any government department, traffic police authority, RTO, or court. We facilitate the payment process - the challan amounts are paid to the relevant government authorities.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">3. Eligibility</h2>
                <p className="text-gray-600">You must be at least 18 years old to use ChallanSetu. By using our service, you represent that you are 18 or older and that you have the right to pay the challans you select (i.e. you are the vehicle owner or acting on behalf of the owner).</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">4. Service Accuracy</h2>
                <p className="text-gray-600">Our team verifies challan details through available sources. While we make every effort to provide accurate and up-to-date information, we cannot guarantee that information is always complete or current. Government systems may have delays or inconsistencies. Always verify critical information directly with the relevant authority.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">5. Payments</h2>
                <p className="text-gray-600">All payments are processed through Razorpay. By completing a payment, you authorise ChallanSetu to process the payment on your behalf. Once a payment is completed, it cannot be reversed unless it is eligible under our Refund Policy. Any savings or discount options shown by ChallanSetu are subject to change, case eligibility, and our sole discretion.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">6. Service Limitations</h2>
                <p className="text-gray-600 mb-2">ChallanSetu currently operates in Delhi, Noida, Gurgaon, and Ghaziabad only. We cannot process challans outside this service area. We are not responsible for:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Delays in government systems reflecting paid challans</li>
                  <li>Inaccuracies in challan data provided by government databases</li>
                  <li>Issues arising from challans that are outside our service area</li>
                  <li>Court proceedings or enforcement actions by traffic authorities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">7. User Responsibilities</h2>
                <ul className="list-disc pl-5 text-gray-600 space-y-1.5">
                  <li>You are responsible for providing a correct vehicle registration number.</li>
                  <li>You must not use our platform for any fraudulent, unlawful, or abusive purpose.</li>
                  <li>You are responsible for maintaining the security of your account.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">8. Intellectual Property</h2>
                <p className="text-gray-600">All content on challansetu.com - including text, design, logos, and code - is owned by or licensed to ChallanSetu. You may not copy, reproduce, or redistribute any part of the platform without written permission.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">9. Limitation of Liability</h2>
                <p className="text-gray-600">ChallanSetu shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform. Our total liability for any claim shall not exceed the amount you paid for the specific transaction giving rise to the claim.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">10. Governing Law</h2>
                <p className="text-gray-600">These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Delhi.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">11. Contact</h2>
                <p className="text-gray-600">For questions about these terms: <a href="mailto:challansetu@gmail.com" className="text-primary-600 hover:underline">challansetu@gmail.com</a></p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
