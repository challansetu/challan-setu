import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { getAllCityPages } from '@/data/city-pages';
import { getAllDrinkDriveCitySlugs } from '@/data/drink-drive-cities';
import { SITE_URL } from '@/lib/site-url';

interface BlogPost {
  slug: string;
  date: string;
}

// Site launched / last major update dates — update these when content changes
const LAUNCH_DATE        = new Date('2026-05-11'); // site went live
const CONTENT_DATE       = new Date('2026-05-24'); // last content update (homepage, FAQs)
const LEGAL_DATE         = new Date('2026-05-01'); // privacy / terms / refund
const STATE_DATE         = new Date('2026-06-20'); // state e-challan pages updated
const INSURANCE_DATE     = new Date('2026-06-18'); // motor-insurance landing page
const CITY_DATE          = new Date('2026-06-20'); // NCR city pages added
const SERVICE_DATE       = new Date('2026-06-20'); // drink-and-drive service page

// Hand-authored blog pages that live outside blog-posts.json (own route folders).
// Keep the dates in sync with the datePublished/dateModified in each page.tsx.
const STANDALONE_POSTS = [
  { slug: 'drink-and-drive-challan-settlement',        date: new Date('2026-06-20') },
  { slug: 'license-suspension-appeal-drink-and-drive', date: new Date('2026-06-20') },
];

const STATE_SLUGS = [
  'andaman-nicobar', 'andhra-pradesh', 'arunachal-pradesh', 'assam',
  'bihar', 'chhattisgarh', 'dadra-nagar-haveli', 'daman-diu', 'delhi',
  'goa', 'gujarat', 'haryana', 'himachal-pradesh', 'jammu-kashmir',
  'jharkhand', 'karnataka', 'kerala', 'ladakh', 'lakshadweep',
  'madhya-pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram',
  'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim',
  'tamil-nadu', 'telangana', 'tripura', 'uttar-pradesh',
  'uttarakhand', 'west-bengal',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const postsPath = path.join(process.cwd(), 'src/data/blog-posts.json');
  const blogPosts: BlogPost[] = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));

  // Latest blog post date drives the blog listing freshness
  const allPostDates = [
    ...blogPosts.map((p) => new Date(p.date)),
    ...STANDALONE_POSTS.map((p) => p.date),
  ];
  const latestPostDate = allPostDates.reduce<Date>(
    (latest, d) => (d > latest ? d : latest),
    LAUNCH_DATE,
  );

  return [
    // ── Homepage ──────────────────────────────────────────────────────────────
    {
      url: SITE_URL,
      lastModified: CONTENT_DATE,
      changeFrequency: 'monthly',
      priority: 1.0,
    },

    // ── Motor insurance hub + vehicle-type spokes (high-priority money pages) ──
    {
      url: `${SITE_URL}/motor-insurance`,
      lastModified: INSURANCE_DATE,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/car-insurance`,
      lastModified: INSURANCE_DATE,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/bike-insurance`,
      lastModified: INSURANCE_DATE,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/commercial-vehicle-insurance`,
      lastModified: INSURANCE_DATE,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // ── Core static pages ─────────────────────────────────────────────────────
    {
      url: `${SITE_URL}/how-it-works`,
      lastModified: CONTENT_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: CONTENT_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/recover-stolen-vehicle`,
      lastModified: CONTENT_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/service-area`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/cities`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // ── Drink & Drive service page ────────────────────────────────────────────
    {
      url: `${SITE_URL}/drink-and-drive`,
      lastModified: SERVICE_DATE,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // ── Drink & Drive per-city long-tail pages ────────────────────────────────
    ...getAllDrinkDriveCitySlugs().map((slug) => ({
      url: `${SITE_URL}/drink-and-drive/${slug}`,
      lastModified: SERVICE_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),

    // ── Delhi NCR city challan settlement pages ───────────────────────────────
    ...['delhi', 'gurgaon', 'noida', 'ghaziabad', 'faridabad'].map((city) => ({
      url: `${SITE_URL}/${city}/challan-settlement`,
      lastModified: CITY_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),

    // ── Legacy city SEO landing pages (/pay-vehicle-challan-in-{city}) ────────
    // The 5 NCR cities that now have a /{city}/challan-settlement page 301
    // redirect there (next.config.js) to fix keyword cannibalization — only
    // Chandigarh (no new-style counterpart) is still served directly.
    ...getAllCityPages()
      .filter((city) => !['delhi', 'gurgaon', 'noida', 'ghaziabad', 'faridabad'].includes(city.slug))
      .map((city) => ({
        url: `${SITE_URL}${city.canonicalPath}`,
        lastModified: LAUNCH_DATE,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),

    // ── Hub / index pages for internal linking ────────────────────────────────
    {
      url: `${SITE_URL}/challan-settlement`,
      lastModified: CITY_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/e-challan`,
      lastModified: STATE_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // ── Legal / policy pages ──────────────────────────────────────────────────
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: LEGAL_DATE,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms-of-service`,
      lastModified: LEGAL_DATE,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/refund-policy`,
      lastModified: LEGAL_DATE,
      changeFrequency: 'yearly',
      priority: 0.4,
    },

    // ── State e-challan pages (/e-challan/{slug}) ─────────────────────────────
    ...STATE_SLUGS.map((slug) => ({
      url: `${SITE_URL}/e-challan/${slug}`,
      lastModified: STATE_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),

    // ── Blog ──────────────────────────────────────────────────────────────────
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestPostDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),

    // Standalone blog routes (not in blog-posts.json) — these back the
    // drink-and-drive cluster, so they carry the same priority as the JSON posts.
    ...STANDALONE_POSTS.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
