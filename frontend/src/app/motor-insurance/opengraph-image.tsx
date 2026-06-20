import { ImageResponse } from 'next/og';

// Open Graph card for /motor-insurance, used by WhatsApp, Facebook, LinkedIn,
// iMessage, Telegram, Slack when the page link is shared. Mirrors the styling of
// the root opengraph-image.tsx but uses the insurance page's dark/yellow theme.
export const runtime = 'edge';
export const alt = 'Check Motor Insurance Status by Vehicle Number, Free via VAHAN';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BRAND_DARK = '#1c1c24';
const BRAND_YELLOW = '#f5c842';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #252530 50%, #1a1a22 100%)`,
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
        {/* Eyebrow badge */}
        <div
          style={{
            background: 'rgba(245,200,66,0.12)',
            border: '1px solid rgba(245,200,66,0.30)',
            borderRadius: '100px',
            padding: '10px 28px',
            color: BRAND_YELLOW,
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '36px',
            display: 'flex',
          }}
        >
          Car · Bike · Truck · Commercial
        </div>

        {/* Headline */}
        <div
          style={{
            color: BRAND_YELLOW,
            fontSize: '76px',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            textAlign: 'center',
            marginBottom: '24px',
            display: 'flex',
          }}
        >
          Check Motor Insurance Status
        </div>

        {/* Sub-headline */}
        <div
          style={{
            color: 'white',
            fontSize: '40px',
            fontWeight: 800,
            marginBottom: '28px',
            textAlign: 'center',
            display: 'flex',
          }}
        >
          by Vehicle Number, Free &amp; Instant
        </div>

        {/* Sub-description */}
        <div
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '26px',
            textAlign: 'center',
            maxWidth: '820px',
            lineHeight: 1.5,
            display: 'flex',
          }}
        >
          See if your policy is active, expiring soon, or expired, verified against the VAHAN government database.
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
          www.challansetu.com/motor-insurance
        </div>
      </div>
    ),
    { ...size },
  );
}
