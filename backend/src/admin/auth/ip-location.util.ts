import * as geoip from 'geoip-lite';

// geoip-lite only gives an ISO country code (e.g. "BR") — spell it out
// ("Brazil") so a country-only match doesn't read as a cryptic two-letter code.
const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });

/**
 * Offline lookup (bundled MaxMind-lite DB, no network call) — deliberately not
 * a remote geolocation API, so a lookup failure/latency can never affect the
 * login path itself.
 */
export function resolveLoginLocation(ip?: string | null): string | null {
  if (!ip) return null;

  // IPv4-mapped IPv6 (common behind proxies, e.g. "::ffff:203.0.113.5")
  const normalized = ip.startsWith('::ffff:') ? ip.slice(7) : ip;

  const geo = geoip.lookup(normalized);
  if (!geo) return null;

  const country = geo.country ? (countryNames.of(geo.country) ?? geo.country) : undefined;
  return [geo.city, geo.region, country].filter(Boolean).join(', ') || null;
}
