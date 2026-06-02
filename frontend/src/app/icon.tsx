import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#111111',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
        }}
      >
        {/* Yellow triangle / bracket mark from the logo */}
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
          {/* Top chevron */}
          <path
            d="M30 45 L50 20 L70 45"
            stroke="#EAB308"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Bottom bracket */}
          <path
            d="M25 70 L25 80 L75 80 L75 70"
            stroke="#EAB308"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
