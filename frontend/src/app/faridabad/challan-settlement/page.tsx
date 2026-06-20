import type { Metadata } from 'next';
import { CityPageTemplate } from '@/components/CityPageTemplate';
import cityPagesData from '@/data/city-pages.json';

const faridabad = cityPagesData.cities.find(c => c.id === 'faridabad')!;

export const metadata: Metadata = {
  title: faridabad.metaTitle,
  description: faridabad.metaDescription,
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com'}/faridabad/challan-settlement`,
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
