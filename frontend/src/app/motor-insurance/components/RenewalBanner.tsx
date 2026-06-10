import Image from 'next/image';
import Link from 'next/link';
import { RENEWAL_BANNER_TAGS, BRAND_BLUE } from '../data';

const POLICYBAZAAR_URL = 'https://www.policybazaar.com/motor-insurance/';

export function RenewalBanner() {
  return (
    <section className="pt-8 bg-white">
      <div className="container-app max-w-5xl">
        <Link
          href={POLICYBAZAAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl overflow-hidden"
          style={{ background: '#f0f6ff' }}
        >
          <div className="px-6 py-4 sm:px-10 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Image
                src="/icons/policybazaar.png"
                alt="PolicyBazaar"
                width={160}
                height={32}
                className="mb-2"
              />
              <h3 className="text-base font-bold text-gray-900 mb-1.5">
                Renew Your Insurance Instantly
              </h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {RENEWAL_BANNER_TAGS.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0">
              <span
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs text-white transition-all hover:-translate-y-0.5"
                style={{ background: BRAND_BLUE }}
              >
                Get Free Quotes →
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
