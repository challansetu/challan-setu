/**
 * Single source of truth for the site's canonical absolute URLs.
 *
 * next.config.js permanently redirects the apex (challansetu.com) to www, so
 * www is the canonical host. Anything we emit for crawlers — canonical tags,
 * og:url, sitemap <loc>, robots.txt, JSON-LD @id — must already be on that
 * host: a canonical or sitemap URL that 301s is a wasted crawl and shows up in
 * Search Console as "Page with redirect".
 *
 * NEXT_PUBLIC_SITE_URL is still honoured (preview deploys, local dev), but an
 * apex-host value is normalised up to www so a misconfigured env var can never
 * reintroduce redirecting canonicals across the site.
 */

const DEFAULT_SITE_URL = 'https://www.challansetu.com';

/** Hosts that must be rewritten to their canonical www equivalent. */
const APEX_TO_WWW: Record<string, string> = {
  'challansetu.com': 'www.challansetu.com',
};

function normalizeSiteUrl(raw: string | undefined): string {
  const candidate = (raw ?? '').trim() || DEFAULT_SITE_URL;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    // A malformed env var must not break the build or emit garbage URLs.
    return DEFAULT_SITE_URL;
  }

  const canonicalHost = APEX_TO_WWW[url.hostname.toLowerCase()];
  if (canonicalHost) {
    url.hostname = canonicalHost;
  }

  // Keep localhost/preview hosts on http; force https for real hosts.
  const isLocal =
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname.endsWith('.local');
  if (!isLocal) {
    url.protocol = 'https:';
  }

  // Normalise to an origin with no trailing slash so `${SITE_URL}/path` is safe.
  return `${url.protocol}//${url.host}`;
}

/** Canonical site origin, never with a trailing slash. */
export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

/**
 * Build an absolute canonical URL for a site-relative path.
 * `absoluteUrl('/faq')` and `absoluteUrl('faq')` both yield `${SITE_URL}/faq`.
 */
export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return SITE_URL;
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  // Trailing slashes create a second indexable URL for the same page.
  const trimmed =
    withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/')
      ? withLeadingSlash.slice(0, -1)
      : withLeadingSlash;
  return `${SITE_URL}${trimmed}`;
}
