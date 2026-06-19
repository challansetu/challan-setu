'use client';

import { AlertTriangle, ArrowRight, CheckCircle, Scale } from 'lucide-react';
import Link from 'next/link';
import { ViolationTypeContent } from '@/data/violation-types';

const BRAND_DARK = '#1c1c24';
const BRAND_YELLOW = '#f5c842';
const BRAND_RED = '#ef4444';

export interface ViolationTypeSectionProps {
  content: ViolationTypeContent;
  cityName: string;
  formId: string;
}

export function ViolationTypeSection({
  content,
  cityName,
  formId,
}: ViolationTypeSectionProps) {
  return (
    <>
      {/* ── Hero Alert Section ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-red-50 to-orange-50 border-t border-b border-red-100 py-8 sm:py-12">
        <div className="container-app">
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="p-2.5 rounded-lg bg-red-100 flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-900 mb-2">{content.heroBadge}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {content.heroHeading}
              </h2>
              <p className="text-gray-700 text-base leading-relaxed mb-5">
                {content.heroSubheading}
              </p>
              <a
                href={`#${formId}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5 shadow-md"
                style={{ background: BRAND_YELLOW, color: BRAND_DARK }}
              >
                {content.ctaButton}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Is Section ────────────────────────────────────────────── */}
      <section className="py-12 sm:py-14">
        <div className="container-app max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{content.whatIsHeading}</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-4 text-gray-600 text-sm leading-relaxed shadow-sm">
            {content.whatIsParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Penalties Section ──────────────────────────────────────────── */}
      <section className="py-12 sm:py-14 bg-white border-y border-gray-100">
        <div className="container-app max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{content.penaltiesHeading}</h2>
          <div className="space-y-3">
            {content.penalties.map((penalty, i) => (
              <div
                key={i}
                className="bg-red-50 rounded-xl border border-red-100 p-5 flex gap-4 shadow-sm"
              >
                <div className="p-2 rounded-lg bg-red-100 flex-shrink-0 h-fit">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1 text-sm">{penalty.label}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{penalty.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">Why This Matters:</span> {content.whyHelpNeeded}
            </p>
          </div>
        </div>
      </section>

      {/* ── Process Section ────────────────────────────────────────────── */}
      <section className="py-12 sm:py-14">
        <div className="container-app max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{content.processHeading}</h2>
          <div className="space-y-4">
            {content.processSteps.map((step, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4 shadow-sm">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: BRAND_DARK, color: BRAND_YELLOW }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1 text-sm">{step.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-100 flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">Important:</span> Every drink-and-drive case is unique. Court outcomes depend on case facts, jurisdiction, and available legal defense. We provide expert guidance through the proper legal process.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQs Section ──────────────────────────────────────────────── */}
      <section className="py-12 sm:py-14 bg-white">
        <div className="container-app max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{content.faqHeading}</h2>
          <div className="space-y-3">
            {content.faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-surface-50 rounded-xl border border-gray-100 overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors list-none">
                  <span>{faq.q}</span>
                  <span className="ml-4 text-gray-400 flex-shrink-0 group-open:rotate-45 transition-transform duration-200 text-xl leading-none">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 pt-1">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────────────── */}
      <section
        className="py-12 relative overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)` }}
      >
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="container-app text-center relative">
          <div className="flex justify-center mb-4">
            <Scale className="w-8 h-8" style={{ color: BRAND_YELLOW }} />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: BRAND_YELLOW }}>
            {content.ctaHeading}
          </h2>
          <p className="text-white/60 mb-7 max-w-2xl mx-auto">{content.ctaSubtext}</p>
          <a
            href={`#${formId}`}
            className="inline-flex w-full max-w-md mx-auto justify-center items-center gap-2 font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg"
            style={{ background: BRAND_YELLOW, color: BRAND_DARK }}
          >
            {content.ctaButton}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </>
  );
}
