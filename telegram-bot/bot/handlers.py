"""Telegram message handlers."""
from __future__ import annotations

import logging

import httpx
from telegram import Update, Message
from telegram.ext import ContextTypes
from telegram.constants import ParseMode
from telegram.error import TelegramError

from config import SCRAPER_API_URL, SCRAPER_TIMEOUT
from bot.formatters import format_challans, format_no_challans
from bot.rate_limiter import RateLimiter
from utils.validators import validate_vehicle_number
from utils.errors import InvalidVehicleNumberError, UserRateLimitError

log = logging.getLogger("bot.handlers")

_rate_limiter = RateLimiter()
_SEARCH_URL = f"{SCRAPER_API_URL}/search"


async def _edit(msg: Message, text: str) -> None:
    try:
        await msg.edit_text(text, parse_mode=ParseMode.MARKDOWN)
    except TelegramError as e:
        if "not modified" not in str(e).lower():
            log.warning("Edit failed: %s", e)


async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message or not update.message.text:
        return

    raw = update.message.text.strip()
    user_id = update.effective_user.id if update.effective_user else 0

    # Validate vehicle number
    try:
        vehicle = validate_vehicle_number(raw)
    except InvalidVehicleNumberError:
        await update.message.reply_text(
            "Send a valid vehicle number.\nExample: `DL01AB1234`",
            parse_mode=ParseMode.MARKDOWN,
        )
        return

    # Rate limit check
    try:
        _rate_limiter.check(user_id)
    except UserRateLimitError as e:
        await update.message.reply_text(str(e))
        return

    _rate_limiter.record(user_id)
    log.info("Searching: %s (user %s)", vehicle, user_id)

    status_msg = await update.message.reply_text(
        f"🔍 Searching `{vehicle}`...",
        parse_mode=ParseMode.MARKDOWN,
    )

    try:
        async with httpx.AsyncClient(timeout=SCRAPER_TIMEOUT) as client:
            resp = await client.post(_SEARCH_URL, json={"vehicleNumber": vehicle})
            data = resp.json()

        challans = data.get("challans") or []
        if challans:
            await _edit(status_msg, format_challans(vehicle, challans))
        else:
            await _edit(status_msg, format_no_challans(vehicle))

    except httpx.ConnectError:
        log.error("Scraper API not reachable at %s", _SEARCH_URL)
        await _edit(status_msg, "❌ Service temporarily unavailable. Please try again later.")
    except httpx.TimeoutException:
        log.error("Scraper API timeout for %s", vehicle)
        await _edit(status_msg, f"❌ Search timed out for `{vehicle}`. Please try again.")
    except Exception as exc:
        log.error("Search failed for %s: %s", vehicle, exc, exc_info=True)
        await _edit(status_msg, f"❌ Search failed for `{vehicle}`. Please try again.")
