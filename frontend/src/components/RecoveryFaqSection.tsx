'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { RECOVERY_FAQS } from '@/data/recovery-faqs';

export function RecoveryFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-10 bg-white">
      <div className="container-app max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-10 h-0.5 rounded-full bg-primary-300" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Common Questions
          </h2>
          <span className="w-10 h-0.5 rounded-full bg-primary-300" />
        </div>

        <div className="space-y-2">
          {RECOVERY_FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-xl border border-gray-100 overflow-hidden bg-surface-50"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-gray-900 leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`flex-shrink-0 w-4 h-4 text-primary-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
