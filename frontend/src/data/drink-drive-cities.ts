// ─── Drink & Drive City Data Layer ────────────────────────────────────────────
// Powers the per-city long-tail pages at /drink-and-drive/[city].
// Each city carries genuinely unique local content (courts, enforcement hotspots,
// city-specific FAQs) so the pages are not near-duplicate "doorway" pages.

export interface DrinkDriveFAQ {
  q: string;
  a: string;
}

export interface DrinkDriveCity {
  slug: string;
  cityName: string;
  stateName: string;
  vehiclePrefix: string;
  trafficPolice: string;
  court: string;

  // SEO
  metaTitle: string;
  metaDescription: string;

  // Hero
  h1: string;
  heroSubheading: string;

  // Content
  introParagraphs: string[];
  localAngleHeading: string;
  localAngleParagraphs: string[];

  // City-specific FAQs (merged with shared templated FAQs at build time)
  cityFaqs: DrinkDriveFAQ[];
}

// ─── Shared content (national, reused across every city) ───────────────────────

export const DRINK_DRIVE_PENALTY_ROWS = [
  { offence: 'First offence', fine: 'Up to ₹10,000', jail: 'Up to 6 months', licence: 'Suspended 6-12 months' },
  { offence: 'Repeat (within 3 years)', fine: 'Up to ₹15,000', jail: 'Up to 2 years', licence: 'Suspended 1 year+' },
  { offence: 'With accident / injury', fine: 'Higher + damages', jail: 'Additional BNS charges', licence: 'May be cancelled' },
];

export const DRINK_DRIVE_SETTLEMENT_ROWS = [
  { option: 'Lok Adalat settlement', cost: '~₹2,000-5,000', timeline: '4-8 weeks', bestFor: 'First offence, no accident, want it over fast & cheap' },
  { option: 'Court compromise / plea', cost: '~₹3,000-8,000', timeline: '3-6 months', bestFor: 'Case already in court, aiming for fine-only outcome' },
  { option: 'Legal defence (contest)', cost: '₹10,000-30,000+', timeline: '6-18 months', bestFor: 'Faulty breathalyzer / procedure, wrongful charge, high stakes' },
  { option: 'Pay full court fine', cost: 'Up to ₹10,000-15,000', timeline: '1-3 hearings', bestFor: 'Simplest, but no fine reduction & full conviction recorded' },
];

export const DRINK_DRIVE_PROCESS_STEPS = [
  { name: 'Share Case Details', text: 'Tell us when and where you were caught, your BAC reading, and whether an FIR or challan was issued. Share the challan or FIR copy if you have it.' },
  { name: 'Legal Case Review', text: 'Our legal team reviews the charge under Section 185, checks whether the breathalyzer procedure was followed, and identifies settlement options for your city.' },
  { name: 'Explain Settlement Path', text: 'We tell you which realistic route applies — Lok Adalat, court compromise, or legal defence — with honest costs and timelines, before you pay anything.' },
  { name: 'File & Court Support', text: 'Our team handles document filing, applications, and represents you in the local magistrate court so you are not navigating it alone.' },
  { name: 'Case Resolution', text: 'You receive the final order from the court, with the case officially settled or resolved and your licence-restoration path made clear.' },
];

// "First 24 hours" checklist — genuinely useful, unique to our pages.
export const DRINK_DRIVE_FIRST_STEPS = [
  'Stay calm and cooperate — do not argue with or abuse the officer, as that makes the case worse.',
  'Note the details: time, location, the officer\'s name, and your exact breathalyzer reading.',
  'Ask whether an FIR has been registered or only a challan/summons issued — they are treated very differently.',
  'Do not sign any blank document. Keep every paper the police give you.',
  'If a blood test is offered, it is more reliable than a breathalyzer — note whether it was done.',
  'Get a case review before your court date so you walk in knowing your options, not guessing.',
];

// ─── Per-city data ─────────────────────────────────────────────────────────────

const CITIES: DrinkDriveCity[] = [
  {
    slug: 'delhi',
    cityName: 'Delhi',
    stateName: 'Delhi',
    vehiclePrefix: 'DL',
    trafficPolice: 'Delhi Traffic Police',
    court: 'Metropolitan Magistrate courts (Tis Hazari, Saket, Karkardooma, Rohini, Dwarka, Patiala House)',
    metaTitle: 'Caught for Drink & Drive in Delhi? What to Do | Settlement Help',
    metaDescription:
      'Caught for drink & drive in Delhi? Understand Section 185 penalties, the court process at Tis Hazari/Saket, Lok Adalat settlement & how to protect your licence. Free WhatsApp review.',
    h1: 'Caught for Drink & Drive in Delhi? Here\'s What to Do',
    heroSubheading:
      'A Section 185 charge in Delhi is a criminal case, not a normal challan. Understand your penalties, the court process, and your fastest legal settlement option.',
    introParagraphs: [
      'Delhi Traffic Police runs some of the most aggressive drunk-driving checks in the country, especially on weekend nights, near nightlife hubs like Connaught Place, Hauz Khas, and Cyber Hub-bound routes, and around festivals like Diwali and New Year. If you were stopped and your breathalyzer read above the legal limit, your case is registered under Section 185 of the Motor Vehicles Act — a criminal offence, not a simple traffic fine.',
      'That means it does not vanish by paying online. You will typically be summoned to a Delhi magistrate court, and how you handle the next few weeks decides whether you walk away with a fine or risk jail, a long licence suspension, and a permanent criminal record.',
    ],
    localAngleHeading: 'How Drink & Drive Cases Work in Delhi',
    localAngleParagraphs: [
      'Delhi drink-and-drive cases are prosecuted before the Metropolitan Magistrate courts spread across the district complexes — Tis Hazari, Saket, Karkardooma, Rohini, Dwarka, and Patiala House — depending on where you were caught.',
      'For first-time offenders with no accident, Delhi courts frequently resolve cases through National Lok Adalats (held periodically through the year) with a fine and warning rather than imprisonment. We help you figure out which court your case falls under and prepare you for that hearing.',
    ],
    cityFaqs: [
      {
        q: 'Which court will my Delhi drink and drive case go to?',
        a: 'It depends on where you were stopped. Delhi drink-and-drive cases are heard by the Metropolitan Magistrate at the district court covering that area — Tis Hazari, Saket, Karkardooma, Rohini, Dwarka, or Patiala House. Your summons or challan will mention the court and date.',
      },
      {
        q: 'Can I settle a Delhi drink and drive case at Lok Adalat?',
        a: 'For many first-time Delhi cases with no accident or injury, yes — National Lok Adalats held periodically through the year are commonly used to close the matter with a fine and warning instead of a trial. Eligibility depends on the case stage and the BAC reading.',
      },
      {
        q: 'Does Delhi Traffic Police seize your licence on the spot for drunk driving?',
        a: 'Your licence can be recommended for suspension and you may be asked to surrender documents. The actual suspension is ordered through the court/licensing authority. Until then, do not drive on a suspended licence as that adds a fresh offence.',
      },
    ],
  },
  {
    slug: 'gurgaon',
    cityName: 'Gurgaon',
    stateName: 'Haryana',
    vehiclePrefix: 'HR',
    trafficPolice: 'Gurugram Traffic Police',
    court: 'District Court, Gurugram',
    metaTitle: 'Caught for Drink & Drive in Gurgaon? What to Do | Settlement Help',
    metaDescription:
      'Drink & drive case in Gurgaon (Gurugram)? Understand Section 185 penalties, the District Court process, Lok Adalat settlement & how to save your licence. Free WhatsApp case review.',
    h1: 'Caught for Drink & Drive in Gurgaon? Here\'s What to Do',
    heroSubheading:
      'A drink & drive charge in Gurugram is a criminal case under Section 185. Know your penalties, the court process, and your fastest legal way to settle.',
    introParagraphs: [
      'Gurugram\'s nightlife corridors — Cyber Hub, Golf Course Road, Sector 29, and the MG Road belt — see heavy late-night drunk-driving checks, and the NH-48 expressway nakas catch a large share of cases. If your breathalyzer read above the legal limit, Gurugram Traffic Police books you under Section 185 of the Motor Vehicles Act, which is a criminal offence rather than a routine challan.',
      'This case cannot be cleared by an online payment. You will usually be summoned to the District Court in Gurugram, and acting early — before that hearing — is what decides whether you end up with just a fine or face jail risk, licence loss, and a criminal record.',
    ],
    localAngleHeading: 'How Drink & Drive Cases Work in Gurgaon',
    localAngleParagraphs: [
      'Gurugram drink-and-drive cases are filed and heard at the District Court, Gurugram. First-time matters without an accident are frequently resolved through Lok Adalat sittings with a fine and warning.',
      'Because Gurgaon mixes heavy corporate nightlife with expressway enforcement, BAC readings and the exact stop location matter a lot to the outcome. We review those details and prepare you for the Gurugram court process.',
    ],
    cityFaqs: [
      {
        q: 'Where is a Gurgaon drink and drive case heard?',
        a: 'Drink-and-drive cases caught within Gurugram are prosecuted at the District Court, Gurugram. Your summons will carry the court and hearing date.',
      },
      {
        q: 'I was caught on NH-48 near Gurgaon — does that change anything?',
        a: 'The charge is still Section 185, but the stop location, whether it was a state highway naka, and your exact BAC reading affect how the case is handled. These details are worth reviewing before your hearing.',
      },
      {
        q: 'Can a Gurgaon first-time drink and drive case be settled quickly?',
        a: 'Often yes. First-time cases with no accident are commonly closed at Lok Adalat with a fine and warning rather than a full trial. We confirm whether your case qualifies.',
      },
    ],
  },
  {
    slug: 'noida',
    cityName: 'Noida',
    stateName: 'Uttar Pradesh',
    vehiclePrefix: 'UP',
    trafficPolice: 'Gautam Buddh Nagar Traffic Police',
    court: 'District & Sessions Court, Gautam Buddh Nagar (Surajpur)',
    metaTitle: 'Caught for Drink & Drive in Noida? What to Do | Settlement Help',
    metaDescription:
      'Drink & drive case in Noida? Understand Section 185 penalties, the Gautam Buddh Nagar court process, Lok Adalat settlement & licence recovery. Free WhatsApp case review.',
    h1: 'Caught for Drink & Drive in Noida? Here\'s What to Do',
    heroSubheading:
      'A Section 185 drink & drive charge in Noida is a criminal case. Know your penalties, the Gautam Buddh Nagar court process, and your fastest legal settlement route.',
    introParagraphs: [
      'Noida and the Noida–Greater Noida Expressway see frequent late-night breathalyzer nakas run by the Gautam Buddh Nagar Traffic Police, with extra checking around sector markets and the expressway on weekends. If your reading crossed the legal limit, you are booked under Section 185 of the Motor Vehicles Act — a criminal charge, not a normal e-challan.',
      'Paying online will not close this case. You will normally be summoned to the Gautam Buddh Nagar district court, and what you do before that date strongly affects whether the outcome is a fine or jail risk plus a long licence suspension.',
    ],
    localAngleHeading: 'How Drink & Drive Cases Work in Noida',
    localAngleParagraphs: [
      'Noida drink-and-drive cases are prosecuted at the District & Sessions Court for Gautam Buddh Nagar at Surajpur. First-time cases without an accident are frequently resolved through Lok Adalat with a fine.',
      'Expressway stops and high-speed enforcement are common in Noida, so the recorded BAC and the procedure followed at the naka are important details we review before your hearing.',
    ],
    cityFaqs: [
      {
        q: 'Which court handles Noida drink and drive cases?',
        a: 'Noida cases fall under Gautam Buddh Nagar jurisdiction and are heard at the District & Sessions Court complex at Surajpur. Your summons will list the exact court and date.',
      },
      {
        q: 'I was stopped on the Noida-Greater Noida Expressway — what now?',
        a: 'The charge remains Section 185. Expressway nakas often record high BAC and speed; the exact reading and whether the test procedure was followed correctly can affect your defence. Get the details reviewed early.',
      },
      {
        q: 'Can a Noida drink and drive case be settled at Lok Adalat?',
        a: 'For many first-time cases with no accident, yes. Lok Adalat sittings are commonly used in Gautam Buddh Nagar to close such cases with a fine and warning. We confirm whether yours qualifies.',
      },
    ],
  },
  {
    slug: 'ghaziabad',
    cityName: 'Ghaziabad',
    stateName: 'Uttar Pradesh',
    vehiclePrefix: 'UP',
    trafficPolice: 'Ghaziabad Traffic Police',
    court: 'District Court, Ghaziabad',
    metaTitle: 'Caught for Drink & Drive in Ghaziabad? What to Do | Settlement Help',
    metaDescription:
      'Drink & drive case in Ghaziabad? Understand Section 185 penalties, the District Court process, Lok Adalat settlement & how to protect your licence. Free WhatsApp case review.',
    h1: 'Caught for Drink & Drive in Ghaziabad? Here\'s What to Do',
    heroSubheading:
      'A drink & drive charge in Ghaziabad is a criminal case under Section 185. Understand your penalties, the court process, and your fastest legal settlement option.',
    introParagraphs: [
      'Ghaziabad Traffic Police runs regular drunk-driving checks along NH-9, the Indirapuram–Vaishali nightlife belt, and the routes connecting to Delhi. If your breathalyzer crossed the legal limit, the case is registered under Section 185 of the Motor Vehicles Act — a criminal offence, not a routine traffic fine.',
      'It cannot be settled by an online payment. You will typically be summoned to the District Court in Ghaziabad, and the steps you take before your hearing decide whether you face just a fine or jail risk, licence suspension, and a criminal record.',
    ],
    localAngleHeading: 'How Drink & Drive Cases Work in Ghaziabad',
    localAngleParagraphs: [
      'Ghaziabad drink-and-drive cases are heard at the District Court, Ghaziabad. First-time cases without an accident are commonly resolved through Lok Adalat with a fine and warning.',
      'Because many Ghaziabad stops happen on highway-speed corridors and at the Delhi border, the exact location and BAC reading matter to the outcome — details we review before preparing you for court.',
    ],
    cityFaqs: [
      {
        q: 'Where is a Ghaziabad drink and drive case heard?',
        a: 'Ghaziabad drink-and-drive cases are prosecuted at the District Court, Ghaziabad. The court and hearing date are mentioned on your summons or challan.',
      },
      {
        q: 'I was caught near the Delhi-Ghaziabad border — which police has the case?',
        a: 'Jurisdiction follows where you were actually stopped. If it was within Ghaziabad limits, Ghaziabad Traffic Police books it and the case goes to the Ghaziabad court. We help confirm jurisdiction from your papers.',
      },
      {
        q: 'Can a first-time Ghaziabad case avoid jail?',
        a: 'In most first-time cases with no accident or injury, magistrates impose a fine and warning rather than jail. A prepared case improves the odds of a fine-only outcome.',
      },
    ],
  },
  {
    slug: 'faridabad',
    cityName: 'Faridabad',
    stateName: 'Haryana',
    vehiclePrefix: 'HR',
    trafficPolice: 'Faridabad Traffic Police',
    court: 'District Court, Faridabad (Sector 12)',
    metaTitle: 'Caught for Drink & Drive in Faridabad? What to Do | Settlement Help',
    metaDescription:
      'Drink & drive case in Faridabad? Understand Section 185 penalties, the District Court process, Lok Adalat settlement & how to save your licence. Free WhatsApp case review.',
    h1: 'Caught for Drink & Drive in Faridabad? Here\'s What to Do',
    heroSubheading:
      'A drink & drive charge in Faridabad is a criminal case under Section 185. Know your penalties, the court process, and your fastest legal way to settle.',
    introParagraphs: [
      'Faridabad Traffic Police conducts frequent drunk-driving checks along the Mathura Road belt, the Delhi-Faridabad border routes, and near the city\'s sector markets at night. A reading above the legal limit means you are booked under Section 185 of the Motor Vehicles Act — a criminal charge, not a normal challan.',
      'This is not closed by paying online. You will usually be summoned to the District Court in Faridabad, and acting before that hearing is what separates a fine-only outcome from jail risk, licence loss, and a lasting criminal record.',
    ],
    localAngleHeading: 'How Drink & Drive Cases Work in Faridabad',
    localAngleParagraphs: [
      'Faridabad drink-and-drive cases are prosecuted at the District Court in Sector 12. First-time matters without an accident are commonly resolved through Lok Adalat with a fine and warning.',
      'Many Faridabad stops happen on the busy Mathura Road corridor, so the recorded BAC and the test procedure at the naka are important details we review before court.',
    ],
    cityFaqs: [
      {
        q: 'Which court handles Faridabad drink and drive cases?',
        a: 'Faridabad cases are heard at the District Court in Sector 12, Faridabad. Your summons will mention the exact court and hearing date.',
      },
      {
        q: 'Can a Faridabad drink and drive case be settled at Lok Adalat?',
        a: 'For many first-time cases with no accident, yes — Lok Adalat is commonly used to close the matter with a fine. We confirm whether your case qualifies based on the BAC reading and case stage.',
      },
      {
        q: 'What if I was caught on Mathura Road heading to Delhi?',
        a: 'Jurisdiction follows where you were stopped. If it was within Faridabad limits, the case stays with Faridabad police and court. We help confirm this from your documents.',
      },
    ],
  },
  {
    slug: 'chandigarh',
    cityName: 'Chandigarh',
    stateName: 'Chandigarh',
    vehiclePrefix: 'CH',
    trafficPolice: 'Chandigarh Traffic Police',
    court: 'District Courts, Chandigarh (Sector 43)',
    metaTitle: 'Caught for Drink & Drive in Chandigarh? What to Do | Settlement Help',
    metaDescription:
      'Drink & drive case in Chandigarh? Understand Section 185 penalties, the District Court process, Lok Adalat settlement & how to protect your licence. Free WhatsApp case review.',
    h1: 'Caught for Drink & Drive in Chandigarh? Here\'s What to Do',
    heroSubheading:
      'A Section 185 drink & drive charge in Chandigarh is a criminal case. Understand your penalties, the court process, and your fastest legal settlement option.',
    introParagraphs: [
      'Chandigarh has one of the highest per-capita rates of drunk-driving enforcement in the region, with Chandigarh Traffic Police running heavy late-night checks around the Sector 26 and Sector 35 nightlife belts and the city\'s roundabouts. If your breathalyzer crossed the legal limit, you are booked under Section 185 of the Motor Vehicles Act — a criminal offence, not a routine challan.',
      'It cannot be cleared online. You will normally be summoned to the District Courts in Chandigarh, and how you prepare before that hearing decides whether you face only a fine or jail risk, a long licence suspension, and a criminal record.',
    ],
    localAngleHeading: 'How Drink & Drive Cases Work in Chandigarh',
    localAngleParagraphs: [
      'Chandigarh drink-and-drive cases are prosecuted at the District Courts complex in Sector 43. First-time cases without an accident are frequently resolved through Lok Adalat with a fine and warning.',
      'Chandigarh\'s strict enforcement means BAC readings are recorded carefully and produced in court, so reviewing the procedure followed at the checkpoint is especially worthwhile here.',
    ],
    cityFaqs: [
      {
        q: 'Where is a Chandigarh drink and drive case heard?',
        a: 'Chandigarh drink-and-drive cases are prosecuted at the District Courts complex in Sector 43. Your summons will list the court and date.',
      },
      {
        q: 'Is enforcement really stricter in Chandigarh?',
        a: 'Chandigarh consistently reports very high drunk-driving enforcement per capita, with frequent late-night checks around Sector 26 and Sector 35. Cases are documented and produced in court, which makes early case review especially useful.',
      },
      {
        q: 'Can a first-time Chandigarh case be settled with just a fine?',
        a: 'In most first-time cases without an accident, courts impose a fine and warning rather than jail. Lok Adalat is also commonly used. A prepared case improves your odds of a fine-only outcome.',
      },
    ],
  },
  {
    slug: 'mumbai',
    cityName: 'Mumbai',
    stateName: 'Maharashtra',
    vehiclePrefix: 'MH',
    trafficPolice: 'Mumbai Traffic Police',
    court: 'Metropolitan Magistrate courts (Esplanade, Bandra, Andheri)',
    metaTitle: 'Caught for Drink & Drive in Mumbai? What to Do | Settlement Help',
    metaDescription:
      'Drink & drive case in Mumbai? Understand Section 185 penalties, the Metropolitan Magistrate court process, Lok Adalat settlement & licence recovery. Free WhatsApp case review.',
    h1: 'Caught for Drink & Drive in Mumbai? Here\'s What to Do',
    heroSubheading:
      'A Section 185 drink & drive charge in Mumbai is a criminal case, not a normal challan. Know your penalties, the court process, and your fastest legal settlement route.',
    introParagraphs: [
      'Mumbai Traffic Police runs some of India\'s strictest drunk-driving nakabandis, concentrated around nightlife zones like Bandra, Andheri, Lower Parel, and the Western and Eastern Express Highways late at night and on weekends. If your breathalyzer read above the legal limit, your case is registered under Section 185 of the Motor Vehicles Act — a criminal offence rather than a routine traffic fine.',
      'It will not disappear by paying online. You are typically produced before or summoned to a Metropolitan Magistrate court, and Mumbai courts are known for taking drunk driving seriously — making early, prepared action important to keep the outcome to a fine rather than jail and a long licence suspension.',
    ],
    localAngleHeading: 'How Drink & Drive Cases Work in Mumbai',
    localAngleParagraphs: [
      'Mumbai drink-and-drive cases are prosecuted before the Metropolitan Magistrate courts — Esplanade, Bandra, and Andheri among them — depending on where you were stopped.',
      'Mumbai enforcement is aggressive and well documented, and Maharashtra has at times applied its own fine structure, so confirming the exact charge, BAC reading, and applicable fine for your case matters before you head to court.',
    ],
    cityFaqs: [
      {
        q: 'Which court will my Mumbai drink and drive case go to?',
        a: 'It depends on where you were caught. Mumbai cases are heard by the Metropolitan Magistrate at courts such as Esplanade, Bandra, or Andheri. Your summons or production memo will mention the court.',
      },
      {
        q: 'Is the fine for drink and drive different in Mumbai?',
        a: 'The base offence is Section 185 (up to ₹10,000 for a first offence nationally), but Maharashtra has at times applied its own amounts and enforcement is strict. We confirm the exact fine and charge applicable to your Mumbai case.',
      },
      {
        q: 'Mumbai police produced me in court the same day — is that normal?',
        a: 'For higher BAC readings or where behaviour was an issue, Mumbai police may produce offenders before a magistrate quickly. This is why understanding your options early, ideally before the hearing, is important.',
      },
    ],
  },
  {
    slug: 'pune',
    cityName: 'Pune',
    stateName: 'Maharashtra',
    vehiclePrefix: 'MH',
    trafficPolice: 'Pune Traffic Police',
    court: 'District Court, Pune (Shivajinagar)',
    metaTitle: 'Caught for Drink & Drive in Pune? What to Do | Settlement Help',
    metaDescription:
      'Drink & drive case in Pune? Understand Section 185 penalties, the District Court process, Lok Adalat settlement & how to protect your licence. Free WhatsApp case review.',
    h1: 'Caught for Drink & Drive in Pune? Here\'s What to Do',
    heroSubheading:
      'A drink & drive charge in Pune is a criminal case under Section 185. Understand your penalties, the court process, and your fastest legal way to settle.',
    introParagraphs: [
      'Pune Traffic Police runs frequent and well-publicised drunk-driving drives around the Koregaon Park, Baner, and Viman Nagar nightlife belts and along the major IT-corridor roads on weekend nights. A reading above the legal limit means you are booked under Section 185 of the Motor Vehicles Act — a criminal charge, not a normal challan.',
      'It cannot be settled by an online payment. You will usually be summoned to the District Court in Pune, and what you do before that hearing decides whether the outcome is a fine or jail risk, a long licence suspension, and a criminal record.',
    ],
    localAngleHeading: 'How Drink & Drive Cases Work in Pune',
    localAngleParagraphs: [
      'Pune drink-and-drive cases are prosecuted at the District Court in Shivajinagar. First-time cases without an accident are commonly resolved through Lok Adalat with a fine and warning.',
      'Pune\'s drives are aggressive and well documented, and Maharashtra has at times applied its own fine amounts, so confirming the exact charge and fine for your case is worthwhile before court.',
    ],
    cityFaqs: [
      {
        q: 'Where is a Pune drink and drive case heard?',
        a: 'Pune drink-and-drive cases are prosecuted at the District Court in Shivajinagar. Your summons will list the court and hearing date.',
      },
      {
        q: 'Can a Pune first-time case be settled at Lok Adalat?',
        a: 'For many first-time cases with no accident, yes — Lok Adalat is commonly used in Pune to close such cases with a fine and warning. We confirm whether yours qualifies.',
      },
      {
        q: 'Is the drink and drive fine different in Pune?',
        a: 'The base offence is Section 185, but Maharashtra has at times applied its own amounts. We confirm the exact fine applicable to your Pune case before you decide anything.',
      },
    ],
  },
  {
    slug: 'bangalore',
    cityName: 'Bangalore',
    stateName: 'Karnataka',
    vehiclePrefix: 'KA',
    trafficPolice: 'Bengaluru Traffic Police',
    court: 'Magistrate courts / Traffic Lok Adalat, Bengaluru',
    metaTitle: 'Caught for Drink & Drive in Bangalore? What to Do | Settlement Help',
    metaDescription:
      'Drink & drive case in Bangalore? Understand Section 185 penalties, the court process, Lok Adalat settlement & how to protect your licence. Free WhatsApp case review.',
    h1: 'Caught for Drink & Drive in Bangalore? Here\'s What to Do',
    heroSubheading:
      'A Section 185 drink & drive charge in Bengaluru is a criminal case. Know your penalties, the court process, and your fastest legal settlement route.',
    introParagraphs: [
      'Bengaluru Traffic Police is known for large, coordinated weekend drunk-driving checks around the MG Road, Indiranagar, Koramangala, and Brigade Road pub belts, often catching hundreds of riders and drivers in a single night. If your breathalyzer read above the legal limit, your case is registered under Section 185 of the Motor Vehicles Act — a criminal offence, not a routine challan.',
      'It will not be closed by an online payment. You are typically summoned to a magistrate court, and given Bengaluru\'s volume of cases and structured Lok Adalat sittings, acting early and prepared is what keeps the outcome to a fine rather than jail and a long licence suspension.',
    ],
    localAngleHeading: 'How Drink & Drive Cases Work in Bangalore',
    localAngleParagraphs: [
      'Bengaluru drink-and-drive cases are prosecuted before the magistrate courts, and the city regularly uses dedicated Traffic Lok Adalat sittings to clear large volumes of first-time cases with a fine.',
      'Because Bengaluru\'s checks process so many people in one drive, the documentation and exact BAC reading on your record matter — details we review before preparing you for the hearing.',
    ],
    cityFaqs: [
      {
        q: 'Does Bangalore really catch hundreds in one drunk-driving drive?',
        a: 'Yes — Bengaluru Traffic Police runs large coordinated weekend checks around pub-heavy areas like Indiranagar, Koramangala, and MG Road that catch very high numbers in a single night. Cases are then sent to court or Lok Adalat.',
      },
      {
        q: 'Can a Bangalore drink and drive case be settled at Lok Adalat?',
        a: 'For many first-time cases with no accident, yes. Bengaluru uses dedicated Traffic Lok Adalat sittings to clear such cases with a fine and warning. We confirm whether yours qualifies.',
      },
      {
        q: 'Is the drink and drive fine different in Karnataka?',
        a: 'The base offence is Section 185, but Karnataka has at times applied its own amounts. We confirm the exact fine applicable to your Bengaluru case before you decide on a route.',
      },
    ],
  },
  {
    slug: 'hyderabad',
    cityName: 'Hyderabad',
    stateName: 'Telangana',
    vehiclePrefix: 'TS',
    trafficPolice: 'Hyderabad Traffic Police',
    court: 'Metropolitan / Magistrate courts, Hyderabad',
    metaTitle: 'Caught for Drink & Drive in Hyderabad? What to Do | Settlement Help',
    metaDescription:
      'Drink & drive case in Hyderabad? Understand Section 185 penalties, the mandatory court production process, Lok Adalat settlement & licence recovery. Free WhatsApp case review.',
    h1: 'Caught for Drink & Drive in Hyderabad? Here\'s What to Do',
    heroSubheading:
      'A Section 185 drink & drive charge in Hyderabad is a criminal case, and the city is known for producing offenders before court. Know your penalties and options.',
    introParagraphs: [
      'Hyderabad Traffic Police is well known for its strict drunk-driving enforcement, with heavy weekend checks around Jubilee Hills, Gachibowli, Hitec City, and the Banjara Hills nightlife belt. Unlike a normal challan, Hyderabad routinely produces drunk-driving offenders before a magistrate, and courts here have ordered fines, community service, and even short jail terms.',
      'Because your case is registered under Section 185 of the Motor Vehicles Act — a criminal offence — it cannot be cleared online. How you prepare for the court production decides whether you face only a fine or jail risk, a long licence suspension, and a criminal record.',
    ],
    localAngleHeading: 'How Drink & Drive Cases Work in Hyderabad',
    localAngleParagraphs: [
      'Hyderabad is distinctive in that offenders are commonly produced before a Metropolitan/Magistrate court rather than just fined, and the court decides the penalty — which can include fines, counselling, community service, or jail in serious cases.',
      'This makes being prepared for the hearing especially important in Hyderabad. We review your BAC reading, the procedure followed, and present your mitigation for the court date.',
    ],
    cityFaqs: [
      {
        q: 'Is it true Hyderabad sends drunk drivers to court instead of just fining them?',
        a: 'Largely yes. Hyderabad Traffic Police commonly produces drunk-driving offenders before a magistrate, and the court decides the penalty — which can range from a fine and counselling to community service or jail in serious cases. This makes preparing for the hearing important.',
      },
      {
        q: 'Which court handles Hyderabad drink and drive cases?',
        a: 'Cases are heard before the Metropolitan/Magistrate courts in Hyderabad. You will be produced before or summoned to the court covering the area where you were stopped.',
      },
      {
        q: 'Can a first-time Hyderabad case avoid jail?',
        a: 'In most first-time cases without an accident, courts impose a fine (and sometimes counselling or community service) rather than jail. A prepared case and good mitigation improve your odds of a fine-only outcome.',
      },
    ],
  },
];

// ─── Shared FAQs templated per city (merged with cityFaqs for depth) ───────────

function buildSharedFaqs(cityName: string): DrinkDriveFAQ[] {
  return [
    {
      q: `What is the penalty for drink and drive in ${cityName}?`,
      a: `Under Section 185 of the Motor Vehicles Act, 1988 (post-2019 amendment), a first offence carries a fine of up to ₹10,000 or imprisonment up to 6 months or both, plus a 6-12 month licence suspension. A repeat offence within 3 years can mean up to ₹15,000 or up to 2 years. A few states apply different fine amounts — we confirm the exact figure for ${cityName}.`,
    },
    {
      q: `Can a drink and drive case in ${cityName} be settled?`,
      a: `Yes. Depending on the stage and severity, ${cityName} cases can be resolved through Lok Adalat (fastest and cheapest for first offences), a court compromise or guilty plea aimed at a fine-only outcome, or a full legal defence if the breathalyzer or procedure was faulty. We tell you which route realistically applies before you pay anything.`,
    },
    {
      q: `Do I need a lawyer for a drink and drive case in ${cityName}?`,
      a: `It is strongly advisable. A Section 185 charge is criminal, the hearing is before a magistrate, and the outcome affects your licence, record, and even employment. Legal guidance helps you choose the right settlement route, prepare documents, and present mitigation so you are not navigating the ${cityName} court alone.`,
    },
    {
      q: `How can a first-time offender in ${cityName} avoid jail?`,
      a: `In most first-time cases — no accident, no injury, BAC not extremely high — magistrates impose a fine, a warning, and a temporary licence suspension rather than jail. The 6-month term is a maximum, not a minimum. A clean record, the right plea, and procedural points raised in your favour significantly improve the chance of a fine-only outcome in ${cityName}.`,
    },
    {
      q: `Will my insurance cover an accident if I was drink driving in ${cityName}?`,
      a: `No. Driving under the influence is a standard exclusion in almost every motor insurance policy in India. If you were over the legal limit, the insurer can reject both own-damage and third-party claims, leaving you personally liable — often a far bigger cost than the fine itself.`,
    },
  ];
}

// ─── Accessors ─────────────────────────────────────────────────────────────────

const CITY_MAP = new Map<string, DrinkDriveCity>(CITIES.map((c) => [c.slug, c]));

export function getDrinkDriveCity(slug: string): DrinkDriveCity | null {
  return CITY_MAP.get(slug.toLowerCase()) ?? null;
}

export function getAllDrinkDriveCitySlugs(): string[] {
  return CITIES.map((c) => c.slug);
}

export function getAllDrinkDriveCities(): DrinkDriveCity[] {
  return CITIES;
}

// Returns the full FAQ list for a city: city-specific first, then shared national.
export function getDrinkDriveCityFaqs(city: DrinkDriveCity): DrinkDriveFAQ[] {
  return [...city.cityFaqs, ...buildSharedFaqs(city.cityName)];
}
