import { ImageResponse } from 'next/og';

// Open Graph card for /drink-and-drive — used by WhatsApp, Facebook, LinkedIn,
// iMessage, Telegram, Slack when the page link is shared/forwarded (high-intent:
// people forward this to a friend who just got a drink-and-drive challan).
export const runtime = 'edge';
export const alt = 'Drink & Drive Challan — Penalty, Section 185 & Settlement Help';
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
          Section 185 · Jail Risk · License Suspension
        </div>

        <div
          style={{
            color: BRAND_YELLOW,
            fontSize: '80px',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            textAlign: 'center',
            marginBottom: '24px',
            display: 'flex',
          }}
        >
          Drink &amp; Drive Challan?
        </div>

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
          Penalty &amp; Legal Settlement Help
        </div>

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
          Understand your penalties and settlement options — get a free case review on WhatsApp.
        </div>

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
          www.challansetu.com/drink-and-drive
        </div>
      </div>
    ),
    { ...size },
  );
}
