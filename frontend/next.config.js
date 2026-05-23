/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  // Keep dev and production artifacts separate so `next build` never corrupts
  // the running `next dev` asset graph.
  distDir: isProduction ? '.next' : '.next-dev',
  output: isProduction ? 'standalone' : undefined,

  // Strict mode helps catch bugs early
  reactStrictMode: true,

  // Enable SWC minification for faster builds
  swcMinify: true,

  experimental: {
    // Ensures named imports from icon/component libraries are properly tree-shaken
    // even when the package uses a barrel-file pattern internally.
    optimizePackageImports: ['lucide-react'],
  },

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Redirect non-www → www to avoid duplicate content indexing
  async redirects() {
    return isProduction
      ? [
          {
            source: '/:path*',
            has: [{ type: 'host', value: 'challansetu.com' }],
            destination: 'https://www.challansetu.com/:path*',
            permanent: true,
          },
        ]
      : [];
  },

  // Rewrites for API proxying (optional; frontend can also call backend directly)
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return {
      beforeFiles: [
        {
          source: '/pay-vehicle-challan-in-:city',
          destination: '/city-pages/:city',
        },
      ],
      afterFiles: [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/api/:path*`,
        },
      ],
      fallback: [],
    };
  },

  // Headers for performance and security
  async headers() {
    const headers = [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];

    if (isProduction) {
      headers.push(
        {
          // Immutable cache for Next.js static chunks (they're content-hashed in production only)
          source: '/_next/static/:path*',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
        {
          // Cache public assets for 1 week in production
          source: '/(.*)\\.(ico|png|svg|jpg|jpeg|webp|avif|woff2|woff)',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
          ],
        }
      );
    }

    return headers;
  },
  compress: true,

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

};

module.exports = nextConfig;
