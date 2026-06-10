import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd, breadcrumbSchema, faqSchema, articleSchema } from '@/components/seo/JsonLd';
import { getBlogPost, getAllBlogSlugs, type BlogBlock } from '@/data/blog';
import { Clock, Tag, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.challansetu.com';

// ─── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  const coverImage = post.coverImage;
  return {
    title: { absolute: post.metaTitle },
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

// ─── Block renderer ───────────────────────────────────────────────────────────

function Block({ block }: { block: BlogBlock }) {
  switch (block.kind) {
    case 'p':
      return (
        <p
          className="text-gray-700 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    case 'ul':
      return (
        <ul className="mb-4 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );

    case 'image':
      return (
        <figure className="my-6">
          <div className="relative w-full rounded-xl overflow-hidden border border-gray-100 shadow-sm" style={{ aspectRatio: '2 / 1' }}>
            <Image
              src={block.src}
              alt={block.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
          {block.caption && (
            <figcaption className="text-center text-xs text-gray-400 mt-2">{block.caption}</figcaption>
          )}
        </figure>
      );

    case 'table':
      return (
        <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-4 py-3 font-semibold text-gray-600 border-b border-gray-200"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-gray-100 last:border-0">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-3 text-gray-700 ${ci === 0 ? 'font-medium' : ''}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'steps':
      return (
        <div className="my-6 space-y-4">
          {block.items.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center mt-0.5" style={{ background: '#1c1c24', color: '#f5c842' }}>
                {i + 1}
              </div>
              <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                <p className="font-bold text-gray-900 mb-1">{step.title}</p>
                <p
                  className="text-gray-600 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: step.html }}
                />
              </div>
            </div>
          ))}
        </div>
      );

    case 'highlights':
      return (
        <div className="my-6 bg-amber-50 rounded-xl p-5 space-y-2">
          {block.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-gray-800 text-sm">
              <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      );

    case 'strong_bullets':
      return (
        <ul className="mb-4 space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700 text-sm leading-relaxed">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
              <span>
                <strong className="text-gray-900">{item.label}:</strong> {item.text}
              </span>
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: post.metaTitle,
          description: post.metaDescription,
          image: `${SITE_URL}${post.coverImage}`,
          datePublished: post.publishedAt,
          url: `/blog/${post.slug}`,
        })}
      />
      {post.faqs.length > 0 && <JsonLd data={faqSchema(post.faqs)} />}

      <Navbar />
      <main className="flex-1">

        {/* Article header */}
        <section className="relative overflow-hidden text-white py-12 sm:py-16" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>
          <div className="container-app max-w-3xl">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All articles
            </Link>

            {/* Category + reading time */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-white/10 text-white/80 px-3 py-1 rounded-full">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-white/60">
                <Clock className="w-3 h-3" />
                {post.readingTime} min read
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug mb-4">
              {post.title}
            </h1>

            <p className="text-white/60 text-sm">
              {formatDate(post.publishedAt)} · By ChallanSetu Team
            </p>
          </div>
        </section>

        {/* Article body */}
        <article className="py-10 sm:py-14">
          <div className="container-app max-w-3xl">

            {post.sections.map((section, si) => (
              <section key={si} className="mb-10">
                {section.heading && (
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5 pb-3 border-b border-gray-100">
                    {section.heading}
                  </h2>
                )}
                {section.blocks.map((block, bi) => (
                  <Block key={bi} block={block} />
                ))}
              </section>
            ))}

            {/* FAQ section */}
            {post.faqs.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5 pb-3 border-b border-gray-100">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-5">
                  {post.faqs.map((faq, i) => (
                    <div key={i} className="rounded-xl bg-gray-50 p-5">
                      <p className="font-bold text-gray-900 mb-2">{faq.q}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CTA box */}
            <div className="rounded-2xl text-white p-7 sm:p-9" style={{ background: 'linear-gradient(145deg, #1c1c24 0%, #252530 50%, #1a1a22 100%)' }}>
              <p className="text-lg font-black mb-3">Ready to check your challan?</p>
              <p
                className="text-white/80 text-sm leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: post.ctaHtml }}
              />
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ background: '#f5c842', color: '#1c1c24' }}
              >
                Check Eligibility Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </article>

        {/* Back to blog */}
        <div className="pb-12 container-app max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
