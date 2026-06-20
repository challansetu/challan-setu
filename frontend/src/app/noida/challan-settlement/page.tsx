import type { Metadata } from 'next';
import { CityPageTemplate } from '@/components/CityPageTemplate';
import cityPagesData from '@/data/city-pages.json';

// Get Noida data
const noida = cityPagesData.cities.find(c => c.id === 'noida')!;

export const metadata: Metadata = {
  title: noida.metaTitle,
  description: noida.metaDescription,
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com'}/noida/challan-settlement`,
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
