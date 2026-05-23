import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import siteData from '@/data/site.json';
import { JsonLd, organizationSchema, websiteSchema, localBusinessSchema } from '@/components/seo/JsonLd';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteData.meta.title,
    template: '%s | ChallanSetu',
  },
  description: siteData.meta.description,
  keywords: siteData.meta.keywords,
  authors: [{ name: 'ChallanSetu', url: SITE_URL }],
  creator: 'ChallanSetu',
  publisher: 'ChallanSetu',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: siteData.siteName,
    title: siteData.meta.title,
    description: siteData.meta.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteData.meta.title,
    description: siteData.meta.description,
    creator: '@challansetu',
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: '/challan-logo.svg',
    apple: '/challan-logo.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#4f46e5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className="scroll-smooth">
      <head>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <JsonLd data={localBusinessSchema()} />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">{children}</div>
      </body>
    </html>
  );
}
