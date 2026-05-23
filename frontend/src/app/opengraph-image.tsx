import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ChallanSetu – Settle Traffic Challans & Save 50%';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4338ca 50%, #4f46e5 75%, #6366f1 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* City badge */}
        <div
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '100px',
            padding: '10px 28px',
            color: '#a5b4fc',
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '36px',
            display: 'flex',
          }}
        >
          Delhi · Noida · Gurgaon · Ghaziabad · Faridabad
        </div>

        {/* Brand name */}
        <div
          style={{
            color: 'white',
            fontSize: '84px',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
            display: 'flex',
          }}
        >
          ChallanSetu
        </div>

        {/* Tagline */}
        <div
          style={{
            color: '#6ee7b7',
            fontSize: '42px',
            fontWeight: 800,
            marginBottom: '28px',
            textAlign: 'center',
            display: 'flex',
          }}
        >
          Settle Traffic Challans &amp; Save Up to 50%
        </div>

        {/* Sub-description */}
        <div
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '26px',
            textAlign: 'center',
            maxWidth: '760px',
            lineHeight: 1.5,
            display: 'flex',
          }}
        >
          Legal challan settlement via Lok Adalat. No court visits. Free consultation.
        </div>

        {/* Domain pill at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '44px',
            color: 'rgba(255,255,255,0.35)',
            fontSize: '20px',
            letterSpacing: '0.05em',
            display: 'flex',
          }}
        >
          www.challansetu.com
        </div>
      </div>
    ),
    { ...size },
  );
}
