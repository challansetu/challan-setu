"""
eparivahan direct scraper — fully confirmed from DevTools captures.

ALL endpoints confirmed ✅:
  GET  /index/accused-challan         → HTML with ng-init tokens + hashKeyText in JS
  GET  /index/captcha-login           → CAPTCHA image (JPEG, ~6 char alphanumeric)
  POST /index/search-challan          → submit VRN+captcha; response decides flow:
                                         status='Failed'  → error (wrong vehicle/captcha)
                                         status='common'  → token in rdata.token (NO OTP)
                                         otherwise        → OTP modal shown
  POST /index/send-aadhar-otp         → triggers OTP SMS to registered mobile
  POST /index/verify-search-otp       → verify OTP → returns numeric randomSalt
  POST /api/get-challan-detail        → returns challan array

Flow:
  1. GET accused-challan → extract dateTime, randomSalt (base64), hashKeyText, PHPSESSID
  2. GET captcha-login   → solve CAPTCHA (2Captcha or Tesseract)
  3. POST search-challan → check response status:
       'common'  → fetch challans directly with rdata.token (no OTP, return immediately)
       'Failed'  → raise error
       else      → OTP required, continue to step 4
  4. POST send-aadhar-otp → OTP SMS sent to vehicle owner's mobile
  5. User enters OTP on our site
  6. POST verify-search-otp → returns numeric randomSalt
  7. POST get-challan-detail → returns challans

CAPTCHA solving:
  - TWOCAPTCHA_API_KEY env var → 2Captcha (~$1/1000, ~95% accuracy)
  - Without key → pytesseract local OCR (~50% accuracy, may need retry)
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

BASE_URL     = "https://echallan.parivahan.gov.in"
PAGE_URL     = f"{BASE_URL}/index/accused-challan"
CAP_URL      = f"{BASE_URL}/index/captcha-login"
SEARCH_URL   = f"{BASE_URL}/index/search-challan"
SEND_OTP_URL = f"{BASE_URL}/index/send-aadhar-otp"
VERIFY_URL   = f"{BASE_URL}/index/verify-search-otp"
DETAIL_URL   = f"{BASE_URL}/api/get-challan-detail"

# OTP trigger payload — hardcoded because we always use by_mobile_no;
# aadhar fields are base64("undefined"), consent is base64("N")
_OTP_TRIGGER_PARAMS = {
    "otp_type": "by_mobile_no",
    "aadhar_no": "dW5kZWZpbmVk",   # base64("undefined")
    "vaadhar_no": "dW5kZWZpbmVk",  # base64("undefined")
    "consent": "Tg==",              # base64("N")
}

TWOCAPTCHA_API_KEY = os.environ.get("TWOCAPTCHA_API_KEY", "")
_EPARIVAHAN_PROXY_URL = os.environ.get("EPARIVAHAN_PROXY_URL", "").strip()
_SYSTEM_PROXY_URL = (os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY") or "").strip()

# In-memory session store: session_id → {phpsessid, expires_at}
_sessions: dict[str, dict] = {}
_SESSION_TTL = 600  # 10 minutes


def _cleanup_sessions() -> None:
    now = time.time()
    expired = [k for k, v in _sessions.items() if v["expires_at"] < now]
    for k in expired:
        del _sessions[k]


def _browser_headers(referer: str = PAGE_URL, extra: dict | None = None) -> dict:
    h = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "user-agent": (
            "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) "
            "AppleWebKit/605.1.15 (KHTML, like Gecko) "
            "Version/18.5 Mobile/15E148 Safari/604.1"
        ),
        "origin": BASE_URL,
        "referer": referer,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
    }
    if extra:
        h.update(extra)
    return h


def _build_client_options() -> list[tuple[str, dict]]:
    """
    Build explicit transport options for eparivahan.

    We always try direct first with trust_env=False so platform-level proxy
    variables do not silently hijack scraper traffic. If a dedicated proxy is
    configured, we retry through that proxy next.
    """
    base = {
        "follow_redirects": True,
        "timeout": httpx.Timeout(connect=10.0, read=20.0, write=10.0, pool=10.0),
        "trust_env": False,
    }
    options: list[tuple[str, dict]] = [("direct", dict(base))]

    proxy_url = _EPARIVAHAN_PROXY_URL or _SYSTEM_PROXY_URL
    if proxy_url:
        mode = "configured-proxy" if _EPARIVAHAN_PROXY_URL else "system-proxy"
        options.append((mode, {**base, "proxy": proxy_url}))

    return options


def _is_upstream_connectivity_error(exc: Exception) -> bool:
    return isinstance(
        exc,
        (
            httpx.ConnectTimeout,
            httpx.ConnectError,
            httpx.ReadTimeout,
            httpx.RemoteProtocolError,
            httpx.ProxyError,
        ),
    )


def _format_transport_failure(vrn: str, failures: list[str]) -> str:
    summary = "; ".join(failures) if failures else "unknown transport failure"
    hint = (
        " Configure EPARIVAHAN_PROXY_URL to an Indian proxy if this service runs outside India."
        if not _EPARIVAHAN_PROXY_URL
        else " Verify EPARIVAHAN_PROXY_URL and outbound access from the scraper host."
    )
    return f"Unable to reach eparivahan for {vrn}. {summary}.{hint}"


# ── CAPTCHA solving ───────────────────────────────────────────────────────────

async def _solve_2captcha(image_bytes: bytes) -> str:
    b64 = base64.b64encode(image_bytes).decode()
    async with httpx.AsyncClient(timeout=30) as c:
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


_CAPTCHA_RE = re.compile(r'^[a-zA-Z0-9]{4,8}$')
_ddddocr_instance = None


def _get_ocr():
    global _ddddocr_instance
    if _ddddocr_instance is None:
        import ddddocr
        _ddddocr_instance = ddddocr.DdddOcr(show_ad=False)
    return _ddddocr_instance


def _preprocess_captcha(image_bytes: bytes, mode: int) -> bytes:
    """Return image bytes after applying a preprocessing pipeline."""
    try:
        from PIL import Image, ImageEnhance, ImageFilter, ImageOps
        import io
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')

        if mode == 1:
            # High contrast + sharpen
            img = img.convert('L')
            img = ImageEnhance.Contrast(img).enhance(3.0)
            img = img.filter(ImageFilter.SHARPEN)
        elif mode == 2:
            # 2× nearest-neighbour resize + binary threshold
            img = img.convert('L')
            img = img.resize((img.width * 2, img.height * 2), Image.NEAREST)
            img = img.point(lambda p: 255 if p > 127 else 0)
        elif mode == 3:
            # Invert + contrast boost (helps on dark-background CAPTCHAs)
            img = img.convert('L')
            img = ImageOps.invert(img)
            img = ImageEnhance.Contrast(img).enhance(2.0)
        # mode == 0: raw, no changes

        buf = __import__('io').BytesIO()
        img.save(buf, format='PNG')
        return buf.getvalue()
    except Exception:
        return image_bytes


async def _solve_ddddocr(image_bytes: bytes) -> str:
    try:
        from collections import Counter
        ocr = _get_ocr()
        candidates = []

        for mode in range(4):
            processed = _preprocess_captcha(image_bytes, mode)
            try:
                result = ocr.classification(processed).strip()
                if _CAPTCHA_RE.match(result):
                    candidates.append(result)
                    log.debug("ddddocr mode=%d → '%s'", mode, result)
            except Exception:
                continue

        if candidates:
            winner, count = Counter(candidates).most_common(1)[0]
            log.info("ddddocr consensus: '%s' (%d/%d votes)", winner, count, len(candidates))
            return winner

        # No valid candidates — fall back to raw result anyway
        fallback = ocr.classification(image_bytes).strip()
        log.warning("ddddocr no valid candidate, using raw fallback: '%s'", fallback)
        return fallback

    except Exception as e:
        log.warning("ddddocr failed: %s", e)
        return ""


async def solve_captcha(image_bytes: bytes) -> str:
    if TWOCAPTCHA_API_KEY:
        return await _solve_2captcha(image_bytes)
    return await _solve_ddddocr(image_bytes)


# ── Page token extraction ─────────────────────────────────────────────────────

def _extract_tokens(html: str) -> dict:
    """Extract dateTime, randomSalt (base64), and hashKeyText from page HTML."""
    dt_m = re.search(r"accused\.dateTime\s*=\s*'([^']+)'", html)
    rs_m = re.search(r"accused\.randomSalt\s*=\s*'([^']+)'", html)
    hk_m = re.search(r"'hashKeyText'\s*:\s*'([a-f0-9]+)'", html)

    if not dt_m:
        raise RuntimeError("dateTime not found in eparivahan page")
    if not rs_m:
        raise RuntimeError("randomSalt not found in eparivahan page")
    if not hk_m:
        raise RuntimeError("hashKeyText not found in eparivahan page")

    return {
        "date_time": dt_m.group(1),
        "random_salt": rs_m.group(1),
        "hash_key_text": hk_m.group(1),
    }


# ── Core request steps ────────────────────────────────────────────────────────

async def _load_page(client: httpx.AsyncClient) -> dict:
    """GET accused-challan → tokens + PHPSESSID."""
    resp = await client.get(
        PAGE_URL,
        headers={
            "accept": "text/html,application/xhtml+xml,*/*;q=0.9",
            "accept-language": "en-IN,en-GB;q=0.9,en;q=0.8",
            "user-agent": (
                "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) "
                "AppleWebKit/605.1.15 (KHTML, like Gecko) "
                "Version/18.5 Mobile/15E148 Safari/604.1"
            ),
        },
        timeout=15,
    )
    tokens = _extract_tokens(resp.text)
    tokens["phpsessid"] = client.cookies.get("PHPSESSID", "")
    return tokens


async def _fetch_captcha(client: httpx.AsyncClient) -> bytes:
    resp = await client.get(
        CAP_URL,
        headers={**_browser_headers(), "accept": "image/webp,image/*,*/*;q=0.8"},
        timeout=10,
    )
    return resp.content


async def _submit_search(
    client: httpx.AsyncClient,
    vrn: str,
    captcha_text: str,
    tokens: dict,
) -> dict:
    """
    POST /index/search-challan with vehicle number + solved CAPTCHA.
    Returns the JSON response dict.

    Response status values:
      'Failed'  → wrong vehicle/captcha → raise error
      'common'  → no OTP, token in rdata['token']
      other     → OTP required (modal shown in browser)
    """
    resp = await client.post(
        SEARCH_URL,
        data={
            "challans_no": "",
            "vehicles_no": vrn,
            "dl_no": "",
            "dateTime": tokens["date_time"],
            "randomsalt": tokens["random_salt"],   # lowercase 's' — confirmed from curl
            "captcha": captcha_text,
            "is_accussed": "true",
            "hashKeyText": tokens["hash_key_text"],
        },
        headers={
            **_browser_headers(),
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        timeout=20,
    )
    try:
        body = resp.json()
    except Exception:
        body = {"status": "Failed", "message": f"non-JSON response (HTTP {resp.status_code})"}

    log.info("search-challan VRN=%s status=%s", vrn, body.get("status"))
    return body


async def _trigger_otp(client: httpx.AsyncClient) -> str:
    """
    POST /index/send-aadhar-otp — triggers OTP SMS to registered mobile.

    Returns the success message from eparivahan (e.g. "OTP has been sent to
    your registered Mobile No *******891") which we surface to the user.

    Raises ValueError with eparivahan's error message if mobile is invalid/
    not available in VAHAN (status='Failed' or 'error').
    """
    resp = await client.post(
        SEND_OTP_URL,
        params={"data": json.dumps(_OTP_TRIGGER_PARAMS)},
        content=b"",
        headers={**_browser_headers(), "content-length": "0"},
        timeout=15,
    )
    try:
        body = resp.json()
    except Exception:
        log.warning("send-aadhar-otp HTTP %d non-JSON", resp.status_code)
        return "OTP sent to your registered mobile number."

    log.info("send-aadhar-otp response: %s", body)
    status = body.get("status", "")
    message = body.get("message", "")

    if status in ("Failed", "error", "fail"):
        raise ValueError(message or "Mobile number not available in VAHAN.")

    return message or "OTP sent to your registered mobile number."


async def _fetch_challans_direct(phpsessid: str, token: str) -> list[dict]:
    """Fetch challans when no OTP is needed (status='common')."""
    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.post(
            DETAIL_URL,
            params={"data": json.dumps({"randomSalt": token, "is_accussed": True})},
            content=b"",
            headers={
                **_browser_headers(),
                "content-length": "0",
                "cookie": f"PHPSESSID={phpsessid}",
            },
        )
        try:
            body = resp.json()
        except Exception:
            raise RuntimeError(f"eparivahan returned non-JSON response (HTTP {resp.status_code})")
    return [_parse_challan(c) for c in body.get("results", [])]


async def _verify_otp_and_fetch(phpsessid: str, otp: str) -> list[dict]:
    """Steps 6–7: verify OTP → numeric randomSalt → fetch challans."""
    headers = {
        **_browser_headers(),
        "content-length": "0",
        "cookie": f"PHPSESSID={phpsessid}",
    }
    async with httpx.AsyncClient(timeout=20) as client:
        # Step 6: verify OTP
        otp_resp = await client.post(
            VERIFY_URL,
            params={"data": json.dumps({"otp_code": otp, "otp_type": "by_mobile_no"})},
            content=b"",
            headers=headers,
        )
        try:
            otp_body = otp_resp.json()
        except Exception:
            raise RuntimeError(f"eparivahan returned non-JSON response during OTP verification (HTTP {otp_resp.status_code})")
        log.info("verify-search-otp response: %s", otp_body)

        if otp_body.get("status") != "success":
            raise ValueError(otp_body.get("message", "OTP verification failed"))

        numeric_salt = str(otp_body["randomSalt"])

        # Step 7: fetch challans
        detail_resp = await client.post(
            DETAIL_URL,
            params={"data": json.dumps({"randomSalt": numeric_salt, "is_accussed": True})},
            content=b"",
            headers=headers,
        )
        try:
            body = detail_resp.json()
        except Exception:
            raise RuntimeError(f"eparivahan returned non-JSON response while fetching challans (HTTP {detail_resp.status_code})")
        log.info("get-challan-detail: status=%s results=%d", body.get("status"), len(body.get("results", [])))
        return [_parse_challan(c) for c in body.get("results", [])]


def _parse_challan(raw: dict) -> dict:
    seen: set = set()
    offences: list[dict] = []
    for o in raw.get("offences", []):
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

    initiate_search(vrn) → dict
      Returns {"otp_required": False, "challans": [...]}   when status='common'
      Returns {"otp_required": True,  "session_id": "..."}  when OTP needed

    verify_otp(session_id, otp) → list[dict]
      Submit OTP → return challan list.
    """

    async def initiate_search(self, vehicle_number: str) -> dict:
        vrn = vehicle_number.upper().replace(" ", "").replace("-", "")
        _cleanup_sessions()
        transport_failures: list[str] = []

        for transport_name, client_kwargs in _build_client_options():
            for attempt in range(5):
                try:
                    async with httpx.AsyncClient(**client_kwargs) as client:
                        tokens = await _load_page(client)
                        captcha_bytes = await _fetch_captcha(client)
                        captcha_text = await solve_captcha(captcha_bytes)

                        if not captcha_text:
                            raise RuntimeError("CAPTCHA solving returned empty string")

                        log.info(
                            "CAPTCHA solved: '%s' for %s via %s (attempt %d)",
                            captcha_text,
                            vrn,
                            transport_name,
                            attempt + 1,
                        )

                        search_resp = await _submit_search(client, vrn, captcha_text, tokens)
                        status = search_resp.get("status", "")

                        if status == "Failed":
                            msg = str(search_resp.get("message", "Search failed"))
                            # CHALLAN_NOT_FOUND can also appear when the CAPTCHA is wrong
                            # (eparivahan doesn't always say "captcha" in the message).
                            # Retry up to 3 attempts before trusting it as a genuine clean record.
                            if msg in ("CHALLAN_NOT_FOUND", "NO_CHALLAN_FOUND"):
                                if attempt < 4:
                                    log.warning(
                                        "CHALLAN_NOT_FOUND for %s on attempt %d — may be wrong CAPTCHA, retrying",
                                        vrn, attempt + 1,
                                    )
                                    await asyncio.sleep(1.0)
                                    continue
                                log.info("eparivahan confirmed no challans for %s (consistent across 5 attempts)", vrn)
                                return {"otp_required": False, "challans": [], "confirmed": True}
                            if "captcha" in msg.lower() and attempt < 4:
                                log.warning("Captcha wrong for %s, retrying (attempt %d)", vrn, attempt + 1)
                                await asyncio.sleep(1.0)
                                continue
                            raise ValueError(f"eparivahan: {msg}")

                        if status == "common":
                            # No OTP needed — fetch challans directly
                            token = search_resp.get("token", "")
                            challans = await _fetch_challans_direct(tokens["phpsessid"], token)
                            log.info("eparivahan no-OTP path: %d challan(s) for %s", len(challans), vrn)
                            return {"otp_required": False, "challans": challans, "confirmed": True}

                        # OTP required — trigger SMS then store session
                        otp_message = await _trigger_otp(client)
                        session_id = str(uuid.uuid4())
                        _sessions[session_id] = {
                            "vrn": vrn,
                            "phpsessid": tokens["phpsessid"],
                            "expires_at": time.time() + _SESSION_TTL,
                        }
                        log.info("eparivahan OTP sent for %s, session %s", vrn, session_id)
                        return {"otp_required": True, "session_id": session_id, "otp_message": otp_message}

                except ValueError:
                    raise
                except Exception as e:
                    if attempt == 4:
                        transport_failures.append(f"{transport_name}: {type(e).__name__}: {e}")
                        if _is_upstream_connectivity_error(e):
                            log.warning(
                                "eparivahan transport %s exhausted for %s due to connectivity issue: %s",
                                transport_name,
                                vrn,
                                e,
                            )
                        else:
                            raise
                    else:
                        log.warning(
                            "eparivahan attempt %d failed for %s via %s: %s",
                            attempt + 1,
                            vrn,
                            transport_name,
                            e,
                        )
                        await asyncio.sleep(2.0)

        if transport_failures:
            raise RuntimeError(_format_transport_failure(vrn, transport_failures))

        raise RuntimeError("eparivahan: all retries exhausted")

    async def verify_otp(self, session_id: str, otp: str) -> list[dict]:
        session = _sessions.get(session_id)
        if not session:
            raise ValueError("Session not found or expired. Please search again.")
        if time.time() > session["expires_at"]:
            del _sessions[session_id]
            raise ValueError("Session expired. Please search again.")

        challans = await _verify_otp_and_fetch(session["phpsessid"], otp)
        del _sessions[session_id]
        return challans
