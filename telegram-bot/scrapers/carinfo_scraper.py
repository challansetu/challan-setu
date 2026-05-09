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
  - Rotates across 5 Chrome profiles on Android/Windows/Linux
  - Auto-refreshes buildId on 404
  - BuildId cached 1 hour

Production behaviour:
  - Network errors → retry up to 3 times with exponential backoff
  - HTTP 429/503 → retry with longer wait
  - Decryption failure → return [] (logged as warning)
  - Empty xdataprops → return [] (no challans on CarInfo)
  - All exceptions caught — scraper never raises, always returns a list
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

_AES_KEY = b"Gx!7m$9zK@qW2vP"

_build_cache: dict = {"id": None, "ts": 0.0}
_BUILD_TTL = 3600  # seconds

# Each profile: (user_agent, sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform)
_CHROME_PROFILES = [
    (
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "?1",
        '"Android"',
    ),
    (
        "Mozilla/5.0 (Linux; Android 13; Samsung SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "?1",
        '"Android"',
    ),
    (
        "Mozilla/5.0 (Linux; Android 12; OnePlus 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "?1",
        '"Android"',
    ),
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

    try:
        tab_section = (
            data.get("data", {}).get("tabs", [{}])[0].get("tabSection", [])
        )
    except (IndexError, AttributeError, TypeError):
        log.warning("CarInfo unexpected data structure for %s", vn)
        return []

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
        except Exception as e:
            log.error("CarInfo unexpected error for %s: %s", vn, e, exc_info=True)
            return []

    async def _run_with_curl(self, vn: str, ua: str, sec_ch_ua: str, mobile: str, platform: str) -> list[dict]:
        proxy_kwargs = {"proxies": {"https": _PROXY_URL, "http": _PROXY_URL}} if _PROXY_URL else {}
        async with _CurlSession(impersonate="chrome124", **proxy_kwargs) as session:
            await asyncio.sleep(random.uniform(1.0, 3.0))

            build_id = await _get_build_id(session, ua, sec_ch_ua, mobile, platform)
            if not build_id:
                log.warning("CarInfo: could not determine buildId for %s", vn)
                return []

            # Human-like pause between page load and API call
            await asyncio.sleep(random.uniform(0.8, 2.0))

            result = await self._fetch_with_retry_curl(session, vn, build_id, ua, sec_ch_ua, mobile, platform)

            if result is None:
                log.info("CarInfo: got 404 for %s — refreshing buildId", vn)
                await asyncio.sleep(random.uniform(1.0, 2.5))
                build_id = await _get_build_id(session, ua, sec_ch_ua, mobile, platform, force=True)
                if not build_id:
                    return []
                await asyncio.sleep(random.uniform(0.5, 1.5))
                result = await self._fetch_with_retry_curl(session, vn, build_id, ua, sec_ch_ua, mobile, platform)

            challans = result or []
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
                log.warning("CarInfo: could not determine buildId for %s", vn)
                return []

            await asyncio.sleep(random.uniform(0.8, 2.0))
            result = await self._fetch_with_retry_httpx(client, vn, build_id, ua, sec_ch_ua, mobile, platform)

            if result is None:
                log.info("CarInfo: got 404 for %s — refreshing buildId", vn)
                await asyncio.sleep(random.uniform(1.0, 2.5))
                build_id = await _get_build_id(client, ua, sec_ch_ua, mobile, platform, force=True)
                if not build_id:
                    return []
                result = await self._fetch_with_retry_httpx(client, vn, build_id, ua, sec_ch_ua, mobile, platform)

            challans = result or []
            if challans:
                log.info("CarInfo: %d challan(s) found for %s", len(challans), vn)
            else:
                log.info("CarInfo: no challans found for %s", vn)
            return challans

    async def _fetch_with_retry_curl(self, session, vn: str, build_id: str, ua: str, sec_ch_ua: str, mobile: str, platform: str) -> Optional[list[dict]]:
        for attempt in range(_MAX_RETRIES):
            try:
                return await self._fetch_curl(session, vn, build_id, ua, sec_ch_ua, mobile, platform)
            except Exception as e:
                log.warning("CarInfo curl error for %s (attempt %d/%d): %s", vn, attempt + 1, _MAX_RETRIES, e)
            if attempt < _MAX_RETRIES - 1:
                await asyncio.sleep(_RETRY_BACKOFF[attempt])
        log.error("CarInfo: all %d retries exhausted for %s", _MAX_RETRIES, vn)
        return []

    async def _fetch_with_retry_httpx(self, client, vn: str, build_id: str, ua: str, sec_ch_ua: str, mobile: str, platform: str) -> Optional[list[dict]]:
        for attempt in range(_MAX_RETRIES):
            try:
                return await self._fetch_httpx(client, vn, build_id, ua, sec_ch_ua, mobile, platform)
            except Exception as e:
                log.warning("CarInfo httpx error for %s (attempt %d/%d): %s", vn, attempt + 1, _MAX_RETRIES, e)
            if attempt < _MAX_RETRIES - 1:
                await asyncio.sleep(_RETRY_BACKOFF[attempt])
        log.error("CarInfo: all %d retries exhausted for %s", _MAX_RETRIES, vn)
        return []

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

        if resp.status_code == 429:
            log.warning("CarInfo rate limited (429) for %s", vn)
            raise Exception("Rate limited")

        if resp.status_code == 503:
            log.warning("CarInfo service unavailable (503) for %s", vn)
            raise Exception("Service unavailable")

        if resp.status_code != 200:
            log.warning("CarInfo HTTP %d for %s", resp.status_code, vn)
            return []

        try:
            body = resp.json()
        except Exception:
            log.warning("CarInfo response not JSON for %s", vn)
            return []

        xdata = body.get("pageProps", {}).get("xdataprops", "")
        if not xdata:
            log.info("CarInfo: no xdataprops for %s (no challans)", vn)
            return []

        decrypted = _decrypt(xdata)
        if not decrypted:
            log.warning("CarInfo: decryption failed for %s (key may have changed)", vn)
            return []

        return _parse(decrypted, vn)
