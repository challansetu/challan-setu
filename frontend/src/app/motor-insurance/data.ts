import { Banknote, ShieldAlert, FileText, BadgePercent, AlertTriangle, History, Gauge, MapPin, Wrench, type LucideIcon } from 'lucide-react';

// ── Brand tokens ─────────────────────────────────────────────────────────────
export const BRAND_DARK = '#1c1c24';
export const BRAND_YELLOW = '#f5c842';
export const BRAND_BLUE = '#0065FF';

// ── Types ────────────────────────────────────────────────────────────────────
export type UrgencyFact = {
  icon: LucideIcon;
  tag: string;
  value: string;
  desc: string;
  iconColor: string;
  tagColor: string;
};

export type CoverageRow = { label: string; comp: boolean; tp: boolean };
export type NcbSlab = { years: string; discount: string };
export type PremiumFactor = { icon: LucideIcon; title: string; desc: string };
export type LapseRisk = { title: string; desc: string; icon: LucideIcon };
export type VehicleType = { src: string; label: string; sub: string };
export type HowItWorksStep = { step: string; title: string; desc: string };

// ── Data ─────────────────────────────────────────────────────────────────────
export const URGENCY_FACTS: UrgencyFact[] = [
  {
    icon: Banknote,
    tag: 'MVA Section 196',
    value: '₹2,000 Fine',
    desc: 'Driving without valid insurance attracts a fine up to ₹2,000 for the first offence under the Motor Vehicles Act.',
    iconColor: '#DC2626',
    tagColor: '#DC2626',
  },
  {
    icon: ShieldAlert,
    tag: 'Claim Risk',
    value: 'No Claim Payout',
    desc: 'If you meet with an accident with an expired policy, your insurer can reject the claim, leaving you fully liable.',
    iconColor: '#EA580C',
    tagColor: '#EA580C',
  },
  {
    icon: FileText,
    tag: 'Legal Risk',
    value: 'RC May Get Flagged',
    desc: 'An expired insurance can result in your vehicle RC being flagged in traffic databases, leading to further penalties.',
    iconColor: '#2563EB',
    tagColor: '#2563EB',
  },
];

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: '01',
    title: 'Enter Vehicle Number',
    desc: 'Type your registration number exactly as on your RC e.g. DL7SBY1234. Works for all states and vehicle types.',
  },
  {
    step: '02',
    title: 'Instant VAHAN Lookup',
    desc: "We securely query the Government of India's VAHAN database to fetch your vehicle's current insurance record.",
  },
  {
    step: '03',
    title: 'See Status & Next Steps',
    desc: 'View insurance status, expiry date, and get personalised renewal guidance if your policy is expiring or lapsed.',
  },
];

export const VEHICLE_TYPES: VehicleType[] = [
  { src: '/icons/car_white.svg', label: 'Cars', sub: 'Private & Commercial' },
  { src: '/icons/two_wheeler_white.svg', label: 'Two-Wheelers', sub: 'Bikes & Scooters' },
  { src: '/icons/commercial_white.svg', label: 'Commercial', sub: 'Trucks & Buses' },
  { src: '/icons/three_wheeler_white.svg', label: 'Three-Wheelers', sub: 'Auto-Rickshaws' },
];

export const COVERAGE_ROWS: CoverageRow[] = [
  { label: 'Damage to own vehicle', comp: true, tp: false },
  { label: 'Theft coverage', comp: true, tp: false },
  { label: 'Fire & natural disasters', comp: true, tp: false },
  { label: 'Third-party property damage', comp: true, tp: true },
  { label: 'Third-party injury/death', comp: true, tp: true },
  { label: 'Personal accident cover', comp: true, tp: false },
  { label: 'No Claim Bonus benefit', comp: true, tp: false },
  { label: 'Legally mandatory (India)', comp: false, tp: true },
];

export const NCB_SLABS: NcbSlab[] = [
  { years: '1 year', discount: '20%' },
  { years: '2 years', discount: '25%' },
  { years: '3 years', discount: '35%' },
  { years: '4 years', discount: '45%' },
  { years: '5+ years', discount: '50%' },
];

export const PREMIUM_FACTORS: PremiumFactor[] = [
  { icon: History, title: 'Driving History', desc: 'A clean record with no claims leads to NCB discounts of up to 50% on renewal.' },
  { icon: Gauge, title: 'Vehicle Type & Age', desc: 'Newer or high-performance vehicles cost more to insure. Older vehicles may have lower IDV.' },
  { icon: MapPin, title: 'Location (RTO Zone)', desc: 'Urban areas with higher traffic density and theft rates attract higher premiums.' },
  { icon: Gauge, title: 'Engine Cubic Capacity', desc: 'Larger engine vehicles (>1500cc) are placed in a higher insurance slab under IRDAI guidelines.' },
  { icon: Wrench, title: 'Add-on Covers Chosen', desc: 'Zero depreciation, engine protection, roadside assist, each add-on increases the premium proportionally.' },
  { icon: FileText, title: 'Insured Declared Value', desc: 'Higher IDV = higher premium but better claim payout. Setting IDV too low underinsures your vehicle.' },
];

export const LAPSE_RISKS: LapseRisk[] = [
  {
    title: 'Loss of No Claim Bonus',
    desc: 'If your policy lapses beyond 90 days, all accumulated NCB (up to 50% discount) is forfeited. You start over at 0%, even after years of claim-free driving.',
    icon: BadgePercent,
  },
  {
    title: 'Risk of Fines & Legal Action',
    desc: 'Under MV Act Section 196, driving without insurance is a cognisable offence. First offence: ₹2,000 fine or 3 months imprisonment. Repeat offence: ₹4,000 fine.',
    icon: AlertTriangle,
  },
  {
    title: 'Full Financial Exposure',
    desc: 'Without third-party cover, you are personally liable for any damage or injury you cause in an accident. Court awards can run into lakhs or crores.',
    icon: Banknote,
  },
  {
    title: 'Inspection Before Renewal',
    desc: 'Insurers may require a physical inspection of your vehicle before issuing a fresh policy if the old one lapsed beyond 90 days, causing delays and inconvenience.',
    icon: FileText,
  },
];

export const DOCUMENTS_NEEDED = [
  'Vehicle Registration Certificate (RC)',
  'Aadhaar Card / PAN Card / Driving Licence',
  'Previous insurance policy (for renewal)',
  'Vehicle inspection report (if lapsed > 90 days)',
  'Passport-size photographs',
  'For commercial vehicles: Permit & Fitness Certificate',
];

export const RENEWAL_BANNER_TAGS = ['Save up to 91%', 'Cashless Claims', '20+ Insurers'];
