'use client';

import { AlertTriangle, ArrowRight, CheckCircle, Scale, Shield, Clock, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { ViolationTypeContent } from '@/data/violation-types';

const BRAND_DARK = '#1c1c24';
const BRAND_YELLOW = '#f5c842';

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
      {/* ── Premium Hero Section ─────────────────────────────────────────── */}
      <section className="py-8 sm:py-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container-app relative z-10">
          <div className="max-w-4xl">
            <div className="mb-2">
              <span className="text-base font-bold text-amber-300">{content.heroBadge}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 leading-tight">
              {content.heroHeading}
            </h2>

            <p className="text-lg sm:text-xl text-slate-200 mb-5 leading-relaxed max-w-2xl">
              {content.heroSubheading}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-sm text-slate-300">Severe Penalties</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm text-slate-300">6-12 Month Process</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                <FileCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm text-slate-300">Legal Options</span>
              </div>
            </div>

            <a
              href={`#${formId}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              style={{ background: BRAND_YELLOW, color: BRAND_DARK }}
            >
              {content.ctaButton}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Penalties Section ──────────────────────────────────────────── */}
      <section className="py-6 sm:py-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="container-app max-w-4xl">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{content.penaltiesHeading}</h2>
            <p className="text-sm text-gray-600">Understand the serious consequences you face</p>
          </div>

          <div className="space-y-3 mb-6">
            {content.penalties.map((penalty, i) => (
              <div
                key={i}
                className="group relative rounded-lg border border-gray-200 p-4 hover:border-amber-400 transition-all hover:shadow-md hover:bg-white cursor-default"
              >
                <div className="absolute top-0 left-0 w-0.5 h-8 bg-amber-400 rounded-tl-lg" />

                <div className="flex items-start gap-3 ml-1">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{penalty.label}</p>
                    <p className="text-xs text-gray-600 leading-relaxed mt-0.5">{penalty.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200/30 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <p className="font-bold text-gray-900 mb-2 text-lg">Why Professional Help Matters</p>
              <p className="text-gray-700 leading-relaxed">{content.whyHelpNeeded}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process Section ────────────────────────────────────────────── */}
      <section className="py-6 sm:py-8">
        <div className="container-app max-w-4xl">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{content.processHeading}</h2>
            <p className="text-sm text-gray-600">Clear, step-by-step legal support from start to finish</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-gray-200" />

            <div className="space-y-4">
              {content.processSteps.map((step, i) => (
                <div key={i} className="flex gap-4 relative z-10">
                  <div className="flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-4 border-white"
                      style={{ background: BRAND_DARK }}
                    >
                      {i + 1}
                    </div>
                  </div>

                  <div className="pt-1 pb-0">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-all hover:shadow-md">
                      <h3 className="font-bold text-gray-900 mb-1 text-base">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50/50 p-8">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-gray-900 mb-2">Important to Know</p>
                <p className="text-gray-700 leading-relaxed">
                  Every drink-and-drive case is unique. Court outcomes depend on case facts, jurisdiction, and available legal defense. We provide expert guidance through the proper legal process, but cannot guarantee specific results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs Section ──────────────────────────────────────────────── */}
      <section className="py-6 sm:py-8 bg-gradient-to-b from-white to-slate-50">
        <div className="container-app max-w-4xl">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{content.faqHeading}</h2>
            <p className="text-sm text-gray-600">Answers to common questions about drink-and-drive cases</p>
          </div>

          <div className="space-y-2 mb-6">
            {content.faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-all hover:shadow-sm"
              >
                <summary className="flex items-center justify-between cursor-pointer px-4 py-3 font-semibold text-gray-900 hover:bg-slate-50 transition-colors list-none">
                  <span className="text-sm">{faq.q}</span>
                  <span
                    className="ml-3 text-gray-400 flex-shrink-0 group-open:rotate-45 transition-transform duration-300 text-xl leading-none font-light"
                    style={{ color: BRAND_YELLOW }}
                  >
                    +
                  </span>
                </summary>
                <div className="px-4 pb-3 pt-1 border-t border-gray-100 bg-slate-50/50">
                  <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>

          <p className="text-base text-gray-600">
            More questions?{' '}
            <Link href="/faq" className="font-semibold" style={{ color: BRAND_YELLOW }}>
              Visit our full FAQ page →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Final CTA Section ──────────────────────────────────────────── */}
      <section className="py-8 sm:py-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container-app max-w-2xl text-center relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-amber-500/50 mb-4">
            <Scale className="w-7 h-7" style={{ color: BRAND_YELLOW }} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{content.ctaHeading}</h2>
          <p className="text-base text-slate-300 mb-5 leading-relaxed">{content.ctaSubtext}</p>

          <a
            href={`#${formId}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl w-full max-w-sm"
            style={{ background: BRAND_YELLOW, color: BRAND_DARK }}
          >
            {content.ctaButton}
            <ArrowRight className="w-4 h-4" />
          </a>

          <p className="text-xs text-slate-400 mt-3">
            ✓ Free consultation • ✓ No payment required to start • ✓ Confidential
          </p>
        </div>
      </section>
    </>
  );
}
