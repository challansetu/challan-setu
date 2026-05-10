// ─── City Page Data Layer ─────────────────────────────────────────────────────

export interface CityViolation {
  offence: string;
  fine: string;
  section: string;
}

export interface CityFAQ {
  q: string;
  a: string;
}

export interface CityStep {
  title: string;
  desc: string;
}

export interface CityRelated {
  city: string;
  slug: string;
}

export interface CityPageData {
  slug: string;
  cityName: string;
  stateName: string;
  vehiclePrefix: string;
  authority: string;
  exampleVehicle: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  canonicalPath: string;

  // Hero
  h1: string;
  heroSubheading: string;
  supportBadges: string[];

  // Content
  aboutHeading: string;
  aboutParagraphs: string[];
  violationsHeading: string;
  violations: CityViolation[];
  settlementHeading: string;
  settlementParagraphs: string[];
  steps: CityStep[];
  unpaidHeading: string;
  unpaidParagraphs: string[];
  documentsHeading: string;
  documents: string[];
  faqHeading: string;
  faqs: CityFAQ[];
  relatedCities: CityRelated[];
  ctaHeading: string;
  ctaSubtext: string;
}

const ALL_CITY_LINKS: CityRelated[] = [
  { city: 'Delhi', slug: 'delhi' },
  { city: 'Gurgaon', slug: 'gurgaon' },
  { city: 'Noida', slug: 'noida' },
  { city: 'Ghaziabad', slug: 'ghaziabad' },
  { city: 'Faridabad', slug: 'faridabad' },
];

function buildCityFaqs(cityLabel: string): CityFAQ[] {
  return [
    {
      q: `How can I get challan assistance in ${cityLabel}?`,
      a: `Submit your vehicle number on ChallanSetu to start a challan assistance request for ${cityLabel}. Our team reviews your challan details and helps you find the best available settlement or discount option.`,
    },
    {
      q: `Can I get a discount on my ${cityLabel} traffic challan?`,
      a: `Eligible challans in ${cityLabel} may qualify for settlement support with savings of up to 50%. Final eligibility depends on challan type, offence, location, and current case status.`,
    },
    {
      q: `Does ChallanSetu support court challans in ${cityLabel}?`,
      a: `Yes. ChallanSetu supports traffic challan settlement assistance, including court challan-related support in ${cityLabel} where applicable.`,
    },
    {
      q: 'Do I need to pay before checking eligibility?',
      a: 'No. You can start by submitting your vehicle number and basic details. Payment is required only after your challan details and available option are shared with you.',
    },
    {
      q: 'Is OTP required to submit a challan request?',
      a: 'No. ChallanSetu does not ask for OTP, UPI PIN, or bank details to submit a challan eligibility request.',
    },
    {
      q: 'What documents are needed for challan settlement support?',
      a: 'Your vehicle number is enough to begin. If available, you can also share a challan screenshot, challan PDF, notice, or challan number to speed up the review.',
    },
    {
      q: `What happens if I do not pay my ${cityLabel} challan?`,
      a: `Pending challans in ${cityLabel} may lead to additional complications depending on the offence, local rules, and court status. It is better to review and resolve pending challans on time.`,
    },
    {
      q: 'Is ChallanSetu a government website?',
      a: 'No. ChallanSetu is not a government website. It provides challan assistance, support, and settlement guidance. Users can also verify their challan status through official government portals.',
    },
    {
      q: 'Can I upload my challan screenshot or notice?',
      a: 'Yes. You can upload a challan screenshot, PDF, or notice so that your request can be reviewed faster.',
    },
    {
      q: 'How long does challan verification take?',
      a: 'Verification time may vary based on challan type and location. In most cases, you receive the next update after the request is reviewed.',
    },
  ];
}

function createCityPage(config: {
  slug: string;
  cityName: string;
  stateName: string;
  vehiclePrefix: string;
  authority: string;
  exampleVehicle: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubheading: string;
  aboutParagraphs: string[];
  settlementParagraphs: string[];
  unpaidParagraphs: string[];
  documents: string[];
  violations: CityViolation[];
}) : CityPageData {
  return {
    ...config,
    ogTitle: config.metaTitle,
    ogDescription: config.metaDescription,
    canonicalPath: `/pay-vehicle-challan-in-${config.slug}`,
    supportBadges: [
      'No payment required to start',
      'Up to 50% off on eligible challans',
      'No OTP, UPI PIN, or bank details',
    ],
    aboutHeading: `${config.cityName} Challan Support`,
    violationsHeading: `Common ${config.cityName} Traffic Violations & Fine Amounts`,
    settlementHeading: `Court Challan & Settlement Support in ${config.cityName}`,
    steps: [
      {
        title: `Enter your ${config.cityName} vehicle number`,
        desc: `Start with your vehicle number to request challan assistance for ${config.cityName}.`,
      },
      {
        title: 'Share your details securely',
        desc: 'Add your full name, mobile number, and consent so your request can be recorded and reviewed.',
      },
      {
        title: 'Eligibility is reviewed',
        desc: 'Challan details are reviewed to understand the case type, location, and possible settlement path.',
      },
      {
        title: 'Next step is shared',
        desc: 'You receive the available option for your challan request, with no payment required to start.',
      },
    ],
    unpaidHeading: `What Happens If a ${config.cityName} Challan Is Not Paid`,
    documentsHeading: `What You Need to Start a ${config.cityName} Challan Request`,
    faqHeading: `${config.cityName} Challan FAQs`,
    faqs: buildCityFaqs(config.cityName),
    relatedCities: ALL_CITY_LINKS,
    ctaHeading: `Request challan assistance in ${config.cityName}`,
    ctaSubtext: 'No payment required to start. Submit your vehicle number and review the available option first.',
  };
}

const CITIES: CityPageData[] = [
  createCityPage({
    slug: 'delhi',
    cityName: 'Delhi',
    stateName: 'Delhi',
    vehiclePrefix: 'DL',
    authority: 'Delhi Traffic Police',
    exampleVehicle: 'DL7SBY5194',
    metaTitle: 'Traffic Challan Discount in Delhi | ChallanSetu',
    metaDescription:
      'Get a legal challan discount in Delhi through Lok Adalat. Our lawyers handle everything — you just pay less. Book a free call today.',
    h1: 'Get a Legal Traffic Challan Discount in Delhi',
    heroSubheading:
      'Enter your vehicle number to check discount eligibility before paying your Delhi challan.',
    aboutParagraphs: [
      'ChallanSetu helps Delhi vehicle owners start a challan discount eligibility check before making payment. This is useful for pending e-challans, traffic challans, and settlement support cases that need a clearer next step.',
      'Delhi challans can involve common issues such as overspeeding, red light jumping, helmet violations, seatbelt violations, mobile use while driving, and camera-based notices. Checking the details early helps avoid delay and confusion.',
      'If your challan is linked to a court process or needs additional review, ChallanSetu can help you understand the available settlement support path before you pay.',
    ],
    settlementParagraphs: [
      'Some Delhi challans may qualify for settlement support through legal review, court process, or Lok Adalat-related resolution, depending on the case.',
      'Court challan support is not identical for every offence. Eligibility can vary based on challan type, city process, offence category, and current status.',
    ],
    unpaidParagraphs: [
      'Unpaid Delhi challans may create larger complications over time depending on the offence and current legal status. Some cases can become harder to resolve later.',
      'It is better to review pending challans early and understand the available option before penalties or procedural issues grow further.',
    ],
    documents: [
      'Vehicle number',
      'Challan number if available',
      'Challan screenshot, PDF, or notice',
      'Basic contact details for request updates',
    ],
    violations: [
      { offence: 'Red light jumping', fine: '₹1,000 – ₹5,000', section: 'Sec 119 MV Act' },
      { offence: 'Overspeeding', fine: '₹1,000 – ₹2,000', section: 'Sec 183 MV Act' },
      { offence: 'Using phone while driving', fine: '₹1,000 – ₹5,000', section: 'Sec 184 MV Act' },
      { offence: 'No helmet', fine: '₹1,000', section: 'Sec 129 MV Act' },
      { offence: 'No seatbelt', fine: '₹1,000', section: 'Sec 194B MV Act' },
      { offence: 'Wrong-side driving', fine: '₹5,000', section: 'Sec 184 MV Act' },
    ],
  }),
  createCityPage({
    slug: 'gurgaon',
    cityName: 'Gurgaon',
    stateName: 'Haryana',
    vehiclePrefix: 'HR',
    authority: 'Gurugram Traffic Police',
    exampleVehicle: 'HR26DZ5678',
    metaTitle: 'Lok Adalat Challan Gurgaon | ChallanSetu',
    metaDescription:
      'Resolve your Gurgaon traffic challan at Lok Adalat with expert legal help. Save up to 50% — no court visits needed. Free case review.',
    h1: 'Settle Your Gurgaon Challan via Lok Adalat',
    heroSubheading:
      'Enter your vehicle number to check discount eligibility before paying your Gurgaon or Gurugram challan.',
    aboutParagraphs: [
      'ChallanSetu helps Gurgaon and Gurugram drivers start a challan discount eligibility check before payment. This is useful for pending e-challans, traffic challans, and settlement support cases connected with city roads and expressway corridors.',
      'Gurgaon challans often involve overspeeding, signal violations, parking issues, mobile phone use while driving, and camera-based enforcement on key roads.',
      'If the challan requires settlement assistance or a court-linked review, ChallanSetu can help you understand the possible route before payment.',
    ],
    settlementParagraphs: [
      'Eligible Gurgaon or Gurugram challans may qualify for settlement support depending on offence category, court status, and verification outcome.',
      'This includes help for cases that may need legal process guidance rather than only a straightforward payment step.',
    ],
    unpaidParagraphs: [
      'Pending Gurgaon challans may become more difficult to manage later depending on the offence and enforcement status.',
      'Reviewing the challan early can help you understand whether settlement support is possible before the case becomes more complicated.',
    ],
    documents: [
      'Vehicle number',
      'Challan screenshot, PDF, or notice if you have it',
      'Challan number or court notice reference if available',
      'Basic mobile number for updates',
    ],
    violations: [
      { offence: 'Overspeeding on NH-48', fine: '₹1,000 – ₹2,000', section: 'Sec 183 MV Act' },
      { offence: 'Red light jumping', fine: '₹1,000 – ₹5,000', section: 'Sec 119 MV Act' },
      { offence: 'Using phone while driving', fine: '₹1,000 – ₹5,000', section: 'Sec 184 MV Act' },
      { offence: 'Parking violation', fine: '₹500 – ₹2,000', section: 'Local traffic rules' },
      { offence: 'No seatbelt', fine: '₹1,000', section: 'Sec 194B MV Act' },
      { offence: 'No helmet', fine: '₹1,000', section: 'Sec 129 MV Act' },
    ],
  }),
  createCityPage({
    slug: 'noida',
    cityName: 'Noida',
    stateName: 'Uttar Pradesh',
    vehiclePrefix: 'UP',
    authority: 'Noida Traffic Police',
    exampleVehicle: 'UP16DZ3281',
    metaTitle: 'Traffic Challan Settlement in Noida | ChallanSetu',
    metaDescription:
      'Pending challan in Noida? Settle legally and pay up to 50% less. ChallanSetu lawyers know Noida courts inside out. Act before it escalates.',
    h1: 'Settle Your Traffic Challan in Noida – Pay Less, Legally',
    heroSubheading:
      'Enter your vehicle number to check discount eligibility before paying your Noida challan.',
    aboutParagraphs: [
      'ChallanSetu helps Noida vehicle owners begin a challan discount eligibility check before they pay. This helps users review pending traffic challans, e-challans, and possible settlement support paths first.',
      'Noida challans may involve overspeeding, signal jumping, helmet or seatbelt violations, parking issues, and camera-based enforcement on major corridors.',
      'If the challan requires further review or court-related support, ChallanSetu helps you understand the next available option before payment.',
    ],
    settlementParagraphs: [
      'Some Noida challans may be eligible for settlement support through legal review or court-related resolution, depending on the case.',
      'Final eligibility depends on challan category, offence, city process, and current status after verification.',
    ],
    unpaidParagraphs: [
      'Leaving a Noida challan unresolved may increase the risk of bigger complications depending on the violation and legal stage.',
      'It is better to review the challan details early so you can understand the available route before the case becomes harder to settle.',
    ],
    documents: [
      'Vehicle number',
      'Challan screenshot, PDF, or notice',
      'Challan number if available',
      'Basic contact details for request status',
    ],
    violations: [
      { offence: 'Overspeeding on expressways', fine: '₹1,000 – ₹4,000', section: 'Sec 183 MV Act' },
      { offence: 'Red light jumping', fine: '₹1,000 – ₹5,000', section: 'Sec 119 MV Act' },
      { offence: 'Using phone while driving', fine: '₹1,000 – ₹5,000', section: 'Sec 184 MV Act' },
      { offence: 'Lane or parking violation', fine: '₹500 – ₹2,000', section: 'Local traffic rules' },
      { offence: 'No helmet', fine: '₹1,000', section: 'Sec 129 MV Act' },
      { offence: 'No seatbelt', fine: '₹1,000', section: 'Sec 194B MV Act' },
    ],
  }),
  createCityPage({
    slug: 'ghaziabad',
    cityName: 'Ghaziabad',
    stateName: 'Uttar Pradesh',
    vehiclePrefix: 'UP',
    authority: 'Ghaziabad Traffic Police',
    exampleVehicle: 'UP14BT7892',
    metaTitle: 'Reduce Traffic Challan Fine Ghaziabad | ChallanSetu',
    metaDescription:
      'Unpaid challan in Ghaziabad can get your licence suspended. Reduce fines legally via Lok Adalat. ChallanSetu lawyers settle in days.',
    h1: 'Reduce Your Traffic Challan Fine in Ghaziabad — Legally',
    heroSubheading:
      'Enter your vehicle number to check discount eligibility before paying your Ghaziabad challan.',
    aboutParagraphs: [
      'ChallanSetu helps Ghaziabad vehicle owners start a challan discount eligibility check before payment. This is useful for pending traffic challans, e-challans, and settlement support cases that need review first.',
      'Common Ghaziabad challans can involve overspeeding, signal violations, parking issues, helmet or seatbelt violations, and camera-based enforcement on major roads and expressways.',
      'If your challan needs court-related support or additional review, ChallanSetu helps you understand the next possible option before you pay.',
    ],
    settlementParagraphs: [
      'Some Ghaziabad challans may qualify for settlement support depending on offence type, legal status, and verification outcome.',
      'Court challan support is case-dependent and not every challan is eligible for the same route or discount range.',
    ],
    unpaidParagraphs: [
      'Pending Ghaziabad challans may create further problems over time depending on the offence and whether a court process is involved.',
      'Checking the challan earlier helps you understand the available path before penalties or procedural complications grow further.',
    ],
    documents: [
      'Vehicle number',
      'Challan screenshot, PDF, or notice',
      'Court or challan reference if available',
      'Basic mobile number for updates',
    ],
    violations: [
      { offence: 'Overspeeding on expressways', fine: '₹1,000 – ₹4,000', section: 'Sec 183 MV Act' },
      { offence: 'Red light jumping', fine: '₹1,000 – ₹5,000', section: 'Sec 119 MV Act' },
      { offence: 'Using phone while driving', fine: '₹1,000 – ₹5,000', section: 'Sec 184 MV Act' },
      { offence: 'Wrong-side driving', fine: '₹5,000', section: 'Sec 184 MV Act' },
      { offence: 'No helmet', fine: '₹1,000', section: 'Sec 129 MV Act' },
      { offence: 'No seatbelt', fine: '₹1,000', section: 'Sec 194B MV Act' },
    ],
  }),
  createCityPage({
    slug: 'faridabad',
    cityName: 'Faridabad',
    stateName: 'Haryana',
    vehiclePrefix: 'HR',
    authority: 'Faridabad Traffic Police',
    exampleVehicle: 'HR51CU2041',
    metaTitle: 'Traffic Fine Settlement in Faridabad | ChallanSetu',
    metaDescription:
      'Don\'t pay full traffic fines in Faridabad. ChallanSetu settles challans via Lok Adalat — save up to 50%. Get a free assessment today.',
    h1: 'Settle Traffic Fines in Faridabad at Up to 50% Off',
    heroSubheading:
      'Enter your vehicle number to check discount eligibility before paying your Faridabad challan.',
    aboutParagraphs: [
      'ChallanSetu helps Faridabad vehicle owners start a challan discount eligibility check before payment. This is useful for pending traffic challans, e-challans, and settlement support cases that may require more review.',
      'Faridabad challans may involve overspeeding, signal jumping, helmet or seatbelt violations, wrong-side driving, parking issues, and camera-based notices on key roads.',
      'If your Faridabad challan needs court-related support or legal process guidance, ChallanSetu helps you understand the available path before you make payment.',
    ],
    settlementParagraphs: [
      'Some Faridabad challans may be eligible for settlement support depending on offence type, city process, and current legal status.',
      'Court challan assistance is case-specific, and final eligibility is confirmed only after challan details are reviewed.',
    ],
    unpaidParagraphs: [
      'Pending Faridabad challans may lead to bigger complications later depending on the offence and whether the challan has moved into a court process.',
      'Checking the challan early helps you understand whether settlement support is available before the case becomes harder to manage.',
    ],
    documents: [
      'Vehicle number',
      'Challan screenshot, PDF, or notice',
      'Challan number or court reference if available',
      'Basic contact details for request updates',
    ],
    violations: [
      { offence: 'Overspeeding', fine: '₹1,000 – ₹2,000', section: 'Sec 183 MV Act' },
      { offence: 'Red light jumping', fine: '₹1,000 – ₹5,000', section: 'Sec 119 MV Act' },
      { offence: 'Using phone while driving', fine: '₹1,000 – ₹5,000', section: 'Sec 184 MV Act' },
      { offence: 'Wrong-side driving', fine: '₹5,000', section: 'Sec 184 MV Act' },
      { offence: 'No helmet', fine: '₹1,000', section: 'Sec 129 MV Act' },
      { offence: 'No seatbelt', fine: '₹1,000', section: 'Sec 194B MV Act' },
    ],
  }),
];

const CITY_MAP = new Map<string, CityPageData>(CITIES.map((c) => [c.slug, c]));

export function getCityPage(slug: string): CityPageData | null {
  return CITY_MAP.get(slug.toLowerCase()) ?? null;
}

export function getAllCitySlugs(): string[] {
  return CITIES.map((c) => c.slug);
}

export function getAllCityPages(): CityPageData[] {
  return CITIES;
}
