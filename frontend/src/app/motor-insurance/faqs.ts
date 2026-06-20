// Single source of truth for the motor-insurance FAQs.
// Imported by InsuranceFaqSection (client, renders them on-page) AND by
// page.tsx (server, feeds the FAQPage JSON-LD) so visible FAQs and structured
// data can never drift apart. Kept in a plain module (no 'use client') so the
// server component can safely map over it.
export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
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
    a: 'Yes. Commercial vehicle insurance (for trucks, buses, taxis, goods carriers, etc.) is a separate category from private car or two-wheeler insurance. Our tool checks insurance status for all vehicle types registered in VAHAN, including private cars, two-wheelers, and commercial vehicles.',
  },
  {
    q: 'Can I renew motor insurance online after it expires?',
    a: "Yes, you can renew expired motor insurance online through an insurer's website or via comparison platforms like PolicyBazaar or Acko. However, if the policy has been expired for more than 90 days, the insurer may require a vehicle inspection before issuing a new policy.",
  },
  {
    q: 'What documents do I need to buy or renew motor insurance?',
    a: 'You typically need your vehicle registration certificate (RC), your Aadhaar card or other ID, your driving licence, the previous policy document (for renewals), and passport-size photographs. For commercial vehicles, additional documents like permits or fitness certificates may be required.',
  },
  {
    q: 'How much does motor insurance cost in India?',
    a: 'Motor insurance cost depends on vehicle type, age, and coverage. Third-party car insurance starts from ₹2,094/year (government fixed rate for small cars). Comprehensive insurance starts from ₹3,500-5,000/year for small cars. Two-wheeler insurance starts from ₹1.3/day (₹500/year for basic). Use our free VAHAN check + PolicyBazaar comparison to get the best price for your vehicle.',
  },
  {
    q: 'Can I insure a vehicle with expired insurance?',
    a: 'Yes. You can renew expired motor insurance online. However, if the policy has lapsed for more than 90 days, an insurer may require a fresh vehicle inspection before issuing the policy. Renewing online within 90 days of expiry is the fastest and cheapest option, no inspection needed.',
  },
  {
    q: 'Is it safe to buy motor insurance online in India?',
    a: 'Yes. Buying motor insurance online through IRDA-approved comparison platforms like PolicyBazaar is completely safe and legally valid. You get instant digital policy issuance, the same coverage as offline purchase, and often 30-85% lower premiums due to no agent commission. ChallanSetu partners with PolicyBazaar for verified, trusted renewals.',
  },
  {
    q: 'How to claim motor insurance after an accident?',
    a: 'To claim motor insurance: (1) Inform your insurer immediately after the accident. (2) File an FIR if required (for third-party claims or theft). (3) Take photos of damage. (4) Take the vehicle to a network garage for cashless claims, or any garage for reimbursement claims. (5) Submit claim form with documents. Most comprehensive policies offer 24×7 roadside assistance and cashless claims at 5,000+ network garages.',
  },
  {
    q: 'What is the penalty for driving without motor insurance in India?',
    a: 'Driving without valid insurance in India is a punishable offence under Section 196 of the Motor Vehicles Act. Penalty: ₹2,000 fine for first offence, ₹4,000 for repeat offence. Additionally, you may face imprisonment of up to 3 months. If involved in an accident without insurance, all financial liability, including third-party injury costs, falls entirely on you.',
  },
  {
    q: 'What is IDV in motor insurance?',
    a: 'IDV (Insured Declared Value) is the maximum amount your insurer pays if your vehicle is stolen or completely damaged (total loss). IDV is calculated as: Current market value of vehicle minus depreciation. Higher IDV = higher premium but better coverage. When comparing insurance plans, always check the IDV offered, a lower premium plan may have a lower IDV, reducing your payout in case of total loss.',
  },
  {
    q: 'Can I transfer motor insurance when selling my vehicle?',
    a: 'Yes. Motor insurance can be transferred to the new owner when selling a vehicle. The seller must inform the insurer within 14 days of sale. Third-party insurance transfers automatically with the vehicle ownership. Comprehensive insurance requires a formal transfer request. NCB (No Claim Bonus) stays with the original owner, the seller can request an NCB certificate to use for their new vehicle.',
  },
];
