import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema, itemListSchema } from '@/components/seo/JsonLd';
import { getAllBlogPosts } from '@/data/blog';
import { Clock, ArrowRight, Tag } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';

export const metadata: Metadata = {
  title: { absolute: 'Traffic Challan Help & Guides | ChallanSetu Blog' },
  description:
    'Practical guides on challan discount, Lok Adalat settlement, court challans, and how to legally pay less on traffic fines in Delhi NCR.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Traffic Challan Help & Guides | ChallanSetu Blog',
    description:
      'Practical guides on challan discount, Lok Adalat settlement, and legally paying less on traffic fines in Delhi NCR.',
    url: `${SITE_URL}/blog`,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          posts.map((p) => ({ name: p.title, url: `/blog/${p.slug}`, description: p.excerpt }))
        )}
      />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden text-white py-14 sm:py-20" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>
          <div className="container-app text-center">
            <span className="inline-block bg-white/10 text-white/80 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
              ChallanSetu Blog
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Traffic Challan Help &amp; Guides
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto">
              Practical guides on challan discount, Lok Adalat settlement, and how to legally pay less on traffic fines in Delhi NCR.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="py-14 bg-surface-50">
          <div className="container-app">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Colour band placeholder */}
                  <div className="h-2" style={{ background: '#f5c842' }} />

                  <div className="flex flex-col flex-1 p-6">
                    {/* Category + read time */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min read
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-amber-700 transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-5">
                      {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-xs text-gray-400">{formatDate(post.publishedAt)}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 group-hover:gap-2 transition-all">
                        Read article <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container-app text-center">
            <p className="text-gray-500 text-sm mb-4">
              Ready to check if your challan qualifies for a discount?
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg"
              style={{ background: '#1c1c24', color: '#f5c842' }}
            >
              Check Eligibility Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
