import type { Metadata } from 'next';
import { CityPageTemplate } from '@/components/CityPageTemplate';
import cityPagesData from '@/data/city-pages.json';

const ghaziabad = cityPagesData.cities.find(c => c.id === 'ghaziabad')!;

export const metadata: Metadata = {
  title: ghaziabad.metaTitle,
  description: ghaziabad.metaDescription,
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com'}/ghaziabad/challan-settlement`,
  },
  openGraph: {
    title: ghaziabad.metaTitle,
    description: ghaziabad.metaDescription,
    url: '/ghaziabad/challan-settlement',
    siteName: 'ChallanSetu',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
  keywords: ghaziabad.localKeywords,
};

export default function GhaziadChallanSettlement() {
  return <CityPageTemplate city={ghaziabad} />;
}
