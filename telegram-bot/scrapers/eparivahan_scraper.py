"""
eparivahan direct scraper — two-step OTP flow.

CONFIRMED endpoints (from DevTools):
  ✅ GET  /index/accused-challan         → page with ng-init tokens
  ✅ GET  /index/captcha-login           → CAPTCHA image (JPEG)
  ✅ POST /index/verify-search-otp       → verify OTP, returns numeric randomSalt
  ✅ POST /api/get-challan-detail        → returns challan array

ASSUMED endpoint (verify with one test):
  ❓ POST /index/accused-challan         → submit vrn+captcha, triggers OTP SMS

Flow:
  1. GET accused-challan → extract dateTime, randomSalt (base64), PHPSESSID
  2. GET captcha-login   → solve CAPTCHA (2Captcha or Tesseract)
  3. POST accused-challan (vrn, captcha, tokens) → OTP sent to registered mobile
  4. User enters OTP on our site
  5. POST verify-search-otp → returns numeric randomSalt
  6. POST get-challan-detail → returns challans

CAPTCHA solving:
  - Set TWOCAPTCHA_API_KEY env var for production (~$1/1000 solves, ~95% accuracy)
  - Without key: falls back to pytesseract (~50% accuracy, may need retry)
"""
from __future__ import annotations

import asyncio
import base64
import json
import logging
import os
import re
import time
import uuid
from typing import Optional

import httpx

log = logging.getLogger("scraper.eparivahan")

BASE_URL = "https://echallan.parivahan.gov.in"
PAGE_URL = f"{BASE_URL}/index/accused-challan"
CAP_URL = f"{BASE_URL}/index/captcha-login"
OTP_URL = f"{BASE_URL}/index/verify-search-otp"
DETAIL_URL = f"{BASE_URL}/api/get-challan-detail"

TWOCAPTCHA_API_KEY = os.environ.get("TWOCAPTCHA_API_KEY", "")

# In-memory session store: session_id → {phpsessid, expires_at}
_sessions: dict[str, dict] = {}
_SESSION_TTL = 600  # 10 minutes


def _browser_headers(referer: str = PAGE_URL) -> dict:
    return {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-IN,en-GB;q=0.9,en;q=0.8",
        "user-agent": (
            "Mozilla/5.0 (Linux; Android 14; Pixel 8) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Mobile Safari/537.36"
        ),
        "referer": referer,
        "x-requested-with": "XMLHttpRequest",
    }


def _cleanup_sessions() -> None:
    now = time.time()
    expired = [k for k, v in _sessions.items() if v["expires_at"] < now]
    for k in expired:
        del _sessions[k]


# ── CAPTCHA solving ───────────────────────────────────────────────────────────

async def _solve_2captcha(image_bytes: bytes) -> str:
    """Submit to 2Captcha, poll until result."""
    import httpx as _httpx
    b64 = base64.b64encode(image_bytes).decode()
    async with _httpx.AsyncClient(timeout=30) as c:
        r = await c.post(
            "http://2captcha.com/in.php",
            data={"key": TWOCAPTCHA_API_KEY, "method": "base64", "body": b64},
        )
    if not r.text.startswith("OK|"):
        raise RuntimeError(f"2Captcha submit error: {r.text}")
    captcha_id = r.text.split("|")[1]

    for _ in range(20):
        await asyncio.sleep(3)
        async with httpx.AsyncClient(timeout=15) as c:
            r2 = await c.get(
                "http://2captcha.com/res.php",
                params={"key": TWOCAPTCHA_API_KEY, "action": "get", "id": captcha_id},
            )
        if r2.text == "CAPCHA_NOT_READY":
            continue
        if r2.text.startswith("OK|"):
            return r2.text.split("|")[1].strip()
        raise RuntimeError(f"2Captcha result error: {r2.text}")
    raise RuntimeError("2Captcha timed out")


async def _solve_tesseract(image_bytes: bytes) -> str:
    """Free local OCR — eparivahan CAPTCHA is simple digits/letters on white bg."""
    try:
        import pytesseract
        from PIL import Image, ImageFilter
        import io

        img = Image.open(io.BytesIO(image_bytes)).convert("L")
        img = img.point(lambda x: 0 if x < 128 else 255)
        text = pytesseract.image_to_string(
            img,
            config="--psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        ).strip()
        return text
    except Exception as e:
        log.warning("Tesseract OCR failed: %s", e)
        return ""


async def solve_captcha(image_bytes: bytes) -> str:
    if TWOCAPTCHA_API_KEY:
        return await _solve_2captcha(image_bytes)
    return await _solve_tesseract(image_bytes)


# ── Session init ──────────────────────────────────────────────────────────────

async def _load_page_tokens(client: httpx.AsyncClient) -> dict:
    """GET accused-challan page → extract dateTime + randomSalt (base64) + PHPSESSID."""
    resp = await client.get(
        PAGE_URL,
        headers={
            "accept": "text/html,application/xhtml+xml,*/*;q=0.9",
            "accept-language": "en-IN,en-GB;q=0.9,en;q=0.8",
            "user-agent": (
                "Mozilla/5.0 (Linux; Android 14; Pixel 8) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Mobile Safari/537.36"
            ),
        },
        timeout=15,
    )
    html = resp.text

    dt_m = re.search(r"accused\.dateTime\s*=\s*['\"]([^'\"]+)['\"]", html)
    rs_m = re.search(r"accused\.randomSalt\s*=\s*['\"]([^'\"]+)['\"]", html)

    if not dt_m or not rs_m:
        # Fallback: look for ng-init patterns
        dt_m = re.search(r"dateTime['\"]?\s*:\s*['\"]([^'\"]+)['\"]", html)
        rs_m = re.search(r"randomSalt['\"]?\s*:\s*['\"]([^'\"]+)['\"]", html)

    if not dt_m or not rs_m:
        log.error("Could not extract tokens from eparivahan page (len=%d)", len(html))
        raise RuntimeError("eparivahan page token extraction failed")

    phpsessid = client.cookies.get("PHPSESSID", "")
    return {
        "date_time": dt_m.group(1),
        "random_salt": rs_m.group(1),
        "phpsessid": phpsessid,
    }


async def _fetch_captcha(client: httpx.AsyncClient) -> bytes:
    resp = await client.get(
        CAP_URL,
        headers={**_browser_headers(), "accept": "image/webp,image/*,*/*;q=0.8"},
        timeout=10,
    )
    return resp.content


async def _submit_vehicle(
    client: httpx.AsyncClient,
    vrn: str,
    captcha_text: str,
    date_time: str,
    random_salt: str,
) -> dict:
    """
    Step 3: submit vehicle number + CAPTCHA → OTP is sent to registered mobile.

    ❓ ASSUMED endpoint: POST /index/accused-challan
       Confirm by checking DevTools: the XHR fired when you click Search.
       If the URL or field names are wrong, update this function.
    """
    payload = {
        "vrn": vrn,
        "captcha_input": captcha_text,
        "date_time": date_time,
        "random_salt": random_salt,
    }
    resp = await client.post(
        PAGE_URL,
        data=payload,
        headers={
            **_browser_headers(),
            "content-type": "application/x-www-form-urlencoded",
        },
        timeout=20,
    )
    try:
        body = resp.json()
    except Exception:
        body = {"raw": resp.text[:500]}

    log.info("eparivahan submit VRN=%s status=%d body=%s", vrn, resp.status_code, body)
    return body


# ── OTP + challan fetch ───────────────────────────────────────────────────────

async def _verify_otp_and_fetch(phpsessid: str, otp: str) -> list[dict]:
    """Steps 5–6: verify OTP → get numeric randomSalt → fetch challans."""
    headers = {
        **_browser_headers(),
        "Cookie": f"PHPSESSID={phpsessid}",
        "content-length": "0",
    }

    async with httpx.AsyncClient(timeout=20) as client:
        # Step 5: verify OTP
        otp_resp = await client.post(
            OTP_URL,
            params={"data": json.dumps({"otp_code": otp, "otp_type": "by_mobile_no"})},
            content=b"",
            headers=headers,
        )
        otp_body = otp_resp.json()
        log.info("OTP verify response: %s", otp_body)

        if otp_body.get("status") != "success":
            raise ValueError(otp_body.get("message", "OTP verification failed"))

        numeric_salt = str(otp_body["randomSalt"])

        # Step 6: fetch challans
        detail_resp = await client.post(
            DETAIL_URL,
            params={"data": json.dumps({"randomSalt": numeric_salt, "is_accussed": True})},
            content=b"",
            headers=headers,
        )
        detail_body = detail_resp.json()
        log.info(
            "get-challan-detail status=%s count=%d",
            detail_body.get("status"),
            len(detail_body.get("results", [])),
        )

        return [_parse_challan(c) for c in detail_body.get("results", [])]


def _parse_challan(raw: dict) -> dict:
    offences_raw = raw.get("offences", [])
    seen: set = set()
    offences: list[dict] = []
    for o in offences_raw:
        key = (o.get("offence_name", ""), o.get("penalty", ""))
        if key not in seen:
            seen.add(key)
            offences.append({"offence": o.get("offence_name", ""), "penalty": o.get("penalty", "")})

    amount = 0
    try:
        amount = int(str(raw.get("amount", 0)).replace(",", ""))
    except (ValueError, TypeError):
        pass

    return {
        "challanNo": raw.get("challan_no", ""),
        "dlRcNumber": raw.get("vrn", ""),
        "rcNo": raw.get("vrn", ""),
        "State": (raw.get("vrn", "")[:2] if raw.get("vrn") else ""),
        "dateChallan": raw.get("date_time", ""),
        "detailsViolation": offences,
        "locationChallan": raw.get("office_text", ""),
        "amountChallan": amount,
        "status": raw.get("challan_status", "Unpaid"),
        "noReceipt": None,
        "challan_search_source": "eparivahan",
        "court_status_desc": raw.get("court_status", ""),
        "nameCourt": raw.get("court_name", ""),
    }


# ── Public API ────────────────────────────────────────────────────────────────

class EparivahanScraper:
    """
    Two-step OTP scraper for echallan.parivahan.gov.in.

    Step 1 — initiate_search(vrn) → session_id
      Loads page, fetches CAPTCHA, solves it, submits vehicle.
      OTP is sent to the vehicle owner's registered mobile.

    Step 2 — verify_otp(session_id, otp) → list[dict]
      Submits OTP, fetches and returns challan list.
    """

    async def initiate_search(self, vehicle_number: str) -> str:
        """Returns a session_id. OTP is sent to mobile by eparivahan."""
        vrn = vehicle_number.upper().replace(" ", "").replace("-", "")
        _cleanup_sessions()

        proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY")
        client_kwargs: dict = {"follow_redirects": True, "timeout": 30.0}
        if proxy:
            client_kwargs["proxy"] = proxy

        async with httpx.AsyncClient(**client_kwargs) as client:
            tokens = await _load_page_tokens(client)
            captcha_bytes = await _fetch_captcha(client)
            captcha_text = await solve_captcha(captcha_bytes)

            if not captcha_text:
                raise RuntimeError("CAPTCHA solving failed — no text returned")

            log.info("eparivahan: CAPTCHA solved as '%s' for %s", captcha_text, vrn)

            submit_resp = await _submit_vehicle(
                client, vrn, captcha_text,
                tokens["date_time"], tokens["random_salt"],
            )

            # Detect known error responses
            if isinstance(submit_resp, dict):
                msg = submit_resp.get("message", "")
                status = submit_resp.get("status", "")
                if "captcha" in msg.lower() or status == "error":
                    raise ValueError(f"eparivahan rejected submission: {msg}")

        session_id = str(uuid.uuid4())
        _sessions[session_id] = {
            "vrn": vrn,
            "phpsessid": tokens["phpsessid"],
            "expires_at": time.time() + _SESSION_TTL,
        }
        log.info("eparivahan: session %s created for %s", session_id, vrn)
        return session_id

    async def verify_otp(self, session_id: str, otp: str) -> list[dict]:
        """Submit OTP, return challan list."""
        session = _sessions.get(session_id)
        if not session:
            raise ValueError("Session not found or expired. Please search again.")
        if time.time() > session["expires_at"]:
            del _sessions[session_id]
            raise ValueError("Session expired. Please search again.")

        challans = await _verify_otp_and_fetch(session["phpsessid"], otp)
        del _sessions[session_id]
        return challans
