import type { Metadata } from 'next';
import { CityPageTemplate } from '@/components/CityPageTemplate';
import cityPagesData from '@/data/city-pages.json';
import { SITE_URL } from '@/lib/site-url';

const ghaziabad = cityPagesData.cities.find(c => c.id === 'ghaziabad')!;

export const metadata: Metadata = {
  // metaTitle already carries the brand suffix — don't let the layout add a second.
  title: { absolute: ghaziabad.metaTitle },
  description: ghaziabad.metaDescription,
  alternates: {
    canonical: `${SITE_URL}/ghaziabad/challan-settlement`,
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
