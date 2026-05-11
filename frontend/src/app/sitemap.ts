import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { getAllCityPages } from '@/data/city-pages';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://challansetu.com';

interface BlogPost {
  slug: string;
  date: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const postsPath = path.join(process.cwd(), 'src/data/blog-posts.json');
  const blogPosts: BlogPost[] = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));

  return [
    // ── Homepage ──────────────────────────────────────────────────────────────
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1.0,
    },

    // ── Core static pages ─────────────────────────────────────────────────────
    {
      url: `${SITE_URL}/how-it-works`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/service-area`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    {
      url: `${SITE_URL}/cities`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // ── City SEO landing pages (/pay-vehicle-challan-in-{city}) ───────────────
    ...getAllCityPages().map((city) => ({
      url: `${SITE_URL}${city.canonicalPath}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),

    // ── Legal / policy pages ──────────────────────────────────────────────────
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms-of-service`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/refund-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },

    // ── Blog ──────────────────────────────────────────────────────────────────
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
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
