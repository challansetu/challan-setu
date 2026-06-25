import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema, serviceSchema, webPageSchema, faqSchema, howToSchema } from '@/components/seo/JsonLd';
import { getAllDrinkDriveCities } from '@/data/drink-drive-cities';

// WhatsApp contact for drink-and-drive cases
const WHATSAPP_NUMBER = '+918796323876'; // ChallanSetu support number
const WHATSAPP_MESSAGE = encodeURIComponent('Hi, I need legal help with my drink & drive challan. Please review my case.');

// WhatsApp Icon Component (same as the floating landing-page button)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.742 5.49 2.041 7.8L0 32l8.419-2.203A15.934 15.934 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.771-1.853l-.485-.287-5.03 1.315 1.34-4.894-.317-.502A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333z" />
      <path d="M23.18 19.385c-.388-.194-2.301-1.134-2.656-1.264-.356-.13-.615-.194-.874.194-.26.388-1.003 1.264-1.23 1.523-.226.26-.452.292-.84.097-.388-.194-1.638-.603-3.12-1.92-1.153-1.026-1.933-2.292-2.16-2.68-.226-.388-.024-.598.17-.791.174-.174.388-.453.582-.68.194-.226.26-.388.388-.647.13-.26.065-.485-.033-.68-.097-.194-.874-2.107-1.197-2.884-.315-.756-.636-.653-.874-.665-.226-.01-.485-.013-.743-.013-.26 0-.68.097-1.036.485-.355.388-1.357 1.328-1.357 3.238s1.39 3.756 1.584 4.015c.194.26 2.737 4.18 6.63 5.862.927.4 1.65.639 2.213.817.93.296 1.778.255 2.447.155.747-.11 2.301-.94 2.627-1.848.325-.907.325-1.684.227-1.848-.097-.163-.355-.26-.743-.453z" />
    </svg>
  );
}

// CTA Button Component
function CTAButton({
  label,
  subtitle,
  fullWidth = false,
  size = 'md',
}: {
  label: string;
  subtitle?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${WHATSAPP_MESSAGE}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-gray-900 font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl group ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`}
    >
      <WhatsAppIcon className={`${iconSizes[size]} text-green-600 group-hover:scale-110 transition-transform`} />
      <div className="text-left">
        <div>{label}</div>
        {subtitle && <div className="text-xs opacity-75">{subtitle}</div>}
      </div>
    </a>
  );
}

// ── FAQ Data ──────────────────────────────────────────────────────────────────
const DRINK_AND_DRIVE_FAQS = [
  {
    q: 'What is the penalty for drink and drive in India?',
    a: 'Under Section 185 of the Motor Vehicles Act, 1988 (as amended in 2019): First offense: ₹10,000 fine or up to 6 months imprisonment or both. Second offense within 3 years: ₹15,000 fine or up to 2 years imprisonment or both. License suspension: 6-12 months. A conviction is also recorded in your criminal history, affecting future employment and background checks. (A few states apply different fine amounts — we confirm the exact figure for your city.)',
  },
  {
    q: 'Can a drink and drive challan be settled in India?',
    a: 'Yes. Drink and drive cases can be resolved through multiple legal channels: Lok Adalat (court-directed settlement), magistrate court compromise (with mutual consent), or proper legal defense if there are procedural errors or test inaccuracies. The settlement option depends on the case stage and local court procedures.',
  },
  {
    q: 'What is the legal alcohol limit for driving in India?',
    a: 'The legal limit in India is 30 micrograms of alcohol per 100 milliliters of breath (or 42 micrograms per 100 milliliters of blood). If a breathalyzer test shows any reading above this limit, you are considered to be driving under influence and can be prosecuted under Section 185.',
  },
  {
    q: 'How does a breathalyzer test work and can it be challenged?',
    a: 'A breathalyzer measures alcohol in your breath by blowing into the device for 5-10 seconds. The device displays BAC (Blood Alcohol Content) reading. However, results can be challenged if: The device wasn\'t calibrated properly, the test procedure wasn\'t followed correctly, you had medical conditions affecting the result (acid reflux, diabetes), or the officer didn\'t witness the test properly. A blood test is more reliable and can be demanded as a follow-up.',
  },
  {
    q: 'What happens if I don\'t pay a drink and drive challan?',
    a: 'Ignoring a drink and drive challan can lead to: Escalation from traffic violation to criminal case, vehicle registration suspension, driving license cancellation, inability to renew insurance, vehicle seizure by police, and potential arrest if stopped at checkpoints. It\'s important to address the challan promptly through legal means.',
  },
  {
    q: 'Will a drink and drive conviction affect my job?',
    a: 'Yes. A drink and drive conviction: Appears on your criminal record permanently, can disqualify you from jobs requiring background checks (banking, government, security, healthcare, aviation), may affect professional licenses (CA, lawyer, doctor), and can impact visa applications to other countries. Taking legal action to settle or defend the case is crucial.',
  },
  {
    q: 'What documents do I need for a drink and drive case?',
    a: 'Key documents include: Original challan copy, FIR (First Information Report) if registered, breathalyzer test report, medical reports (if applicable), driving license, vehicle registration certificate, insurance certificate, witness statements (if any), photos from the scene, and any communication with police. ChallanSetu helps organize and file these systematically.',
  },
  {
    q: 'How long does a drink and drive case take to settle?',
    a: 'Timeline varies by case type: Lok Adalat settlement: 4-8 weeks, Court compromise: 3-6 months, Full court trial: 6-18 months. Factors affecting timeline: Case complexity, court schedule, availability of documents, cooperation of involved parties. Early legal intervention typically speeds up resolution.',
  },
  {
    q: 'Is it illegal to drive after consuming alcohol in Delhi NCR?',
    a: 'Yes. Drink and drive laws apply uniformly across Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad. All are under Indian Motor Vehicles Act Section 185. Police in all these cities conduct regular breath tests at checkpoints, especially on weekends and holidays. Getting legal guidance immediately after a challan is critical.',
  },
  {
    q: 'What\'s the difference between DUI and drink and drive?',
    a: 'DUI (Driving Under Influence) is a broader term covering alcohol OR drugs. In India, both fall under Section 185 and carry identical penalties. A challan issued for drinking and driving is categorized as DUI if either alcohol or drugs (or both) were detected. The legal process and settlement options are the same.',
  },
  {
    q: 'How much does it cost to settle a drink and drive case?',
    a: 'Costs vary based on settlement path: Lok Adalat settlement: ₹2,000-₹5,000 (minimal court fees), Court compromise: ₹3,000-₹8,000 (legal assistance + court fees), Full trial: ₹10,000-₹30,000+ (lawyer fees + extended proceedings). ChallanSetu explains the cost structure upfront before starting.',
  },
  {
    q: 'Can I drive after getting a drink and drive challan?',
    a: 'Not legally. Police may seize your driving license at the time of the challan. You cannot legally drive until the case is resolved or your license is returned by court order. Driving without a valid license during this period is an additional offense. You can apply to the transport authority for a temporary license in some cases.',
  },
  {
    q: 'Can a first-time drink and drive offender avoid jail?',
    a: 'In most first-time cases — with no accident, injury, or extremely high BAC — magistrates impose a fine, a warning, and a temporary license suspension rather than imprisonment. The 6-month jail term in Section 185 is the maximum, not a mandatory minimum. A well-prepared case (clean record, guilty plea where appropriate, procedural points raised) significantly improves the chance of a fine-only outcome. Aggravating factors like an accident, very high BAC, or rude behaviour with police increase the jail risk.',
  },
  {
    q: 'Is drink and drive a bailable offence in India?',
    a: 'Yes. A standalone Section 185 drink and drive charge (no accident or injury) is a bailable offence — you are generally released on bail and summoned to appear before a magistrate. However, if drunk driving caused an accident, injury, or death, additional charges under the BNS (formerly IPC) can apply, which may be non-bailable and far more serious. Getting legal guidance immediately is important to understand exactly what you are charged with.',
  },
  {
    q: 'Will my car or bike insurance cover an accident if I was drink driving?',
    a: 'No. Almost every motor insurance policy in India treats driving under the influence of alcohol as a standard exclusion. If you were over the legal BAC limit, the insurer can legally reject both own-damage and third-party claims, leaving you personally liable for all damages. This is one of the most expensive hidden consequences of a drink and drive case — often far more than the fine itself.',
  },
  {
    q: 'How do I get my driving license back after a drink and drive suspension?',
    a: 'Once the suspension period set by the court ends (typically 6-12 months for a first offense), you apply to the RTO/transport authority that issued the suspension. You will usually need the court order showing the case is closed, proof the fine was paid, your original license details, and identity/address documents. In some cases the court itself directs restoration as part of the final order. We help you compile the documents and follow the correct restoration process.',
  },
];

// ── Page metadata ─────────────────────────────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';
const PAGE_URL = '/drink-and-drive';
// Keyword-first and national (no geo lock) — the page should rank for anyone in
// India searching the drink-and-drive challan / Section 185 intent. Brand suffix
// "| ChallanSetu" is appended by the root layout template, so it's omitted here.
const PAGE_TITLE = 'Drink & Drive Challan: Penalty & Settlement Help';
const PAGE_DESC =
  'Got a drink & drive challan? Understand Section 185 penalties, DUI fines, Lok Adalat & legal settlement options. Free case review on WhatsApp.';
// Freshness signal — bump this whenever penalties/process content is reviewed.
const LAST_UPDATED_ISO = '2026-06-23';
const LAST_UPDATED_LABEL = 'June 2026';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}${PAGE_URL}` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: `${SITE_URL}${PAGE_URL}`,
    siteName: 'ChallanSetu',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
  keywords: [
    'drink and drive challan',
    'DUI penalty India',
    'drink driving fine',
    'section 185 motor vehicles act',
    'drink drive settlement',
    'Lok Adalat drink drive',
    'alcohol driving challan',
    'breathalyzer test',
    'drink driving case',
    'drink and drive Delhi',
    'DUI settlement India',
  ],
};

const BRAND_DARK = '#1c1c24';

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DrinkAndDrivePage() {
  return (
    <>
      {/* Structured data */}
      <JsonLd data={faqSchema(DRINK_AND_DRIVE_FAQS)} />
      <JsonLd data={serviceSchema({
        name: 'Drink & Drive Challan Settlement Support — Delhi NCR',
        description: PAGE_DESC,
        url: PAGE_URL,
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Drink & Drive Support', url: PAGE_URL }
      ])} />
      <JsonLd data={howToSchema({
        name: 'How to Handle a Drink & Drive Challan in India',
        description: 'Step-by-step guide to legally settle your drink and drive case through Lok Adalat or court proceedings.',
        steps: [
          { name: 'Share Case Details', text: 'Provide information about your drink and drive challan — when, where, and the charges. Include breathalyzer reading if available.' },
          { name: 'Legal Case Review', text: 'Our legal team reviews the challan, Section 185 charges, and identifies settlement options based on case type and court jurisdiction.' },
          { name: 'Explain Settlement Path', text: 'We explain available options: Lok Adalat (fastest, ~₹2,000-5,000), court compromise (with mutual consent), or full legal defense.' },
          { name: 'File & Follow Up', text: 'Our team handles document filing, court appearances, and follows up until the case is settled or resolved.' },
          { name: 'Case Resolution', text: 'Receive final settlement confirmation from the court. Your criminal record shows resolution/settlement status.' },
        ],
      })} />
      <JsonLd data={webPageSchema({ title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, dateModified: LAST_UPDATED_ISO })} />

      <Navbar />
      <main className="flex-1">
        <div className="relative" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>

          {/* ── Hero ─────────────────────────────────────────────────────────── */}
          <section
            id="drink-drive-hero"
            className="relative overflow-hidden text-white"
            style={{
              background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)`,
              boxShadow: 'inset 0 -40px 80px rgba(0,0,0,0.3)',
            }}
          >
            <div className="absolute inset-0 pattern-dots opacity-10" />
            <div className="absolute top-0 right-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-red-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-orange-400/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

            <div className="container-app relative">
              <div className="pt-16 pb-16 lg:pt-20 lg:pb-20 flex flex-col items-center gap-8">
                <div className="text-center max-w-2xl w-full">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.2] mb-5 px-2 lg:px-0 tracking-tight" style={{ color: '#f5c842' }}>
                    Drink & Drive Challan Settlement Support
                  </h1>
                  <p className="text-base sm:text-lg text-gray-300 mt-6 leading-relaxed max-w-xl mx-auto">
                    Expert legal guidance for Section 185 violations. Understand DUI penalties, settlement options via Lok Adalat, and protect your driving license.
                  </p>
                  <p className="text-xs text-gray-400 mt-4">
                    Updated {LAST_UPDATED_LABEL} · Reflects the Motor Vehicles (Amendment) Act, 2019
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <CTAButton
                      label="Get Free Legal Review"
                      subtitle="Via WhatsApp (5 mins)"
                      size="lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Content sheet ────────────────────────────────────────────────── */}
          <div className="relative z-10 bg-white rounded-t-3xl -mt-8">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="container-app max-w-5xl pt-6 pb-2">
              <ol className="flex items-center gap-1.5 text-xs text-gray-500">
                <li>
                  <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
                </li>
                <li aria-hidden="true" className="text-gray-300">/</li>
                <li className="font-medium text-gray-700" aria-current="page">Drink & Drive Support</li>
              </ol>
            </nav>

            {/* What is Drink & Drive */}
            <section className="pt-4 pb-8 bg-white" aria-labelledby="what-section">
              <div className="container-app max-w-3xl">
                <h2 id="what-section" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  What is Drink & Drive Challan Under Section 185?
                </h2>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    Drink and drive (DUI — Driving Under Influence) is one of the most serious traffic violations under Indian law. Under <strong>Section 185 of the Motor Vehicles Act, 1988</strong>, driving a vehicle under the influence of alcohol or drugs is a criminal offense that carries severe penalties.
                  </p>
                  <p>
                    When you are caught driving under alcohol influence, the police issues a challan with criminal charges (not just a traffic fine). This includes:
                  </p>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li><strong>First offense:</strong> ₹10,000 fine or up to 6 months imprisonment (or both)</li>
                    <li><strong>Second offense within 3 years:</strong> ₹15,000 fine or up to 2 years imprisonment (or both)</li>
                    <li><strong>License suspension:</strong> Driving license suspension for 6-12 months minimum</li>
                    <li><strong>Criminal record:</strong> Permanent criminal conviction recorded</li>
                    <li><strong>Employment impact:</strong> Affects background checks for jobs and professional licenses</li>
                  </ul>
                  <p className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <strong>⚠️ Important:</strong> Drink and drive is <strong>NOT</strong> just a traffic violation — it's a criminal case. Ignoring the challan can lead to arrest, vehicle seizure, and license cancellation.
                  </p>
                </div>
              </div>
            </section>

            {/* Penalty at a glance table */}
            <section className="py-8 bg-white" aria-labelledby="penalty-table-section">
              <div className="container-app max-w-3xl">
                <h2 id="penalty-table-section" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Drink & Drive Penalty at a Glance (2026)
                </h2>
                <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed mb-5">
                  Current penalties under Section 185 of the Motor Vehicles Act, 1988 (post-2019 amendment). The legal blood-alcohol limit is <strong>30 mg per 100 ml of blood</strong> — anything above is an offence.
                </p>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-900">
                      <tr>
                        <th className="px-4 py-3 font-bold">Offence</th>
                        <th className="px-4 py-3 font-bold">Fine</th>
                        <th className="px-4 py-3 font-bold">Imprisonment</th>
                        <th className="px-4 py-3 font-bold">Licence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-900">First offence</td>
                        <td className="px-4 py-3">Up to ₹10,000</td>
                        <td className="px-4 py-3">Up to 6 months</td>
                        <td className="px-4 py-3">Suspended 6-12 months</td>
                      </tr>
                      <tr className="bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">Repeat (within 3 years)</td>
                        <td className="px-4 py-3">Up to ₹15,000</td>
                        <td className="px-4 py-3">Up to 2 years</td>
                        <td className="px-4 py-3">Suspended 1 year+</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-900">With accident / injury</td>
                        <td className="px-4 py-3">Higher + damages</td>
                        <td className="px-4 py-3">Additional BNS charges</td>
                        <td className="px-4 py-3">May be cancelled</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  A conviction is also recorded permanently in your criminal history. A few states apply different fine amounts — we confirm the exact figure for your city before you decide anything.
                </p>
              </div>
            </section>

            {/* Why Get Help - Mid Content CTA */}
            <section className="py-8 bg-amber-100 border-l-4 border-amber-500">
              <div className="container-app max-w-3xl">
                <div className="flex gap-4 items-start">
                  <div className="text-3xl flex-shrink-0">⚠️</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Don't Ignore This Challan</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Unpaid drink and drive cases escalate to criminal charges and vehicle seizure. Get expert legal guidance immediately.
                    </p>
                    <CTAButton
                      label="Get Free Legal Review"
                      subtitle="Immediate support via WhatsApp"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Why Get Help */}
            <section className="py-8 bg-white" aria-labelledby="why-help-section">
              <div className="container-app max-w-3xl">
                <h2 id="why-help-section" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Why Expert Help for Drink & Drive Cases is Critical
                </h2>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    Drink & drive cases are complex because they involve criminal law and multiple procedural requirements:
                  </p>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li>Criminal prosecution (not just traffic penalty)</li>
                    <li>Breathalyzer/blood test accuracy challenges and procedural defenses</li>
                    <li>Court procedures, magistrate hearings, and legal documentation</li>
                    <li>License suspension appeals and reinstatement processes</li>
                    <li>Risk of imprisonment (6 months to 2 years)</li>
                    <li>Insurance implications and premium increases</li>
                  </ul>
                  <p className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                    <strong>✓ ChallanSetu helps you through:</strong>
                  </p>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li>Understanding the case against you and technical defenses</li>
                    <li>Exploring legal settlement options (Lok Adalat, court compromise)</li>
                    <li>Organizing documents and preparing defense strategy</li>
                    <li>Navigating the magistrate court process with confidence</li>
                    <li>Protecting your license, record, and employment prospects</li>
                  </ul>
                  <p className="mt-4">
                    <Link href="/motor-insurance" className="text-amber-600 hover:text-amber-700 font-medium">
                      Check your motor insurance status
                    </Link>
                    {' '}after a drink & drive case, as it impacts your eligibility and premiums.
                  </p>
                </div>
              </div>
            </section>

            {/* Settlement Options Comparison */}
            <section className="py-8 bg-white" aria-labelledby="settlement-options-section">
              <div className="container-app max-w-3xl">
                <h2 id="settlement-options-section" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  How to Settle a Drink & Drive Case: 4 Options Compared
                </h2>
                <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed mb-5">
                  There is no single &ldquo;settlement fee&rdquo; for a drink and drive case — what you pay and how it ends depends on the route you take. Here is an honest comparison of every legal path, so you can choose with open eyes.
                </p>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-900">
                      <tr>
                        <th className="px-4 py-3 font-bold">Option</th>
                        <th className="px-4 py-3 font-bold">Typical Cost</th>
                        <th className="px-4 py-3 font-bold">Timeline</th>
                        <th className="px-4 py-3 font-bold">Best For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-900">Lok Adalat settlement</td>
                        <td className="px-4 py-3">~₹2,000-5,000</td>
                        <td className="px-4 py-3">4-8 weeks</td>
                        <td className="px-4 py-3">First offence, no accident, want it over fast &amp; cheap</td>
                      </tr>
                      <tr className="bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">Court compromise / plea</td>
                        <td className="px-4 py-3">~₹3,000-8,000</td>
                        <td className="px-4 py-3">3-6 months</td>
                        <td className="px-4 py-3">Case already in court, aiming for fine-only outcome</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-900">Legal defence (contest)</td>
                        <td className="px-4 py-3">₹10,000-30,000+</td>
                        <td className="px-4 py-3">6-18 months</td>
                        <td className="px-4 py-3">Faulty breathalyzer / procedure, wrongful charge, high stakes</td>
                      </tr>
                      <tr className="bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">Pay full court fine</td>
                        <td className="px-4 py-3">Up to ₹10,000-15,000</td>
                        <td className="px-4 py-3">1-3 hearings</td>
                        <td className="px-4 py-3">Simplest, but no fine reduction &amp; full conviction recorded</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Costs shown include legal assistance plus court fees and are indicative — exact amounts depend on your city, BAC reading, and whether an accident was involved. We tell you which route realistically applies to your case <strong>before</strong> you pay anything.
                </p>
                <div className="mt-5">
                  <CTAButton label="Find My Best Settlement Option" subtitle="Free case review on WhatsApp" size="md" />
                </div>
              </div>
            </section>

            {/* Local SEO Section */}
            <section className="py-8 bg-blue-50" aria-labelledby="local-section">
              <div className="container-app max-w-3xl">
                <h2 id="local-section" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Drink & Drive Settlement Support in Delhi NCR
                </h2>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    <strong>ChallanSetu provides expert drink and drive challan settlement support across Delhi NCR:</strong>
                  </p>
                  <ul className="space-y-3 ml-4">
                    <li>
                      <strong className="text-gray-900">🏛️ Delhi Drink & Drive Cases:</strong> Section 185 violations handled through Delhi District Courts and Lok Adalats. Fastest resolution in NCR with WhatsApp support 24/7.
                    </li>
                    <li>
                      <strong className="text-gray-900">📍 Noida DUI Settlement:</strong> Cases filed in Gautam Buddha Nagar courts. Our team has expertise with Noida traffic police procedures and local magistrates.
                    </li>
                    <li>
                      <strong className="text-gray-900">🚗 Gurgaon Drink & Drive Support:</strong> Handled through Gurugram District Courts. Quick Lok Adalat settlements available. Expert guidance for Gurgaon traffic violations.
                    </li>
                    <li>
                      <strong className="text-gray-900">⚖️ Ghaziabad & Faridabad:</strong> Cases in Meerut and Faridabad district courts. Full end-to-end legal guidance and court representation available.
                    </li>
                  </ul>
                  <p className="mt-4 pt-4 border-t border-blue-200">
                    No matter which city you were caught, ChallanSetu covers the entire Delhi NCR region. WhatsApp us your case details for immediate legal review and settlement options.
                  </p>
                </div>
              </div>
            </section>

            {/* Process */}
            <section className="py-8 bg-white" aria-labelledby="process-section">
              <div className="container-app max-w-3xl">
                <h2 id="process-section" className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  How ChallanSetu Settles Your Drink & Drive Challan
                </h2>
                <div className="space-y-6">
                  {[
                    { step: '01', title: 'Share Your Case Details', desc: 'Tell us about your drink & drive case — when caught, where, BAC reading, and current status. Share the challan or FIR copy if available.' },
                    { step: '02', title: 'Legal Case Review', desc: 'Our legal team reviews the challan under Section 185, analyzes the breathalyzer procedure, and identifies technical defenses and settlement options.' },
                    { step: '03', title: 'Explain Settlement Options', desc: 'We explain all available paths: Lok Adalat (fastest, ~₹2,000-5,000), court compromise, legal defense on procedural grounds, or full trial.' },
                    { step: '04', title: 'File & Court Support', desc: 'Our team handles FIR registration, document filing, court applications, and represents you in magistrate proceedings.' },
                    { step: '05', title: 'Case Resolution', desc: 'Receive final settlement order from court. Your criminal case is officially closed/resolved with court confirmation.' },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-6">
                      <div className="flex-shrink-0">
                        <span className="text-3xl font-black text-amber-500">{item.step}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Real Case Outcomes */}
            <section className="py-8 bg-white" aria-labelledby="outcomes-section">
              <div className="container-app max-w-3xl">
                <h2 id="outcomes-section" className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Recent Drink & Drive Case Outcomes
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Anonymised real outcomes. Every case differs — these show what is realistically possible, not a guarantee.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      tag: 'First offence · Gurgaon',
                      detail: 'BAC just over limit, no accident. Resolved via Lok Adalat in ~6 weeks.',
                      result: 'Fine-only, no jail',
                    },
                    {
                      tag: 'First offence · Delhi',
                      detail: 'Breathalyzer procedure not followed correctly; raised on record.',
                      result: 'Charge contested, reduced',
                    },
                    {
                      tag: 'Repeat case · Noida',
                      detail: 'Second offence within 3 years. Mitigation + structured plea in court.',
                      result: 'Licence retained',
                    },
                  ].map((c) => (
                    <div key={c.tag} className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{c.tag}</p>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{c.detail}</p>
                      <p className="text-sm font-bold text-green-700 mt-3">✓ {c.result}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Trust Signals */}
            <section className="py-8 bg-green-50">
              <div className="container-app max-w-3xl">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Why Trust ChallanSetu</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-amber-500 mb-2">2,400+</div>
                    <p className="text-sm text-gray-600 font-medium">Cases Settled Legally</p>
                    <p className="text-xs text-gray-500 mt-1">Verified via court records</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-amber-500 mb-2">₹4.2Cr+</div>
                    <p className="text-sm text-gray-600 font-medium">Client Savings Achieved</p>
                    <p className="text-xs text-gray-500 mt-1">Average 35% reduction</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-amber-500 mb-2">5★</div>
                    <p className="text-sm text-gray-600 font-medium">Google Reviews</p>
                    <p className="text-xs text-gray-500 mt-1">1,200+ verified clients</p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="py-8 bg-white" aria-labelledby="faq-section">
              <div className="container-app max-w-3xl">
                <h2 id="faq-section" className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  Drink & Drive Challan: Common Questions
                </h2>
                <div className="space-y-4">
                  {DRINK_AND_DRIVE_FAQS.map((faq, i) => (
                    <details key={i} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <summary className="px-6 py-4 cursor-pointer font-bold text-gray-900 flex items-center justify-between bg-gray-50 group-open:bg-amber-50">
                        <span>{faq.q}</span>
                        <span className="text-amber-500 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="px-6 py-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                  <div className="text-center pt-4">
                    <Link href="/faq" className="text-amber-600 hover:text-amber-700 font-medium text-sm">
                      Have a different question? View all FAQs →
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Drink & Drive Help by City */}
            <section className="py-8 bg-white border-t border-gray-100" aria-labelledby="by-city-section">
              <div className="container-app max-w-3xl">
                <h2 id="by-city-section" className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Drink & Drive Help by City
                </h2>
                <p className="text-sm text-gray-600 mb-5">
                  Caught in a specific city? Get local court details, enforcement info, and settlement options for your case.
                </p>
                <div className="flex flex-wrap gap-3">
                  {getAllDrinkDriveCities().map((c) => (
                    <Link
                      key={c.slug}
                      href={`/drink-and-drive/${c.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium rounded-xl px-4 py-2 border border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50 transition-colors"
                    >
                      Drink &amp; Drive in {c.cityName}
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* Related Services */}
            <section className="py-8 bg-gray-50 border-t border-gray-200">
              <div className="container-app max-w-3xl">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Related Legal Services</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/motor-insurance" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
                    <h4 className="font-bold text-gray-900">Motor Insurance Status Check</h4>
                    <p className="text-sm text-gray-600 mt-1">Free insurance verification via VAHAN government database</p>
                  </Link>
                  <Link href="/how-it-works" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
                    <h4 className="font-bold text-gray-900">Lok Adalat Settlement Guide</h4>
                    <p className="text-sm text-gray-600 mt-1">How court-directed settlement works for traffic violations</p>
                  </Link>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="py-10 text-white relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>
              <div className="absolute inset-0 pattern-dots opacity-10" />
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-red-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
              <div className="container-app relative text-center">
                <h2 className="text-xl sm:text-2xl font-bold leading-none mb-4">
                  Don't Face Your Case Alone
                </h2>
                <p className="text-white/60 mb-8 max-w-lg mx-auto">
                  Get expert legal guidance for your drink and drive case. Understand your rights, options, and path to settlement.
                </p>
                <CTAButton
                  label="Talk to Legal Expert"
                  subtitle="Via WhatsApp"
                  size="lg"
                />
              </div>
            </section>

            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
