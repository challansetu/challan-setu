// Car-specific FAQs — unique to /car-insurance (NOT shared with /motor-insurance)
// so the two pages target different long-tail queries and don't duplicate content.
// Single source of truth: rendered on-page AND fed to the FAQPage JSON-LD.
import type { Faq } from '../motor-insurance/faqs';

export const CAR_FAQS: Faq[] = [
  {
    q: 'How do I check my car insurance status by registration number?',
    a: 'Enter your car\'s registration number (for example DL3CAB1234) in the box above and tap "Check Status". We look it up against the VAHAN government database and instantly show whether your car insurance is active, expiring soon, or already expired — no policy paperwork needed.',
  },
  {
    q: 'Can I find out if a car is insured using only the number plate?',
    a: 'Yes. Because every car in India is linked to its insurance record in VAHAN, the registration (number plate) is enough to check the current insurance status. This is useful when buying a used car or verifying a vehicle before a transaction.',
  },
  {
    q: 'Is third-party car insurance enough, or do I need comprehensive?',
    a: 'Third-party car insurance is the legal minimum and only covers damage you cause to others. Comprehensive car insurance also covers your own car against accidents, theft, fire, and natural disasters, and lets you add covers like zero-depreciation. For most owners of a financed or newer car, comprehensive is strongly recommended.',
  },
  {
    q: 'What is IDV in car insurance?',
    a: 'IDV (Insured Declared Value) is the current market value of your car and the maximum amount the insurer will pay if it is stolen or written off. IDV falls each year as your car depreciates, which is also why comprehensive premiums usually reduce as the car ages.',
  },
  {
    q: 'What is zero-depreciation cover for a car?',
    a: 'Zero-depreciation (or "bumper-to-bumper") is an add-on that ignores depreciation on parts during a claim, so you get the full cost of replaced parts instead of a depreciated amount. It is most worthwhile for cars under about 5 years old.',
  },
  {
    q: 'What happens if I drive my car with expired insurance in India?',
    a: 'Driving an uninsured car is an offence under the Motor Vehicles Act. You can be fined ₹2,000 (and more for repeat offences), and any accident liability falls entirely on you. If the policy stays lapsed beyond 90 days you also lose your accumulated No Claim Bonus.',
  },
  {
    q: 'How can I save on my car insurance renewal?',
    a: 'Renew before the policy expires to protect your No Claim Bonus (up to a 50% discount), compare quotes across insurers, choose only the add-ons you need, and avoid letting the policy lapse beyond 90 days. Our tool shows your status first, then connects you to partner quotes for renewal.',
  },
  {
    q: 'Can I check car insurance status for a used or second-hand car?',
    a: 'Yes. Enter the used car\'s registration number to see its current insurance status before you buy. After purchase, remember to transfer the insurance policy into your name, along with the registration certificate (RC).',
  },
];
