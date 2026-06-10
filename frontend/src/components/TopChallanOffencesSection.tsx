// TopChallanOffencesSection — Server Component, no 'use client'
// Renders a semantic violations table (desktop) / stacked cards (mobile) with
// city-aware copy, visible FAQ accordion, and optional FAQPage JSON-LD.

import Link from 'next/link';
import { AlertTriangle, ArrowRight, Search } from 'lucide-react';
import { JsonLd, faqSchema } from '@/components/seo/JsonLd';
import type { CityViolation } from '@/data/city-pages';
import { OffencesList } from '@/components/OffencesList';

// ─── National fallback data ───────────────────────────────────────────────────
// Motor Vehicles (Amendment) Act 2019 standard penalty schedule.
// This is the same statutory source as the existing TrafficFinesSection component.
// Used when no city-specific violations prop is supplied.

const NATIONAL_VIOLATIONS: CityViolation[] = [
  { offence: 'Red Light Jumping', fine: '₹1,000 – ₹5,000', section: 'Sec 119 MV Act 2019' },
  { offence: 'Overspeeding (LMV)', fine: '₹1,000 – ₹2,000', section: 'Sec 183 MV Act 2019' },
  { offence: 'Using Mobile While Driving', fine: '₹1,000 – ₹5,000', section: 'Sec 184 MV Act 2019' },
  { offence: 'No Helmet (Two-Wheeler)', fine: '₹1,000', section: 'Sec 129 MV Act 2019' },
  { offence: 'No Seatbelt', fine: '₹1,000', section: 'Sec 194B MV Act 2019' },
  { offence: 'Driving Under Influence', fine: '₹10,000', section: 'Sec 185 MV Act 2019' },
  { offence: 'Driving Without Licence', fine: '₹5,000', section: 'Sec 181 MV Act 2019' },
  { offence: 'Driving Without Insurance', fine: '₹2,000 – ₹4,000', section: 'Sec 196 MV Act 2019' },
  { offence: 'Wrong Parking / Obstruction', fine: '₹500 – ₹1,000', section: 'Sec 122 MV Act 2019' },
  { offence: 'Driving Without RC', fine: '₹5,000', section: 'Sec 192 MV Act 2019' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TopChallanOffencesSectionProps {
  /** City-specific violations from city-pages.ts, or omit to use national data. */
  violations?: CityViolation[];
  /** e.g. "Delhi". Drives dynamic copy and FAQ answers. */
  cityName?: string;
  /** e.g. "Delhi" / "Uttar Pradesh". Appended to heading when present. */
  stateName?: string;
  /** e.g. "Delhi Traffic Police". Used in disclaimer and FAQ copy. */
  authority?: string;
  /**
   * Emit a FAQPage JSON-LD block.
   * Set false when the host page already has its own FAQPage schema
   * (e.g. city pages that call cityPageSchemas()).
   */
  showFaqSchema?: boolean;
  showFaq?: boolean;
  showCta?: boolean;
  /** Override the auto-generated section heading. */
  title?: string;
  /** Override the auto-generated intro paragraph. */
  intro?: string;
}

// ─── FAQ builder ──────────────────────────────────────────────────────────────
// Answers are derived from the actual violations array so the copy is
// data-driven — not invented. E.g. the overspeeding fine is read from the
// violations list, not hardcoded in the FAQ text.

function buildFaqs(
  violations: CityViolation[],
  city: string,
  auth: string,
): { q: string; a: string }[] {
  const speedEntry = violations.find((v) => /overspeed|speed/i.test(v.offence));
  const speedFine = speedEntry?.fine?.trim() ?? '₹1,000 – ₹2,000';

  const topNames = violations
    .slice(0, 5)
    .map((v) => (v.offence?.trim() || '').toLowerCase())
    .filter(Boolean)
    .join(', ');

  const isNational = city === 'India';

  return [
    {
      q: `What are the most common traffic challan offences${isNational ? ' in India' : ` in ${city}`}?`,
      a: `The most common traffic challan offences${isNational ? ' in India' : ` in ${city}`} include ${topNames || 'overspeeding, red light jumping, and mobile phone use while driving'}. These violations are regularly enforced by ${auth} through traffic cameras, AI surveillance, and road-side checks.`,
    },
    {
      q: `How much is the fine for overspeeding${isNational ? '' : ` in ${city}`}?`,
      a: `The fine for overspeeding is ${speedFine} under the Motor Vehicles Act, 2019. On expressways or national highways, penalties can be higher. Repeat offenders may also face licence suspension in addition to the monetary challan.`,
    },
    {
      q: 'Can a traffic challan penalty amount vary by case?',
      a: 'Yes. Challan amounts can vary depending on your vehicle type (two-wheeler vs four-wheeler vs commercial vehicle), whether it is a first or repeat offence, and whether the challan is an e-challan or a court summons. Always check the exact amount on your challan notice before paying.',
    },
    {
      q: `How can I get help with my traffic challan${isNational ? '' : ` in ${city}`}?`,
      a: `Submit your vehicle number on ChallanSetu to start a challan assistance request${isNational ? '' : ` for ${city}`}. Our team then reviews whether your challan may qualify for settlement support or a discount option.`,
    },
    {
      q: 'Can I pay my traffic challan online through ChallanSetu?',
      a: `Yes. Start by submitting your vehicle number on ChallanSetu. We verify the challan details and share the best available discount option, which can go up to 50% depending on the case. No office visits or court appearances required to start.`,
    },
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TopChallanOffencesSection({
  violations: rawViolations,
  cityName,
  stateName,
  authority,
  showFaqSchema = true,
  showFaq = true,
  showCta = true,
  title,
  intro,
}: TopChallanOffencesSectionProps) {
  // Resolve violations — city-supplied or national fallback. Cap at 10 rows.
  const violations = (
    Array.isArray(rawViolations) && rawViolations.length > 0
      ? rawViolations
      : NATIONAL_VIOLATIONS
  )
    .filter((v) => v && typeof v.offence === 'string' && v.offence.trim())
    .slice(0, 10);

  // If somehow still empty after sanitisation, bail silently.
  if (violations.length === 0) return null;

  const city = cityName?.trim() || 'India';
  const auth = authority?.trim() || 'traffic police';
  const location = stateName?.trim()
    ? `${city}, ${stateName.trim()}`
    : city;
  const isNational = !cityName;

  const sectionTitle =
    title?.trim() ||
    (isNational
      ? 'Beware of Heavy Challan Penalties in India'
      : `Beware of Heavy Challan Penalties in ${location}`);

  const sectionIntro =
    intro?.trim() ||
    (isNational
      ? 'Traffic fines have increased significantly under the amended Motor Vehicles Act. Unpaid challans can lead to vehicle seizure or court summons. Settle them immediately to avoid massive penalties.'
      : `Traffic fines in ${city} have increased significantly under the amended Motor Vehicles Act. Unpaid challans can lead to vehicle seizure or court summons. Settle them immediately to avoid massive penalties.`);

  const faqs = buildFaqs(violations, city, auth);

  return (
    <section
      aria-labelledby="top-offences-heading"
      className="py-10 bg-white"
    >
      <div className="container-app">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h2
            id="top-offences-heading"
            className="text-xl sm:text-2xl font-bold text-gray-900 leading-none mb-4"
          >
            {sectionTitle}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            {sectionIntro}
          </p>
        </div>

        <OffencesList violations={violations} />

        {/* ── Disclaimer ──────────────────────────────────────────────────── */}
        <div className="flex items-start gap-2 mt-4">
          <AlertTriangle
            className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Fine amounts are indicative and based on the Motor Vehicles (Amendment) Act 2019.
            Actual amounts may vary by vehicle category, offence history, or state-specific rules.
            {authority ? ` Verify current amounts with ${auth} before payment.` : ''}
          </p>
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        {showCta && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-gray-900 shadow-sm transition-all hover:-translate-y-0.5"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Check Eligibility Now
            </Link>
            <Link
              href="/"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-sm font-bold text-gray-800 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md hover:border-gray-300"
            >
              See How You Can Save
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        {/* Content inside <details> is in the DOM and indexable by Google
            even when collapsed. All 5 FAQs are present in the HTML at load. */}
        {showFaq && (
        <div className="mt-12 border-t border-gray-100 pt-10">
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            {isNational
              ? 'Common Questions About Traffic Challan Fines'
              : `Common Questions About Traffic Challan Fines in ${city}`}
          </h3>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-gray-100 overflow-hidden bg-surface-50"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset">
                  <span>{faq.q}</span>
                  <span
                    className="ml-4 flex-shrink-0 text-xl leading-none text-gray-400 transition-transform duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 pt-1">
                  <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>

          <p className="mt-5 text-xs text-gray-400">
            Have more questions?{' '}
            <Link href="/faq" className="text-amber-600 hover:underline">
              Visit our full FAQ page
            </Link>
            .
          </p>
        </div>
        )}

      </div>

      {/* FAQPage JSON-LD — only emitted when showFaqSchema is true.
          Set showFaqSchema={false} on pages that already emit their own FAQPage schema. */}
      {showFaq && showFaqSchema && <JsonLd data={faqSchema(faqs)} />}
    </section>
  );
}
