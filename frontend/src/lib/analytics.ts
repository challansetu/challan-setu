// Lightweight GA4 event helper.
//
// Safe to call anywhere: it no-ops on the server and until the gtag script
// (loaded in app/layout.tsx when NEXT_PUBLIC_GA_ID is set) is available.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Track any GA4 event. Use snake_case names (GA4 convention).
 * No-ops on the server / before gtag is ready, so it's always safe to call.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

/** Track a banner click in GA4 as a `banner_click` event. */
export function trackBannerClick(bannerName: string, extra?: Record<string, unknown>) {
  trackEvent('banner_click', { banner_name: bannerName, ...extra });
}

/** Track a WhatsApp CTA click. `location` describes where the button is. */
export function trackWhatsAppClick(location: string, extra?: Record<string, unknown>) {
  trackEvent('whatsapp_click', { location, ...extra });
}
