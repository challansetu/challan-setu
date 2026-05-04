import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ChallanSetu\'s privacy policy - how we collect, use, and protect your personal data.',
  alternates: { canonical: '/privacy-policy' },
};

const LAST_UPDATED = 'March 2025';

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Privacy Policy', url: '/privacy-policy' }])} />
      <Navbar />
      <main className="flex-1 bg-surface-50 py-12 sm:py-16">
        <div className="container-app max-w-3xl">
          <div className="bg-white rounded-2xl border border-gray-100 p-7 sm:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
              <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
            </div>

            <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-6">
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">1. Introduction</h2>
                <p className="text-gray-600">ChallanSetu (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your personal information. This Privacy Policy explains what data we collect, why we collect it, how we use it, and how we protect it when you use our website challansetu.com and our services.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">2. Information We Collect</h2>
                <p className="text-gray-600 mb-3">We collect the following types of information:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1.5">
                  <li><strong>Phone number</strong> - used for account creation and OTP-based login. We do not collect passwords.</li>
                  <li><strong>Vehicle registration number</strong> - used to submit and review your challan assistance request.</li>
                  <li><strong>Payment information</strong> - payments are processed entirely by Razorpay. We do not store card numbers, UPI IDs, or bank account details.</li>
                  <li><strong>Order history</strong> - records of challan payments made through our platform.</li>
                  <li><strong>Device and usage data</strong> - browser type, IP address, and basic analytics data to improve our service.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">3. How We Use Your Information</h2>
                <ul className="list-disc pl-5 text-gray-600 space-y-1.5">
                  <li>To provide challan assistance, payment processing, and settlement support.</li>
                  <li>To process transactions and send payment confirmations and receipts.</li>
                  <li>To respond to support requests.</li>
                  <li>To improve our platform, fix bugs, and enhance user experience.</li>
                  <li>To comply with legal obligations.</li>
                </ul>
                <p className="text-gray-600 mt-3">We do <strong>not</strong> sell, rent, or share your personal data with third parties for marketing purposes.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">4. Payment Data & Razorpay</h2>
                <p className="text-gray-600">All payment processing is handled by Razorpay, a PCI-DSS Level 1 compliant payment gateway. When you make a payment, you interact directly with Razorpay&apos;s secure checkout. ChallanSetu receives a transaction ID and payment status - we never see or store your card, UPI, or bank details. Razorpay&apos;s privacy policy applies to the data you share with them during checkout.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">5. Data Security</h2>
                <p className="text-gray-600">We use HTTPS encryption for all data transmitted between your browser and our servers. Access to personal data is restricted to authorised personnel only. We regularly review our security practices.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">6. Data Retention</h2>
                <p className="text-gray-600">We retain your account and order data for as long as your account is active or as required by law. You may request deletion of your account and associated data by emailing us at challansetu@gmail.com.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">7. Your Rights</h2>
                <p className="text-gray-600">You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at challansetu@gmail.com. We will respond within 30 days.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">8. Cookies</h2>
                <p className="text-gray-600">We use essential cookies for session management and authentication. We use analytics cookies (e.g. Google Analytics) to understand how users interact with our site. You can disable cookies in your browser settings, but this may affect certain features.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">9. Changes to This Policy</h2>
                <p className="text-gray-600">We may update this Privacy Policy from time to time. We will notify users of significant changes via email or a notice on our website. Continued use of the service after changes constitutes acceptance.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">10. Contact Us</h2>
                <p className="text-gray-600">For any privacy-related questions or requests, contact us at: <a href="mailto:challansetu@gmail.com" className="text-primary-600 hover:underline">challansetu@gmail.com</a></p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
