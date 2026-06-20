// Bike/two-wheeler-specific FAQs, unique to /bike-insurance (NOT shared with
// /motor-insurance or /car-insurance) so each page targets different long-tail
// queries and avoids duplicate content. Single source of truth: rendered on-page
// AND fed to the FAQPage JSON-LD.
import type { Faq } from '../motor-insurance/faqs';

export const BIKE_FAQS: Faq[] = [
  {
    q: 'How do I check my bike insurance status by registration number?',
    a: 'Enter your two-wheeler registration number (for example DL8SAB1234) in the box above and tap "Check Status". We look it up against the VAHAN government database and instantly show whether your bike insurance is active, expiring soon, or already expired, no policy paperwork needed.',
  },
  {
    q: 'How much does two-wheeler insurance cost in India?',
    a: 'Two-wheeler insurance is very affordable. Third-party bike insurance is government-fixed, starting from around ₹538/year for bikes up to 75cc and ₹714/year for 75-150cc. Comprehensive bike insurance starts from roughly ₹1.3/day (about ₹500-1,200/year) depending on the bike\'s cc, age, and IDV. Compare quotes via our PolicyBazaar partner to get the lowest price.',
  },
  {
    q: 'Is third-party bike insurance enough or do I need comprehensive?',
    a: 'Third-party two-wheeler insurance is the legal minimum and only covers damage you cause to others. Comprehensive bike insurance also covers your own bike against accidents, theft, fire, and natural disasters. Since two-wheelers are highly prone to theft and accident damage, comprehensive cover is strongly recommended, and it costs very little extra.',
  },
  {
    q: 'What happens if I ride my bike with expired insurance in India?',
    a: 'Riding an uninsured two-wheeler is an offence under the Motor Vehicles Act. You can be fined ₹2,000 for the first offence and ₹4,000 for repeat offences, plus possible imprisonment up to 3 months. Any accident liability falls entirely on you. If the policy stays lapsed beyond 90 days you also lose your accumulated No Claim Bonus.',
  },
  {
    q: 'Can I renew expired bike insurance online?',
    a: 'Yes. You can renew expired two-wheeler insurance online in minutes. If the policy has lapsed for less than 90 days, no inspection is needed. Beyond 90 days, the insurer may require a quick self-inspection via app. Renewing online is the fastest way and often 30-50% cheaper than agent-based renewal.',
  },
  {
    q: 'What is a long-term bike insurance policy?',
    a: 'Long-term two-wheeler insurance lets you buy third-party cover for 5 years or comprehensive for 2-3 years in one go. Benefits: you avoid yearly renewal hassle, lock in the premium rate against annual hikes, and never risk an accidental lapse. New bikes since 2018 are required to have a 5-year third-party policy at purchase.',
  },
  {
    q: 'Does bike insurance cover theft?',
    a: 'Only comprehensive two-wheeler insurance covers theft, third-party insurance does not. Given that two-wheelers are among the most stolen vehicles in India, theft cover (included in comprehensive policies) is highly valuable. On a successful theft claim, you receive the bike\'s IDV (Insured Declared Value) after the insurer\'s verification.',
  },
  {
    q: 'Can I check bike insurance status for a used or second-hand two-wheeler?',
    a: 'Yes. Enter the used bike\'s registration number to see its current insurance status before buying. After purchase, remember to transfer the insurance policy into your name along with the registration certificate (RC). The previous owner\'s No Claim Bonus does not transfer to you.',
  },
];
