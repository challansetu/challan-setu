"""Central configuration for the vehicle challan Telegram bot."""
import os
from dotenv import load_dotenv

load_dotenv()

# ── Telegram ──────────────────────────────────────────────────────────────────
TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "")

# ── Scraper API ───────────────────────────────────────────────────────────────
SCRAPER_API_URL: str = os.getenv("SCRAPER_API_URL", "http://127.0.0.1:8001")
SCRAPER_TIMEOUT: int = int(os.getenv("SCRAPER_TIMEOUT", "120"))  # seconds

# ── Rate limiting ─────────────────────────────────────────────────────────────
MAX_SEARCHES_PER_MINUTE: int = int(os.getenv("MAX_SEARCHES_PER_MINUTE", "5"))
SEARCH_COOLDOWN: int = int(os.getenv("SEARCH_COOLDOWN", "10"))  # seconds

# ── Logging ───────────────────────────────────────────────────────────────────
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
