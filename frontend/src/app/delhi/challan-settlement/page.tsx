import type { Metadata } from 'next';
import { CityPageTemplate } from '@/components/CityPageTemplate';
import cityPagesData from '@/data/city-pages.json';

// Get Delhi data
const delhi = cityPagesData.cities.find(c => c.id === 'delhi')!;

export const metadata: Metadata = {
  title: delhi.metaTitle,
  description: delhi.metaDescription,
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com'}/delhi/challan-settlement`,
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
