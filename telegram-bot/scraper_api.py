"""
FastAPI HTTP server exposing two scrapers:

  POST /search              — CarInfo scraper (existing, no OTP needed)
  POST /eparivahan/initiate — Step 1: submit VRN, solve CAPTCHA, trigger OTP
  POST /eparivahan/verify   — Step 2: verify OTP, return challans
  GET  /health              — health check
"""
from __future__ import annotations

import logging
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from scrapers.carinfo_scraper import CarInfoScraper
from scrapers.eparivahan_scraper import EparivahanScraper

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
)
log = logging.getLogger("scraper_api")

app = FastAPI(title="Challan Scraper API")
_eparivahan = EparivahanScraper()


# ── Models ────────────────────────────────────────────────────────────────────

class SearchRequest(BaseModel):
    vehicleNumber: str


class OtpVerifyRequest(BaseModel):
    sessionId: str
    otp: str


# ── CarInfo endpoint (unchanged) ──────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/search")
async def search_challans(req: SearchRequest):
    vn = req.vehicleNumber.upper().replace(" ", "").replace("-", "")
    log.info("CarInfo: scraping %s", vn)
    try:
        async with CarInfoScraper() as scraper:
            challans = await scraper.search_all_challans(vn)
        return {"success": True, "vehicleNumber": vn, "challans": challans, "source": "CarInfo"}
    except Exception as exc:
        log.error("CarInfo error for %s: %s", vn, exc, exc_info=True)
        return {"success": False, "vehicleNumber": vn, "challans": [], "error": str(exc)}


# ── eparivahan two-step endpoints ─────────────────────────────────────────────

@app.post("/eparivahan/initiate")
async def eparivahan_initiate(req: SearchRequest):
    """
    Step 1: load page, solve CAPTCHA, submit VRN.

    Two possible responses:
      {"success": true, "otpRequired": false, "challans": [...]}  — no OTP, data returned immediately
      {"success": true, "otpRequired": true, "sessionId": "..."}  — OTP sent to mobile, call /verify next
    """
    vn = req.vehicleNumber.upper().replace(" ", "").replace("-", "")
    log.info("eparivahan: initiating search for %s", vn)
    try:
        result = await _eparivahan.initiate_search(vn)
        if result.get("otp_required"):
            return {
                "success": True,
                "otpRequired": True,
                "sessionId": result["session_id"],
                "otpMessage": result.get("otp_message", "OTP sent to your registered mobile number."),
                "vehicleNumber": vn,
            }
        else:
            return {
                "success": True,
                "otpRequired": False,
                "challans": result.get("challans", []),
                "confirmed": result.get("confirmed", False),
                "vehicleNumber": vn,
            }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as exc:
        log.error("eparivahan initiate error for %s: %s", vn, exc, exc_info=True)
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/eparivahan/verify")
async def eparivahan_verify(req: OtpVerifyRequest):
    """
    Step 2: verify OTP entered by user, return challan list.
    Deletes the session after use.
    """
    log.info("eparivahan: verifying OTP for session %s", req.sessionId)
    try:
        challans = await _eparivahan.verify_otp(req.sessionId, req.otp)
        return {"success": True, "challans": challans}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as exc:
        log.error("eparivahan verify error: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail=str(exc))


if __name__ == "__main__":
    port = int(os.environ.get("PORT", os.environ.get("SCRAPER_API_PORT", "8001")))
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
