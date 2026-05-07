"""Build and return the Telegram Application."""
from __future__ import annotations

import logging
from telegram.ext import Application, MessageHandler, filters

from config import TELEGRAM_BOT_TOKEN
from bot.handlers import handle_text

log = logging.getLogger("bot")


def build_application() -> Application:
    if not TELEGRAM_BOT_TOKEN:
        raise ValueError("TELEGRAM_BOT_TOKEN is not set")

    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))

    log.info("Bot ready")
    return app
