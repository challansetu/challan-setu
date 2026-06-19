// ─── Violation-Specific Service Data ────────────────────────────────────────
// This file contains detailed content for specific high-value violation types
// Currently: Drink-and-Drive (DUI) - high-intent, high-value service

export interface ViolationFAQ {
  q: string;
  a: string;
}

export interface ViolationStep {
  title: string;
  desc: string;
}

export interface ViolationTypeContent {
  violationType: 'drink-and-drive';

  // SEO
  metaTitle: string;
  metaDescription: string;

  // Hero Section
  heroHeading: string;
  heroSubheading: string;
  heroBadge: string;

  // Main Content
  whatIsHeading: string;
  whatIsParagraphs: string[];

  penaltiesHeading: string;
  penalties: {
    label: string;
    description: string;
  }[];

  whyHelpNeeded: string;

  processHeading: string;
  processSteps: ViolationStep[];

  faqHeading: string;
  faqs: ViolationFAQ[];

  ctaHeading: string;
  ctaSubtext: string;
  ctaButton: string;
}

function createDrinkAndDriveContent(): ViolationTypeContent {
  return {
    violationType: 'drink-and-drive',

    metaTitle: 'Drink-and-Drive Challan Settlement | Legal Help | ChallanSetu',
    metaDescription: 'Face drink-and-drive charges? Get expert legal guidance on settlement options, license recovery, and court process. Free WhatsApp consultation.',

    heroHeading: 'Drink-and-Drive Challan? Legal Settlement Help Available',
    heroSubheading: 'Understand your legal options, avoid jail risk, and get expert guidance through the court process.',
    heroBadge: '🚨 Severe Penalty Case | Jail Risk | License Suspension',

    whatIsHeading: 'What Happens in a Drink-and-Drive Case?',
    whatIsParagraphs: [
      'A drink-and-drive (DUI/DUW) challan is issued when you are caught driving under the influence of alcohol. This is one of the most serious traffic violations in India with severe legal consequences.',
      'Unlike regular traffic violations, drink-and-drive cases involve both traffic penalties and potential criminal charges. The case may go to court, leading to imprisonment, license suspension, and heavy fines.',
      'Many drivers don\'t understand the seriousness until they receive a court notice. ChallanSetu helps you understand your legal options, court process, and settlement possibilities before it\'s too late.',
    ],

    penaltiesHeading: 'Drink-and-Drive Penalties in India',
    penalties: [
      {
        label: 'First Offense Fine',
        description: '₹10,000 – ₹30,000 fine (Motor Vehicles Act, Section 185)',
      },
      {
        label: 'License Suspension',
        description: 'License suspended for 6 months (first offense) to 1 year+ (repeat offense)',
      },
      {
        label: 'Imprisonment Risk',
        description: 'Up to 6 months jail (first offense) | Up to 2 years (repeat offense)',
      },
      {
        label: 'Repeat Offense (Within 5 Years)',
        description: '₹50,000 – ₹2,00,000 fine + 2 years imprisonment',
      },
      {
        label: 'Vehicle Impound',
        description: 'Vehicle seized and auctioned in some jurisdictions',
      },
      {
        label: 'Commercial Impact',
        description: 'Cab/auto drivers lose livelihood; commercial licenses revoked',
      },
    ],

    whyHelpNeeded: 'Why Legal Help Matters: Drink-and-drive cases are complex and can escalate quickly. A legal expert can help you understand Lok Adalat options, court procedures, license recovery timelines, and ways to minimize penalties. Many cases that seem hopeless have legal solutions.',

    processHeading: 'Our Drink-and-Drive Settlement Process',
    processSteps: [
      {
        title: 'Share Your Case Details',
        desc: 'Send us your challan/court notice, vehicle details, and case status. Everything is kept confidential.',
      },
      {
        title: 'Legal Review & Analysis',
        desc: 'Our team reviews your case, checks court jurisdiction, charges, and eligibility for Lok Adalat or other settlement options.',
      },
      {
        title: 'Understand Your Options',
        desc: 'Get clear explanation of: court process timeline, possible penalty ranges, license recovery options, Lok Adalat eligibility.',
      },
      {
        title: 'Expert Guidance & Support',
        desc: 'We guide you through the legal process, help with document preparation, and support you through court proceedings.',
      },
      {
        title: 'Case Resolution',
        desc: 'Follow legal process for settlement, license restoration, and final case closure with minimal penalties.',
      },
    ],

    faqHeading: 'Drink-and-Drive Challan — Frequently Asked Questions',
    faqs: [
      {
        q: 'What is the fine for drink-and-drive in India?',
        a: 'First offense: ₹10,000 – ₹30,000. Repeat offense (within 5 years): ₹50,000 – ₹2,00,000. Amount varies based on blood alcohol content and jurisdiction. Court may impose additional penalties.',
      },
      {
        q: 'Will I go to jail for drinking and driving?',
        a: 'First offense: Up to 6 months imprisonment (can be waived in some cases). Repeat offense: Up to 2 years imprisonment. Jail sentence depends on court decision, your criminal record, and available legal defense.',
      },
      {
        q: 'How long will my license be suspended?',
        a: 'First offense: 6 months minimum. Repeat offense: 1 year or more. License restoration may be possible after serving suspension period and meeting court conditions. ChallanSetu helps with license recovery process.',
      },
      {
        q: 'Is Lok Adalat possible for drink-and-drive cases?',
        a: 'Lok Adalat is possible for some drink-and-drive cases, depending on case stage, jurisdiction, and legal eligibility. It offers settlement with reduced penalties. We check if you qualify and guide the process.',
      },
      {
        q: 'What if this is my second drink-and-drive offense?',
        a: 'Repeat offenses carry much harsher penalties: up to ₹2,00,000 fine and 2 years imprisonment. Legal defense becomes more critical. We help minimize penalties through proper legal representation.',
      },
      {
        q: 'Can I drive for cab/auto while this case is pending?',
        a: 'No. Pending drink-and-drive cases may prevent commercial vehicle operations. License suspension also makes it illegal to drive. We help expedite case resolution so you can return to work legally.',
      },
      {
        q: 'What documents do I need for my case?',
        a: 'Challan/court notice, driving license, vehicle registration, blood alcohol test reports (if available), medical records, character references, and any previous correspondence with court. We guide you on gathering these.',
      },
      {
        q: 'How long does the drink-and-drive court process take?',
        a: 'Typically 6-12 months depending on court backlog and case complexity. Some cases settle faster through Lok Adalat (3-4 months). We keep you updated on realistic timelines.',
      },
      {
        q: 'Can penalties be reduced?',
        a: 'Penalties can be reduced through: legal defense in court, Lok Adalat settlement, character evidence, and case-specific circumstances. Not guaranteed, but possible with expert legal guidance.',
      },
      {
        q: 'What happens to my vehicle?',
        a: 'Vehicle is usually returned after case, but may be impounded temporarily. In some jurisdictions, repeat offenders\' vehicles face auction. We help protect your vehicle rights throughout the process.',
      },
    ],

    ctaHeading: 'Don\'t Face Drink-and-Drive Charges Alone',
    ctaSubtext: 'Get expert legal guidance before paying blindly or facing worse penalties. Free WhatsApp consultation with our drink-and-drive specialist.',
    ctaButton: 'Get Help on WhatsApp',
  };
}

export const DRINK_AND_DRIVE_CONTENT = createDrinkAndDriveContent();

// Map for future expansion to other violation types
export const VIOLATION_CONTENT_MAP = new Map([
  ['drink-and-drive', DRINK_AND_DRIVE_CONTENT],
]);

export function getViolationContent(type: string): ViolationTypeContent | null {
  return VIOLATION_CONTENT_MAP.get(type) ?? null;
}
