import type { Metadata } from 'next';
import { CityPageTemplate } from '@/components/CityPageTemplate';
import cityPagesData from '@/data/city-pages.json';
import { SITE_URL } from '@/lib/site-url';

// Get Gurgaon data
const gurgaon = cityPagesData.cities.find(c => c.id === 'gurgaon')!;

export const metadata: Metadata = {
  // metaTitle already carries the brand suffix — don't let the layout add a second.
  title: { absolute: gurgaon.metaTitle },
  description: gurgaon.metaDescription,
  alternates: {
    canonical: `${SITE_URL}/gurgaon/challan-settlement`,
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
