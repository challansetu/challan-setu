// Commercial-vehicle-specific FAQs, unique to /commercial-vehicle-insurance so
// the page targets fleet/taxi/truck queries and does not duplicate the car or
// bike pages. Single source of truth: rendered on-page AND fed to FAQPage JSON-LD.
import type { Faq } from '../motor-insurance/faqs';

export const COMMERCIAL_FAQS: Faq[] = [
  {
    q: 'How do I check commercial vehicle insurance status by registration number?',
    a: 'Enter your commercial vehicle registration number (for example DL1LAB1234) in the box above and tap "Check Status". We look it up against the VAHAN government database and instantly show whether the insurance is active, expiring soon, or expired, for trucks, taxis, buses, autos and goods carriers.',
  },
  {
    q: 'How much does commercial vehicle insurance cost in India?',
    a: 'Commercial vehicle insurance starts from around ₹3,139/year for small goods carriers and autos. Premiums depend on the vehicle type, gross vehicle weight, seating or load capacity, route permit, and the IDV. Trucks and buses cost more than taxis and three-wheelers. Compare quotes via our PolicyBazaar partner to find the lowest rate for your vehicle category.',
  },
  {
    q: 'Is commercial vehicle insurance different from private car insurance?',
    a: 'Yes. Commercial vehicle insurance is a separate category covering vehicles used for business or hire, such as taxis, trucks, buses, tempos, and delivery vans. It includes higher third-party liability limits and can add covers for the driver, cleaner, goods in transit, and passengers. A private car policy is not valid for a vehicle used commercially.',
  },
  {
    q: 'What does commercial vehicle insurance cover?',
    a: 'A comprehensive commercial vehicle policy covers third-party injury and property damage, plus own-damage to your vehicle from accidents, fire, theft, and natural disasters. You can add covers for the paid driver and cleaner, legal liability to passengers, goods carried in transit, and roadside assistance. Third-party-only policies cover just the legally mandated minimum.',
  },
  {
    q: 'What happens if I run a commercial vehicle with expired insurance?',
    a: 'Operating a commercial vehicle without valid insurance is a serious offence under the Motor Vehicles Act. You face a fine of ₹2,000 for the first offence and ₹4,000 for repeat offences, possible imprisonment, and seizure of the vehicle. For a business, an uninsured accident can mean lakhs in liability and a suspended permit. Renew before expiry to stay compliant.',
  },
  {
    q: 'Can I insure a fleet of commercial vehicles together?',
    a: 'Yes. Fleet insurance lets you cover multiple commercial vehicles under a single policy with one renewal date and often a bulk discount. This is ideal for taxi operators, logistics companies, and delivery fleets. Compare fleet quotes via our PolicyBazaar partner and manage all vehicles under one plan.',
  },
  {
    q: 'Does commercial vehicle insurance cover the goods being carried?',
    a: 'Only if you add a goods-in-transit cover or buy a dedicated carrier policy. A standard commercial vehicle policy covers the vehicle and third-party liability, not the cargo value. Logistics operators and goods carriers should add this cover to protect against damage or loss of transported goods.',
  },
  {
    q: 'How do I renew commercial vehicle insurance online?',
    a: 'Enter your vehicle number above to check the current status, then compare renewal quotes from 20+ insurers via our PolicyBazaar partner. Keep your registration certificate, route permit, fitness certificate, and previous policy ready. Renewing before expiry avoids a lapse, protects your No Claim Bonus, and keeps your permit valid.',
  },
];
