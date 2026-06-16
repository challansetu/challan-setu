import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import siteData from '@/data/site.json';
import { JsonLd, organizationSchema, websiteSchema, localBusinessSchema } from '@/components/seo/JsonLd';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-jakarta' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

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
    shortcut: '/challan-logo.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Prevent iOS Safari from auto-zooming when a form field is focused.
  // (iOS 10+ still allows manual pinch-zoom, so accessibility is preserved.)
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#4f46e5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`scroll-smooth [overflow-x:clip] ${jakarta.variable}`}>
      <head>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <JsonLd data={localBusinessSchema()} />
      </head>
      <body className={`${inter.className} [overflow-x:clip]`}>
        <div className="min-h-screen flex flex-col w-full max-w-full">{children}</div>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
