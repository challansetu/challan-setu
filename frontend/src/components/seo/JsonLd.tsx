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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://challansetu.com';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ChallanSetu',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      'ChallanSetu helps vehicle owners get challan assistance and settlement support in Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad with savings that can go up to 50% on eligible challans and zero convenience fee.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'challansetu@gmail.com',
      availableLanguage: ['Hindi', 'English'],
    },
    areaServed: ['Delhi', 'Noida', 'Gurgaon', 'Ghaziabad', 'Faridabad'],
    sameAs: [],
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
        urlTemplate: `${SITE_URL}/?vehicle={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ChallanSetu',
    url: SITE_URL,
    description:
      'Online traffic challan payment and settlement service for Delhi, Noida, Gurgaon, and Ghaziabad.',
    email: 'challansetu@gmail.com',
    priceRange: '₹',
    areaServed: [
      { '@type': 'City', name: 'Delhi' },
      { '@type': 'City', name: 'Noida' },
      { '@type': 'City', name: 'Gurgaon' },
      { '@type': 'City', name: 'Ghaziabad' },
      { '@type': 'City', name: 'Faridabad' },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
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
