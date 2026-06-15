// Lightweight GA4 event helper.
//
// Safe to call anywhere: it no-ops on the server and until the gtag script
// (loaded in app/layout.tsx when NEXT_PUBLIC_GA_ID is set) is available.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Track a banner click in GA4 as a `banner_click` event. */
export function trackBannerClick(bannerName: string, extra?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'banner_click', { banner_name: bannerName, ...extra });
}
