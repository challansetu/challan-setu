"""
CarInfo scraper — direct HTTP, no browser.

Flow:
  1. GET carinfo.app/e-challan-check → extract buildId from __NEXT_DATA__
  2. GET _next/data/{buildId}/challan-details/{vehicle}.json
  3. Decrypt xdataprops (AES/CryptoJS)
  4. Return challan list

Anti-blocking:
  - No headless browser (plain HTTP is invisible to bot detectors)
  - Rotates User-Agent on every request
  - Random 0.5–2s delay per search
  - Realistic browser headers
  - Auto-refreshes buildId on 404 (CarInfo redeploys break the URL)
  - BuildId cached 1 hour so we don't hit the home page every search

Production behaviour:
  - Network errors → retry up to 3 times with exponential backoff
  - HTTP 429/503 → retry with longer wait
  - Decryption failure → return [] (no challans assumed, logged as warning)
  - Empty xdataprops → return [] (vehicle has no challans on CarInfo)
  - All exceptions are caught — scraper never raises, always returns a list
"""
from __future__ import annotations

import asyncio
import base64
import hashlib
import json
import logging
import random
import re
import time
from typing import Optional

import httpx

log = logging.getLogger("scraper.carinfo")

_AES_KEY = b"Gx!7m$9zK@qW2vP"

_build_cache: dict = {"id": None, "ts": 0.0}
_BUILD_TTL = 3600  # seconds

_USER_AGENTS = [
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 13; Samsung SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (Linux; Android 12; OnePlus 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
]

_MAX_RETRIES = 3
_RETRY_BACKOFF = [2.0, 5.0, 10.0]  # seconds between retries


def _headers(ua: str, referer: str = "") -> dict:
    return {
        "accept": "*/*",
        "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        "user-agent": ua,
        "referer": referer or "https://www.carinfo.app/e-challan-check",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-nextjs-data": "1",
        "src": "car-info_web",
        "city": "Delhi",
        "cityid": "10084",
    }


async def _fetch_build_id(client: httpx.AsyncClient, ua: str) -> Optional[str]:
    try:
        resp = await client.get(
            "https://www.carinfo.app/e-challan-check",
            headers={
                "accept": "text/html,application/xhtml+xml,*/*;q=0.9",
                "accept-language": "en-IN,en-GB;q=0.9,en;q=0.8",
                "user-agent": ua,
            },
            follow_redirects=True,
            timeout=15.0,
        )
        m = re.search(r'"buildId"\s*:\s*"([^"]+)"', resp.text)
        if m:
            return m.group(1)
        log.warning("buildId not found in CarInfo page HTML (status %d)", resp.status_code)
    except Exception as e:
        log.warning("Failed to fetch CarInfo buildId: %s", e)
    return None


async def _get_build_id(client: httpx.AsyncClient, ua: str, force: bool = False) -> Optional[str]:
    now = time.monotonic()
    if not force and _build_cache["id"] and (now - _build_cache["ts"]) < _BUILD_TTL:
        return _build_cache["id"]
    build_id = await _fetch_build_id(client, ua)
    if build_id:
        _build_cache["id"] = build_id
        _build_cache["ts"] = now
        log.info("CarInfo buildId refreshed: %s", build_id)
    return build_id


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
    """Direct HTTP scraper — no browser required."""

    async def __aenter__(self) -> "CarInfoScraper":
        return self

    async def __aexit__(self, *_) -> None:
        pass

    async def search_all_challans(self, vehicle_number: str) -> list[dict]:
        vn = vehicle_number.upper().replace(" ", "").replace("-", "")
        ua = random.choice(_USER_AGENTS)

        try:
            async with httpx.AsyncClient(
                timeout=30.0,
                follow_redirects=True,
            ) as client:
                await asyncio.sleep(random.uniform(0.5, 2.0))

                build_id = await _get_build_id(client, ua)
                if not build_id:
                    log.warning("CarInfo: could not determine buildId for %s", vn)
                    return []

                result = await self._fetch_with_retry(client, vn, build_id, ua)

                if result is None:
                    # 404 = stale buildId — refresh and retry once
                    log.info("CarInfo: got 404 for %s — refreshing buildId", vn)
                    await asyncio.sleep(random.uniform(1.0, 2.5))
                    build_id = await _get_build_id(client, ua, force=True)
                    if not build_id:
                        return []
                    result = await self._fetch_with_retry(client, vn, build_id, ua)

                challans = result or []
                if challans:
                    log.info("CarInfo: %d challan(s) found for %s", len(challans), vn)
                else:
                    log.info("CarInfo: no challans found for %s", vn)
                return challans

        except Exception as e:
            log.error("CarInfo unexpected error for %s: %s", vn, e, exc_info=True)
            return []

    async def _fetch_with_retry(
        self, client: httpx.AsyncClient, vn: str, build_id: str, ua: str
    ) -> Optional[list[dict]]:
        """Retries on network errors. Returns None on 404 (stale buildId)."""
        for attempt in range(_MAX_RETRIES):
            try:
                result = await self._fetch(client, vn, build_id, ua)
                return result
            except httpx.TimeoutException:
                log.warning("CarInfo timeout for %s (attempt %d/%d)", vn, attempt + 1, _MAX_RETRIES)
            except httpx.NetworkError as e:
                log.warning("CarInfo network error for %s (attempt %d/%d): %s", vn, attempt + 1, _MAX_RETRIES, e)
            except Exception as e:
                log.warning("CarInfo request error for %s (attempt %d/%d): %s", vn, attempt + 1, _MAX_RETRIES, e)

            if attempt < _MAX_RETRIES - 1:
                await asyncio.sleep(_RETRY_BACKOFF[attempt])

        log.error("CarInfo: all %d retries exhausted for %s", _MAX_RETRIES, vn)
        return []

    async def _fetch(
        self, client: httpx.AsyncClient, vn: str, build_id: str, ua: str
    ) -> Optional[list[dict]]:
        """Returns None on 404 (stale buildId), list otherwise (empty = no challans)."""
        url = (
            f"https://www.carinfo.app/_next/data/{build_id}"
            f"/challan-details/{vn}.json"
        )
        resp = await client.get(
            url,
            headers=_headers(ua, referer=f"https://www.carinfo.app/challan-details/{vn}"),
        )

        if resp.status_code == 404:
            return None  # caller will refresh buildId

        if resp.status_code == 429:
            log.warning("CarInfo rate limited (429) for %s", vn)
            await asyncio.sleep(10.0)
            raise httpx.NetworkError("Rate limited")

        if resp.status_code == 503:
            log.warning("CarInfo service unavailable (503) for %s", vn)
            raise httpx.NetworkError("Service unavailable")

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
            # Valid response, vehicle simply has no challans on CarInfo
            log.info("CarInfo: no xdataprops for %s (no challans)", vn)
            return []

        decrypted = _decrypt(xdata)
        if not decrypted:
            # Decryption failed — AES key may have changed
            log.warning("CarInfo: decryption failed for %s (key may have changed)", vn)
            return []

        return _parse(decrypted, vn)
