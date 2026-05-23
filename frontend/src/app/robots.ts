import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Block all crawlers on non-production environments
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/thank-you',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
    // LLM-friendly index for AI assistants and crawlers
    // Full content at: ${SITE_URL}/llms.txt
  };
}
