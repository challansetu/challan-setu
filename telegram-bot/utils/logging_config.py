"""Logging configuration: rotating file handlers + console."""
import logging
import logging.handlers
import os
import sys

from config import LOG_LEVEL

_FMT = "%(asctime)s | %(levelname)-8s | %(name)-20s | %(message)s"
_DATE_FMT = "%Y-%m-%d %H:%M:%S"
_LOG_DIR = os.getenv("LOG_DIR", "./logs")
_LOG_MAX_BYTES = int(os.getenv("LOG_MAX_BYTES", str(5 * 1024 * 1024)))
_LOG_BACKUP_COUNT = int(os.getenv("LOG_BACKUP_COUNT", "10"))


def _rotating_handler(filename: str) -> logging.handlers.RotatingFileHandler:
    os.makedirs(_LOG_DIR, exist_ok=True)
    path = os.path.join(_LOG_DIR, filename)
    h = logging.handlers.RotatingFileHandler(
        path, maxBytes=_LOG_MAX_BYTES, backupCount=_LOG_BACKUP_COUNT, encoding="utf-8"
    )
    h.setFormatter(logging.Formatter(_FMT, _DATE_FMT))
    return h


def setup_logging() -> None:
    numeric_level = getattr(logging, LOG_LEVEL.upper(), logging.INFO)

    console = logging.StreamHandler(sys.stdout)
    console.setFormatter(logging.Formatter(_FMT, _DATE_FMT))
    console.setLevel(numeric_level)

    root = logging.getLogger()
    root.setLevel(numeric_level)
    root.addHandler(console)
    root.addHandler(_rotating_handler("bot.log"))

    scraper_log = logging.getLogger("scraper")
    scraper_log.addHandler(_rotating_handler("scraper.log"))

    error_handler = _rotating_handler("error.log")
    error_handler.setLevel(logging.WARNING)
    root.addHandler(error_handler)

    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("telegram").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
