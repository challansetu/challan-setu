"""
FastAPI HTTP server that wraps the CarInfo challan scraper.

Usage:
    python scraper_api.py
    # Listens on http://127.0.0.1:8001
"""
from __future__ import annotations

import logging
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel

from scrapers.carinfo_scraper import CarInfoScraper

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
)
log = logging.getLogger("scraper_api")

app = FastAPI(title="Challan Scraper API")


class SearchRequest(BaseModel):
    vehicleNumber: str


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/search")
async def search_challans(req: SearchRequest):
    vn = req.vehicleNumber.upper().replace(" ", "").replace("-", "")
    log.info("Scraping challans for: %s", vn)

    try:
        async with CarInfoScraper() as scraper:
            challans = await scraper.search_all_challans(vn)
        log.info("CarInfo: %d challan(s) for %s", len(challans), vn)
        return {
            "success": True,
            "vehicleNumber": vn,
            "challans": challans,
            "source": "CarInfo",
        }
    except Exception as exc:
        log.error("Scraper error for %s: %s", vn, exc, exc_info=True)
        return {
            "success": False,
            "vehicleNumber": vn,
            "challans": [],
            "error": str(exc),
        }


if __name__ == "__main__":
    port = int(os.environ.get("SCRAPER_API_PORT", "8001"))
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")
