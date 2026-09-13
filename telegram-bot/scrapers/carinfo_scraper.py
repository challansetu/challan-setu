"""
CarInfo scraper — direct HTTP with Chrome TLS impersonation.

Flow:
  1. GET carinfo.app/e-challan-check → session cookies + buildId
  2. GET _next/data/{buildId}/challan-details/{vehicle}.json
  3. Decrypt xdataprops (AES/CryptoJS)
  4. Return challan list

Anti-blocking:
  - curl_cffi impersonates Chrome 124 TLS fingerprint (JA3/JA4) — invisible to WAFs
  - sec-ch-ua / sec-ch-ua-mobile / sec-ch-ua-platform aligned with User-Agent
  - Correct sec-fetch-* for navigation vs XHR requests
  - Random 1–3s delay between page load and API call (human pacing)
  - Rotates across 3 desktop Chrome profiles (Windows/Linux/macOS) — mobile UAs
    are routed to CarInfo's App Router build, which has no _next/data endpoint
  - Auto-refreshes buildId on 404
  - BuildId cached 1 hour

Production behaviour:
  - Network errors → retry up to 3 times with exponential backoff
  - HTTP 429/5xx → retry with longer wait
  - Empty xdataprops / empty tabSection → return [] (genuinely no challans)
  - Anything else (no buildId, persistent 404, non-JSON, decryption failure,
    unexpected payload shape, retries exhausted) raises ScraperUnavailableError

An empty list means "this vehicle has no challans". A broken upstream raises.
Callers must not conflate the two — see scraper_api.py /search.
"""
from __future__ import annotations

import asyncio
import base64
import hashlib
import json
import logging
import os
import random
import re
import time
from typing import Optional

log = logging.getLogger("scraper.carinfo")


class ScraperUnavailableError(Exception):
    """Upstream is broken or has changed shape — distinct from 'no challans found'."""

_AES_KEY = b"Gx!7m$9zK@qW2vP"

_build_cache: dict = {"id": None, "ts": 0.0}
_BUILD_TTL = 3600  # seconds

# DESKTOP PROFILES ONLY — do not add mobile UAs here.
#
# On 2026-08-20 CarInfo migrated its MOBILE challan-details experience to the
# Next.js App Router, which has no /_next/data endpoint. Desktop still serves
# the legacy Pages Router build that exposes it. The routing decision is made
# purely from the User-Agent, and it is fully deterministic:
#
#     Android / Mobile UA  -> App Router  -> /_next/data/... 404s
#     Windows/macOS/Linux  -> Pages Router -> /_next/data/... 200 + xdataprops
#
# The old list held 3 mobile + 2 desktop profiles, so 3 in 5 lookups silently
# returned "no challans". Adding a mobile UA back here reintroduces that bug.
#
# Each profile: (user_agent, sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform)
_CHROME_PROFILES = [
    (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "?0",
        '"Windows"',
    ),
    (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "?0",
        '"Linux"',
    ),
    (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "?0",
        '"macOS"',
    ),
]

_MAX_RETRIES = 3
_RETRY_BACKOFF = [2.0, 5.0, 10.0]

_PROXY_URL = os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY") or None
if _PROXY_URL:
    log.info("CarInfo scraper: proxy configured (%s)", _PROXY_URL.split("@")[-1] if "@" in _PROXY_URL else _PROXY_URL)

# curl_cffi gives us real Chrome TLS fingerprint; fall back to httpx if not installed
try:
    from curl_cffi.requests import AsyncSession as _CurlSession
    _USE_CURL = True
    log.info("CarInfo scraper: curl_cffi available — Chrome TLS impersonation active")
except ImportError:
    import httpx as _httpx
    _USE_CURL = False
    log.warning("CarInfo scraper: curl_cffi not found — falling back to httpx (weaker anti-bot)")


def _page_headers(ua: str, sec_ch_ua: str, mobile: str, platform: str) -> dict:
    """Headers for a full page navigation (home page visit)."""
    return {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua": sec_ch_ua,
        "sec-ch-ua-mobile": mobile,
        "sec-ch-ua-platform": platform,
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent": ua,
    }


def _api_headers(ua: str, sec_ch_ua: str, mobile: str, platform: str, vn: str) -> dict:
    """Headers for the _next/data XHR request."""
    return {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        "referer": f"https://www.carinfo.app/challan-details/{vn}",
        "sec-ch-ua": sec_ch_ua,
        "sec-ch-ua-mobile": mobile,
        "sec-ch-ua-platform": platform,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": ua,
        "x-nextjs-data": "1",
        "src": "car-info_web",
        "city": "Delhi",
        "cityid": "10084",
    }


async def _fetch_build_id(session, ua: str, sec_ch_ua: str, mobile: str, platform: str) -> Optional[str]:
    try:
        resp = await session.get(
            "https://www.carinfo.app/e-challan-check",
            headers=_page_headers(ua, sec_ch_ua, mobile, platform),
            allow_redirects=True,
            timeout=15,
        )
        text = resp.text if hasattr(resp, "text") else resp.text
        m = re.search(r'"buildId"\s*:\s*"([^"]+)"', text)
        if m:
            return m.group(1)
        log.warning("buildId not found in CarInfo page HTML (status %d)", resp.status_code)
    except Exception as e:
        log.warning("Failed to fetch CarInfo buildId: %s", e)
    return None


async def _get_build_id(session, ua: str, sec_ch_ua: str, mobile: str, platform: str, force: bool = False) -> Optional[str]:
    """
    Always fetches the e-challan-check page to establish session cookies.
    Uses cached buildId when fresh to avoid parsing overhead, but the HTTP
    request itself is always made so CarInfo sets the required session cookie.
    Without that cookie the challan JSON endpoint returns a 302 to homepage.
    """
    now = time.monotonic()
    cached_ok = not force and _build_cache["id"] and (now - _build_cache["ts"]) < _BUILD_TTL

    build_id = await _fetch_build_id(session, ua, sec_ch_ua, mobile, platform)
    if build_id:
        _build_cache["id"] = build_id
        _build_cache["ts"] = now
        if not cached_ok:
            log.info("CarInfo buildId refreshed: %s", build_id)
        return build_id

    if cached_ok:
        log.warning("CarInfo page fetch failed, using cached buildId: %s", _build_cache["id"])
        return _build_cache["id"]

    return None


def _decrypt(xdata: str) -> Optional[dict]:
    try:
        pad = len(xdata) % 4
        if pad:
            xdata += "=" * (4 - pad)
        raw = base64.b64decode(xdata)
        if raw[:8] != b"Salted__":
            log.warning("CarInfo xdataprops missing Salted__ header")
            return None
        salt, ct = raw[8:16], raw[16:]

        d, di = b"", b""
        while len(d) < 48:
            di = hashlib.md5(di + _AES_KEY + salt).digest()
            d += di
        key, iv = d[:32], d[32:48]

        from Crypto.Cipher import AES
        dec = AES.new(key, AES.MODE_CBC, iv).decrypt(ct)
        return json.loads(dec[: -dec[-1]].decode())
    except Exception as e:
        log.warning("CarInfo decrypt error: %s", e)
        return None


def _safe_int(value) -> int:
    try:
        return int(str(value or 0).replace(",", ""))
    except (ValueError, TypeError):
        return 0


def _safe_str(value) -> str:
    if value is None:
        return ""
    return str(value).strip()


def _parse(data: dict, vn: str) -> list[dict]:
    state = vn[:2]
    results = []

    # A trustworthy empty result requires the expected envelope. The genuine
    # "no challans" payload is {"data": {"tabs": [{"tabSection": []}]}} — a
    # missing or malformed envelope is upstream breakage, not a clean vehicle.
    inner = data.get("data") if isinstance(data, dict) else None
    tabs = inner.get("tabs") if isinstance(inner, dict) else None
    if not isinstance(tabs, list) or not tabs or not isinstance(tabs[0], dict):
        raise ScraperUnavailableError(
            f"CarInfo payload shape changed for {vn}: missing or malformed 'data.tabs'"
        )

    # A vehicle with no challans comes back as a tab holding an empty-state
    # "message" block and no tabSection at all — that is a genuine empty result.
    # A tabSection of some *other* type means the envelope changed.
    tab_section = tabs[0].get("tabSection")
    if tab_section is None:
        return []
    if not isinstance(tab_section, list):
        raise ScraperUnavailableError(
            f"CarInfo payload shape changed for {vn}: 'tabSection' is "
            f"{type(tab_section).__name__}, expected list or absent"
        )

    for entry in tab_section:
        if not isinstance(entry, dict):
            continue

        try:
            amount = _safe_int(entry.get("amount"))

            offense_raw = entry.get("offense", {})
            offense = (
                offense_raw.get("value", "") if isinstance(offense_raw, dict)
                else _safe_str(offense_raw)
            )

            loc_raw = entry.get("location", {})
            location = loc_raw.get("value", "") if isinstance(loc_raw, dict) else ""

            results.append({
                "challanNo": "",
                "dlRcNumber": vn,
                "rcNo": vn,
                "State": state,
                "dateChallan": _safe_str(entry.get("date")),
                "detailsViolation": (
                    [{"offence": offense, "penalty": str(amount)}] if offense else []
                ),
                "locationChallan": location,
                "amountChallan": amount,
                "status": "Unpaid",
                "noReceipt": None,
                "challan_search_source": "CarInfo",
                "court_status_desc": "",
                "nameCourt": "",
            })
        except Exception as e:
            log.warning("CarInfo parse error on entry for %s: %s", vn, e)
            continue

    return results


class CarInfoScraper:
    """Chrome-impersonating HTTP scraper — no browser required."""

    async def __aenter__(self) -> "CarInfoScraper":
        return self

    async def __aexit__(self, *_) -> None:
        pass

    async def search_all_challans(self, vehicle_number: str) -> list[dict]:
        vn = vehicle_number.upper().replace(" ", "").replace("-", "")
        ua, sec_ch_ua, mobile, platform = random.choice(_CHROME_PROFILES)

        try:
            if _USE_CURL:
                return await self._run_with_curl(vn, ua, sec_ch_ua, mobile, platform)
            else:
                return await self._run_with_httpx(vn, ua, sec_ch_ua, mobile, platform)
        except ScraperUnavailableError:
            raise  # surface upstream breakage to the caller
        except Exception as e:
            log.error("CarInfo unexpected error for %s: %s", vn, e, exc_info=True)
            raise ScraperUnavailableError(f"CarInfo scrape failed for {vn}: {e}") from e

    async def _confirm_if_empty(self, result: list[dict], vn: str) -> list[dict]:
        """
        A first-attempt empty result (missing xdataprops) isn't trustworthy on
        its own — a session/cookie handshake hiccup on that one request can
        produce a page with no challan data even though the vehicle has some.
        Confirm with one independent fresh session (new cookies, new buildId)
        before accepting "no challans"; a terminal error on the confirmation
        attempt is swallowed rather than overriding the original result.
        """
        if result:
            return result

        log.info("CarInfo: empty result for %s — confirming with a fresh session before trusting it", vn)
        await asyncio.sleep(random.uniform(1.0, 2.5))
        ua, sec_ch_ua, mobile, platform = random.choice(_CHROME_PROFILES)

        try:
            if _USE_CURL:
                proxy_kwargs = {"proxies": {"https": _PROXY_URL, "http": _PROXY_URL}} if _PROXY_URL else {}
                async with _CurlSession(impersonate="chrome124", **proxy_kwargs) as session:
                    build_id = await _get_build_id(session, ua, sec_ch_ua, mobile, platform, force=True)
                    if not build_id:
                        return result
                    confirmed = await self._fetch_with_retry_curl(session, vn, build_id, ua, sec_ch_ua, mobile, platform)
            else:
                client_kwargs: dict = {"timeout": 30.0, "follow_redirects": True}
                if _PROXY_URL:
                    client_kwargs["proxy"] = _PROXY_URL
                async with _httpx.AsyncClient(**client_kwargs) as client:
                    build_id = await _get_build_id(client, ua, sec_ch_ua, mobile, platform, force=True)
                    if not build_id:
                        return result
                    confirmed = await self._fetch_with_retry_httpx(client, vn, build_id, ua, sec_ch_ua, mobile, platform)
        except Exception as e:
            log.warning("CarInfo: confirmation attempt failed for %s, keeping original empty result: %s", vn, e)
            return result

        if confirmed:
            log.warning(
                "CarInfo: first session found 0 challans for %s but a fresh session found %d — using the fresh result",
                vn, len(confirmed),
            )
            return confirmed
        return result

    async def _run_with_curl(self, vn: str, ua: str, sec_ch_ua: str, mobile: str, platform: str) -> list[dict]:
        proxy_kwargs = {"proxies": {"https": _PROXY_URL, "http": _PROXY_URL}} if _PROXY_URL else {}
        async with _CurlSession(impersonate="chrome124", **proxy_kwargs) as session:
            await asyncio.sleep(random.uniform(1.0, 3.0))

            build_id = await _get_build_id(session, ua, sec_ch_ua, mobile, platform)
            if not build_id:
                raise ScraperUnavailableError(
                    f"CarInfo buildId unavailable for {vn} — page markup changed or blocked"
                )

            # Human-like pause between page load and API call
            await asyncio.sleep(random.uniform(0.8, 2.0))

            result = await self._fetch_with_retry_curl(session, vn, build_id, ua, sec_ch_ua, mobile, platform)

            if result is None:
                log.info("CarInfo: got 404 for %s — refreshing buildId", vn)
                await asyncio.sleep(random.uniform(1.0, 2.5))
                build_id = await _get_build_id(session, ua, sec_ch_ua, mobile, platform, force=True)
                if not build_id:
                    raise ScraperUnavailableError(
                        f"CarInfo buildId unavailable on refresh for {vn}"
                    )
                await asyncio.sleep(random.uniform(0.5, 1.5))
                result = await self._fetch_with_retry_curl(session, vn, build_id, ua, sec_ch_ua, mobile, platform)

            if result is None:
                # Still 404 with a freshly-parsed buildId: the _next/data route is
                # gone, not stale. Never report this as "no challans".
                raise ScraperUnavailableError(
                    f"CarInfo _next/data route returned 404 for {vn} after buildId refresh "
                    "— the challan-details route has moved (App Router migration)"
                )

            challans = await self._confirm_if_empty(result, vn)
            if challans:
                log.info("CarInfo: %d challan(s) found for %s", len(challans), vn)
            else:
                log.info("CarInfo: no challans found for %s", vn)
            return challans

    async def _run_with_httpx(self, vn: str, ua: str, sec_ch_ua: str, mobile: str, platform: str) -> list[dict]:
        client_kwargs: dict = {"timeout": 30.0, "follow_redirects": True}
        if _PROXY_URL:
            client_kwargs["proxy"] = _PROXY_URL
        async with _httpx.AsyncClient(**client_kwargs) as client:
            await asyncio.sleep(random.uniform(1.0, 3.0))

            build_id = await _get_build_id(client, ua, sec_ch_ua, mobile, platform)
            if not build_id:
                raise ScraperUnavailableError(
                    f"CarInfo buildId unavailable for {vn} — page markup changed or blocked"
                )

            await asyncio.sleep(random.uniform(0.8, 2.0))
            result = await self._fetch_with_retry_httpx(client, vn, build_id, ua, sec_ch_ua, mobile, platform)

            if result is None:
                log.info("CarInfo: got 404 for %s — refreshing buildId", vn)
                await asyncio.sleep(random.uniform(1.0, 2.5))
                build_id = await _get_build_id(client, ua, sec_ch_ua, mobile, platform, force=True)
                if not build_id:
                    raise ScraperUnavailableError(
                        f"CarInfo buildId unavailable on refresh for {vn}"
                    )
                result = await self._fetch_with_retry_httpx(client, vn, build_id, ua, sec_ch_ua, mobile, platform)

            if result is None:
                raise ScraperUnavailableError(
                    f"CarInfo _next/data route returned 404 for {vn} after buildId refresh "
                    "— the challan-details route has moved (App Router migration)"
                )

            challans = await self._confirm_if_empty(result, vn)
            if challans:
                log.info("CarInfo: %d challan(s) found for %s", len(challans), vn)
            else:
                log.info("CarInfo: no challans found for %s", vn)
            return challans

    async def _fetch_with_retry_curl(self, session, vn: str, build_id: str, ua: str, sec_ch_ua: str, mobile: str, platform: str) -> Optional[list[dict]]:
        last_error: Optional[Exception] = None
        for attempt in range(_MAX_RETRIES):
            try:
                return await self._fetch_curl(session, vn, build_id, ua, sec_ch_ua, mobile, platform)
            except ScraperUnavailableError:
                raise  # terminal — retrying a changed contract cannot help
            except Exception as e:
                last_error = e
                log.warning("CarInfo curl error for %s (attempt %d/%d): %s", vn, attempt + 1, _MAX_RETRIES, e)
            if attempt < _MAX_RETRIES - 1:
                await asyncio.sleep(_RETRY_BACKOFF[attempt])
        raise ScraperUnavailableError(
            f"CarInfo unreachable for {vn} after {_MAX_RETRIES} attempts: {last_error}"
        )

    async def _fetch_with_retry_httpx(self, client, vn: str, build_id: str, ua: str, sec_ch_ua: str, mobile: str, platform: str) -> Optional[list[dict]]:
        last_error: Optional[Exception] = None
        for attempt in range(_MAX_RETRIES):
            try:
                return await self._fetch_httpx(client, vn, build_id, ua, sec_ch_ua, mobile, platform)
            except ScraperUnavailableError:
                raise  # terminal — retrying a changed contract cannot help
            except Exception as e:
                last_error = e
                log.warning("CarInfo httpx error for %s (attempt %d/%d): %s", vn, attempt + 1, _MAX_RETRIES, e)
            if attempt < _MAX_RETRIES - 1:
                await asyncio.sleep(_RETRY_BACKOFF[attempt])
        raise ScraperUnavailableError(
            f"CarInfo unreachable for {vn} after {_MAX_RETRIES} attempts: {last_error}"
        )

    async def _fetch_curl(self, session, vn: str, build_id: str, ua: str, sec_ch_ua: str, mobile: str, platform: str) -> Optional[list[dict]]:
        url = f"https://www.carinfo.app/_next/data/{build_id}/challan-details/{vn}.json"
        resp = await session.get(url, headers=_api_headers(ua, sec_ch_ua, mobile, platform, vn), timeout=30)
        return self._handle_response(resp, vn)

    async def _fetch_httpx(self, client, vn: str, build_id: str, ua: str, sec_ch_ua: str, mobile: str, platform: str) -> Optional[list[dict]]:
        url = f"https://www.carinfo.app/_next/data/{build_id}/challan-details/{vn}.json"
        resp = await client.get(url, headers=_api_headers(ua, sec_ch_ua, mobile, platform, vn))
        return self._handle_response(resp, vn)

    def _handle_response(self, resp, vn: str) -> Optional[list[dict]]:
        if resp.status_code == 404:
            return None

        # Retryable: rate limiting and upstream server errors
        if resp.status_code == 429:
            log.warning("CarInfo rate limited (429) for %s", vn)
            raise Exception("Rate limited")

        if resp.status_code >= 500:
            log.warning("CarInfo server error (%d) for %s", resp.status_code, vn)
            raise Exception(f"Upstream HTTP {resp.status_code}")

        # Terminal: any other unexpected status means the contract changed
        if resp.status_code != 200:
            raise ScraperUnavailableError(f"CarInfo HTTP {resp.status_code} for {vn}")

        try:
            body = resp.json()
        except Exception as e:
            raise ScraperUnavailableError(
                f"CarInfo response was not JSON for {vn}"
            ) from e

        xdata = body.get("pageProps", {}).get("xdataprops", "")
        if not xdata:
            log.info("CarInfo: no xdataprops for %s (no challans)", vn)
            return []

        decrypted = _decrypt(xdata)
        if not decrypted:
            raise ScraperUnavailableError(
                f"CarInfo decryption failed for {vn} — AES key or envelope changed"
            )

        return _parse(decrypted, vn)
