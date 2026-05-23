import { ImageResponse } from 'next/og';
import { getBlogPost } from '@/data/blog';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  const title    = post?.title    ?? 'ChallanSetu Blog';
  const category = post?.category ?? 'Challan Guide';
  const readTime = post?.readingTime ?? 5;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 65%, #4f46e5 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Top — category pill + brand */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '100px',
              padding: '10px 24px',
              color: '#a5b4fc',
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            {category}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px', display: 'flex' }}>
            {readTime} min read
          </div>
        </div>

        {/* Middle — article title */}
        <div
          style={{
            color: 'white',
            fontSize: title.length > 60 ? '44px' : '52px',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            maxWidth: '900px',
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {title}
        </div>

        {/* Bottom — brand bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#6ee7b7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 900,
                color: '#1e1b4b',
              }}
            >
              C
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ color: 'white', fontSize: '22px', fontWeight: 800, display: 'flex' }}>
                ChallanSetu
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', display: 'flex' }}>
                www.challansetu.com
              </div>
            </div>
          </div>
          <div
            style={{
              background: '#6ee7b7',
              color: '#1e1b4b',
              fontSize: '16px',
              fontWeight: 800,
              padding: '12px 28px',
              borderRadius: '100px',
              display: 'flex',
            }}
          >
            Save up to 50% on challans
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
