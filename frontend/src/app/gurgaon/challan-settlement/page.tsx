import type { Metadata } from 'next';
import { CityPageTemplate } from '@/components/CityPageTemplate';
import cityPagesData from '@/data/city-pages.json';

// Get Gurgaon data
const gurgaon = cityPagesData.cities.find(c => c.id === 'gurgaon')!;

export const metadata: Metadata = {
  title: gurgaon.metaTitle,
  description: gurgaon.metaDescription,
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com'}/gurgaon/challan-settlement`,
  },
  openGraph: {
    title: gurgaon.metaTitle,
    description: gurgaon.metaDescription,
    url: '/gurgaon/challan-settlement',
    siteName: 'ChallanSetu',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
  keywords: gurgaon.localKeywords,
};

export default function GurgaonChallanSettlement() {
  return <CityPageTemplate city={gurgaon} />;
}
