import type { Metadata } from 'next';
import { CityPageTemplate } from '@/components/CityPageTemplate';
import cityPagesData from '@/data/city-pages.json';
import { SITE_URL } from '@/lib/site-url';

// Get Noida data
const noida = cityPagesData.cities.find(c => c.id === 'noida')!;

export const metadata: Metadata = {
  // metaTitle already carries the brand suffix — don't let the layout add a second.
  title: { absolute: noida.metaTitle },
  description: noida.metaDescription,
  alternates: {
    canonical: `${SITE_URL}/noida/challan-settlement`,
  },
  openGraph: {
    title: noida.metaTitle,
    description: noida.metaDescription,
    url: '/noida/challan-settlement',
    siteName: 'ChallanSetu',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
  keywords: noida.localKeywords,
};

export default function NoidaChallanSettlement() {
  return <CityPageTemplate city={noida} />;
}
