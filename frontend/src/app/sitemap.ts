import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { getAllCityPages } from '@/data/city-pages';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';

interface BlogPost {
  slug: string;
  date: string;
}

// Site launched / last major update dates — update these when content changes
const LAUNCH_DATE        = new Date('2026-05-11'); // site went live
const CONTENT_DATE       = new Date('2026-05-24'); // last content update (homepage, FAQs)
const LEGAL_DATE         = new Date('2026-05-01'); // privacy / terms / refund

export default function sitemap(): MetadataRoute.Sitemap {
  const postsPath = path.join(process.cwd(), 'src/data/blog-posts.json');
  const blogPosts: BlogPost[] = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));

  // Latest blog post date drives the blog listing freshness
  const latestPostDate = blogPosts.reduce<Date>((latest, p) => {
    const d = new Date(p.date);
    return d > latest ? d : latest;
  }, LAUNCH_DATE);

  return [
    // ── Homepage ──────────────────────────────────────────────────────────────
    {
      url: SITE_URL,
      lastModified: CONTENT_DATE,
      changeFrequency: 'monthly',
      priority: 1.0,
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

    // ── City SEO landing pages (/pay-vehicle-challan-in-{city}) ───────────────
    ...getAllCityPages().map((city) => ({
      url: `${SITE_URL}${city.canonicalPath}`,
      lastModified: LAUNCH_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),

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
  ];
}
