'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HOMEPAGE_FAQS, HOMEPAGE_FAQ_SUBTITLE, HOMEPAGE_FAQ_TITLE } from '@/data/homepage-faqs';

export function HomepageFaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-10 bg-white">
      <div className="container-app">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none mb-4">
            {HOMEPAGE_FAQ_TITLE}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            {HOMEPAGE_FAQ_SUBTITLE}
          </p>
        </div>

        <div className="space-y-2">
          {HOMEPAGE_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.q}
                className="rounded-xl border border-gray-100 overflow-hidden bg-surface-50"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset"
                  aria-expanded={isOpen}
                  aria-controls={`homepage-faq-answer-${index}`}
                >
                  <span>{faq.q}</span>
                  <span
                    className={`ml-4 flex-shrink-0 text-xl leading-none text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div
                  className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="min-h-0 overflow-hidden" id={`homepage-faq-answer-${index}`}>
                    <div className="px-5 pb-4 pt-1">
                      <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-xs text-gray-400">
          Need more details?{' '}
          <Link href="/faq" className="text-amber-600 hover:underline">
            Visit our full FAQ page
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
