interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Reusable schema builders ─────────────────────────────────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ChallanSetu',
    alternateName: ['Challan Setu', 'challansetu'],
    url: SITE_URL,
    logo: `${SITE_URL}/challan-logo.svg`,
    description:
      'Challan Setu helps vehicle owners get challan assistance and settlement support in Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad with savings that can go up to 50% on eligible challans and zero convenience fee.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'challansetu@gmail.com',
      availableLanguage: ['Hindi', 'English'],
    },
    areaServed: ['Delhi', 'Noida', 'Gurgaon', 'Ghaziabad', 'Faridabad'],
    sameAs: [
      'https://www.instagram.com/challansetu/',
      'https://www.linkedin.com/company/challan-setu/',
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ChallanSetu',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'LegalService'],
    '@id': `${SITE_URL}/#business`,
    name: 'ChallanSetu',
    url: SITE_URL,
    telephone: '+91-8796323876',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Geeta Colony',
      addressLocality: 'Delhi',
      addressRegion: 'Delhi NCR',
      postalCode: '110031',
      addressCountry: 'IN',
    },
    image: `${SITE_URL}/challan-logo.svg`,
    description:
      'Challan Setu helps Delhi NCR vehicle owners legally settle traffic challans through Lok Adalat and lawyer support, saving up to 50% on eligible fines. No court visit required.',
    email: 'challansetu@gmail.com',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Online Payment, UPI, Net Banking',
    serviceType: 'Traffic Challan Settlement',
    knowsAbout: [
      'Traffic Challan Settlement',
      'Lok Adalat',
      'Traffic Fine Reduction',
      'Delhi NCR Traffic Laws',
      'Motor Vehicle Act',
    ],
    inLanguage: ['en-IN', 'hi'],
    areaServed: [
      { '@type': 'City', name: 'Delhi',     containedInPlace: { '@type': 'Country', name: 'India' } },
      { '@type': 'City', name: 'Noida',     containedInPlace: { '@type': 'Country', name: 'India' } },
      { '@type': 'City', name: 'Gurgaon',   containedInPlace: { '@type': 'Country', name: 'India' } },
      { '@type': 'City', name: 'Ghaziabad', containedInPlace: { '@type': 'Country', name: 'India' } },
      { '@type': 'City', name: 'Faridabad', containedInPlace: { '@type': 'Country', name: 'India' } },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
    // NOTE: No aggregateRating here — Google forbids self-serving review markup
    // without genuine, visible on-page reviews (risks a manual action). Add it
    // back only once real reviews are collected AND rendered on the page.
    makesOffer: {
      '@type': 'Offer',
      name: 'Traffic Challan Settlement — Up to 50% Off',
      description:
        'Legal traffic challan settlement via Lok Adalat. Save up to 50% on eligible fines in Delhi NCR. Money-back guarantee if settlement is not achieved.',
      priceCurrency: 'INR',
      eligibleRegion: ['Delhi', 'Noida', 'Gurgaon', 'Ghaziabad', 'Faridabad'],
      offeredBy: { '@type': 'Organization', name: 'ChallanSetu', url: SITE_URL },
    },
  };
}

export function serviceSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${SITE_URL}${url}`,
    provider: {
      '@type': 'Organization',
      name: 'ChallanSetu',
      url: SITE_URL,
    },
    areaServed: ['Delhi', 'Noida', 'Gurgaon', 'Ghaziabad', 'Faridabad'],
    offers: {
      '@type': 'Offer',
      description: 'Savings up to 50% depending on challan details. Zero convenience fee.',
      priceCurrency: 'INR',
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function itemListSchema(items: { name: string; url: string; description?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${SITE_URL}${item.url}`,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

export function howToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function articleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  url,
}: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    author: {
      '@type': 'Organization',
      name: 'ChallanSetu',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ChallanSetu',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/challan-logo.svg`,
      },
    },
    datePublished,
    dateModified: dateModified ?? datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${url}`,
    },
  };
}

export function faqSchema(questions: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };
}

export function webPageSchema({
  title,
  description,
  url,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}${url}`,
    inLanguage: 'en-IN',
    isPartOf: { '@type': 'WebSite', url: SITE_URL, name: 'ChallanSetu' },
    publisher: { '@type': 'Organization', name: 'ChallanSetu', url: SITE_URL },
    ...(dateModified ? { dateModified } : {}),
  };
}

/**
 * Returns all schema objects for a city landing page.
 * Render each with a separate <JsonLd data={schema} /> tag.
 */
export function cityPageSchemas({
  title,
  cityName,
  description,
  canonicalPath,
  vehiclePrefix,
  faqs,
  dateModified,
}: {
  title: string;
  cityName: string;
  description: string;
  canonicalPath: string;
  vehiclePrefix: string;
  faqs: { q: string; a: string }[];
  dateModified?: string;
}) {
  return [
    organizationSchema(),
    webPageSchema({ title, description, url: canonicalPath, dateModified }),
    serviceSchema({
      name: `${cityName} Vehicle Challan Discount Eligibility`,
      description: `Check ${cityName} vehicle challan discount eligibility and get support for eligible traffic challan settlement. ${vehiclePrefix}-registered vehicles are supported.`,
      url: canonicalPath,
    }),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Cities', url: '/cities' },
      { name: cityName, url: canonicalPath },
    ]),
    faqSchema(faqs),
  ];
}
