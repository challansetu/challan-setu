'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How can I check my vehicle insurance status online?',
    a: 'Enter your vehicle registration number (like DL7SBY1234) in the search box above and click "Check Status". We verify your insurance against the VAHAN government database and instantly show you whether your policy is active, expiring soon, or expired.',
  },
  {
    q: 'Is motor insurance mandatory in India?',
    a: 'Yes. Under the Motor Vehicles Act 1988, every vehicle on Indian roads must have at least a valid Third-Party Liability insurance policy. Driving without insurance is a punishable offence with a fine of up to ₹2,000 and/or imprisonment for up to 3 months for a first offence.',
  },
  {
    q: 'What is the difference between Comprehensive and Third-Party insurance?',
    a: 'Third-Party insurance only covers damage or injury caused to another person, vehicle, or property. It is the legal minimum. Comprehensive insurance additionally covers damage to your own vehicle from accidents, theft, fire, natural disasters, and more. Comprehensive offers much broader protection.',
  },
  {
    q: 'What happens if I let my motor insurance expire?',
    a: 'If your insurance expires, you lose legal coverage immediately. You may face a ₹2,000 fine if caught driving. More importantly, if you are involved in an accident, all financial liability falls on you personally. If your policy lapses beyond 90 days, you also lose your No Claim Bonus (NCB) benefit.',
  },
  {
    q: 'What is No Claim Bonus (NCB) and how does it work?',
    a: 'NCB is a discount on your renewal premium for every claim-free year. It starts at 20% after 1 year and grows up to 50% after 5 consecutive claim-free years. If you let your policy lapse for more than 90 days, you lose the accumulated NCB. This makes timely renewal financially important.',
  },
  {
    q: 'Does motor insurance cover commercial vehicles?',
    a: 'Yes. Commercial vehicle insurance (for trucks, buses, taxis, goods carriers, etc.) is a separate category from private car or two-wheeler insurance. Our tool checks insurance status for all vehicle types registered in VAHAN — including private cars, two-wheelers, and commercial vehicles.',
  },
  {
    q: 'Can I renew motor insurance online after it expires?',
    a: 'Yes, you can renew expired motor insurance online through an insurer\'s website or via comparison platforms like PolicyBazaar or Acko. However, if the policy has been expired for more than 90 days, the insurer may require a vehicle inspection before issuing a new policy.',
  },
  {
    q: 'What documents do I need to buy or renew motor insurance?',
    a: 'You typically need your vehicle registration certificate (RC), your Aadhaar card or other ID, your driving licence, the previous policy document (for renewals), and passport-size photographs. For commercial vehicles, additional documents like permits or fitness certificates may be required.',
  },
];

export function InsuranceFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="pt-8 pb-8 bg-white" aria-labelledby="faq-heading">
      <div className="container-app max-w-5xl">
        <div className="mb-8">
          <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => {
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
