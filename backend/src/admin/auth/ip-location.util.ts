import * as geoip from 'geoip-lite';

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

  return [geo.city, geo.region, geo.country].filter(Boolean).join(', ') || null;
}
