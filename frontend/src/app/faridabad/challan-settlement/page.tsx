import type { Metadata } from 'next';
import { CityPageTemplate } from '@/components/CityPageTemplate';
import cityPagesData from '@/data/city-pages.json';
import { SITE_URL } from '@/lib/site-url';

const faridabad = cityPagesData.cities.find(c => c.id === 'faridabad')!;

export const metadata: Metadata = {
  // metaTitle already carries the brand suffix — don't let the layout add a second.
  title: { absolute: faridabad.metaTitle },
  description: faridabad.metaDescription,
  alternates: {
    canonical: `${SITE_URL}/faridabad/challan-settlement`,
  },
  openGraph: {
    title: faridabad.metaTitle,
    description: faridabad.metaDescription,
    url: '/faridabad/challan-settlement',
    siteName: 'ChallanSetu',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
  keywords: faridabad.localKeywords,
};

export default function FaridabadChallanSettlement() {
  return <CityPageTemplate city={faridabad} />;
}
