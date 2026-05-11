import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section aria-label="Traffic Challan Guides" className="pt-16 sm:pt-20 bg-white">
      {/* Header */}
      <div className="container-app">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1.5 text-primary-500">
              Learn &amp; save
            </p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 leading-none">
              Traffic Challan Guides
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            All guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Scroll track — lives outside container-app so nothing clips pointer events */}
      <div className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 sm:px-6 lg:px-8 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex-none w-[78vw] sm:w-[42vw] lg:w-[320px] snap-start"
          >
            {/* Cover image */}
            <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true" className="block">
              <div className="relative w-full overflow-hidden bg-gray-100" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 42vw, 320px"
                />
              </div>
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full w-fit mb-3">
                {post.category}
              </span>
              <h3 className="text-base font-bold text-gray-900 mb-3 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-5 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 group-hover:gap-2 transition-all"
                >
                  Read more<span className="sr-only"> – {post.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
        {/* trailing spacer so last card doesn't hug the edge */}
        <div className="flex-none w-4 sm:w-6 lg:w-8" aria-hidden="true" />
      </div>

      {/* Mobile view-all */}
      <div className="pb-6 text-center sm:hidden">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          View all guides <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
