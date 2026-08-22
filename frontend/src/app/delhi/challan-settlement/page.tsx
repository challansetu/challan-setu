import type { Metadata } from 'next';
import { CityPageTemplate } from '@/components/CityPageTemplate';
import cityPagesData from '@/data/city-pages.json';
import { SITE_URL } from '@/lib/site-url';

// Get Delhi data
const delhi = cityPagesData.cities.find(c => c.id === 'delhi')!;

export const metadata: Metadata = {
  // metaTitle already carries the brand suffix — don't let the layout add a second.
  title: { absolute: delhi.metaTitle },
  description: delhi.metaDescription,
  alternates: {
    canonical: `${SITE_URL}/delhi/challan-settlement`,
  },
  openGraph: {
    title: delhi.metaTitle,
    description: delhi.metaDescription,
    url: '/delhi/challan-settlement',
    siteName: 'ChallanSetu',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
  keywords: delhi.localKeywords,
};

export default function DelhiChallanSettlement() {
  return <CityPageTemplate city={delhi} />;
}
