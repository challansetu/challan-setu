import { NextRequest, NextResponse } from 'next/server';

const SOURCE_PATTERN = /^[a-zA-Z0-9_-]{1,100}$/;

// Server-side only — never exposed to the browser
const BACKEND_URL = process.env.BACKEND_INTERNAL_URL
  || process.env.NEXT_PUBLIC_API_URL
  || 'http://localhost:4000';

const REDIRECT_BASE = process.env.QR_REDIRECT_BASE_URL || 'https://www.challansetu.com';

export async function GET(
  req: NextRequest,
  { params }: { params: { source: string } },
) {
  const { source } = params;

  // Reject invalid sources — redirect to homepage without tracking
  if (!SOURCE_PATTERN.test(source)) {
    return NextResponse.redirect(REDIRECT_BASE, { status: 302 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    undefined;
  const userAgent = req.headers.get('user-agent') ?? undefined;
  const referrer = req.headers.get('referer') ?? undefined;

  // Fire-and-forget: tracking must never block or break the redirect
  trackScan({ source, ip, userAgent, referrer });

  const target = new URL(REDIRECT_BASE);
  target.searchParams.set('utm_source', 'qr');
  target.searchParams.set('utm_medium', 'poster');
  target.searchParams.set('utm_campaign', source);

  return NextResponse.redirect(target.toString(), { status: 302 });
}

function trackScan(data: {
  source: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
}) {
  fetch(`${BACKEND_URL}/api/qr-scans/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(3000),
  }).catch(() => {
    // Swallow errors — the redirect has already been sent
  });
}
