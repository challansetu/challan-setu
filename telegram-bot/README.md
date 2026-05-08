# Vehicle Challan Telegram Bot

A Telegram bot that searches for vehicle challans across multiple Indian platforms sequentially and returns results in real-time.

## Platform Priority & Feasibility

| Platform | Feasibility | Anti-Bot | Notes |
|----------|-------------|----------|-------|
| **CarInfo** | HIGH | None | Next.js, API-interceptable |
| **Cars24** | MODERATE | OTP | Interceptable if OTP not triggered |
| **ParkPlus** | LOW | CAPTCHA + OTP | VAHAN gateway |
| **Spinny** | LOW | CAPTCHA + OTP | Parivahan gateway |

**Search order:** CarInfo → Cars24 → ParkPlus → Spinny (first success wins)

## Features

- Sequential platform search with real-time Telegram status updates
- Automatic fallback to next platform on failure
- In-memory result caching (5 min TTL)
- Per-user rate limiting (5 searches/min, 12s cooldown)
- SQLite persistence: search history, per-platform stats
- Health check HTTP server (`/health`, `/metrics`, `/ready`)
- Rotating log files (bot, scraper, database, error)

## Quick Start

```bash
cd telegram-bot

# 1. Install dependencies
pip install -r requirements.txt
playwright install chromium

# 2. Configure
cp .env.example .env
# Edit .env and set TELEGRAM_BOT_TOKEN

# 3. Run
python main.py
```

## Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message |
| `/search DL01AB1234` | Search for challans |
| `/history` | Last 5 searches |
| `/status` | Platform success rates |
| `/help` | Usage guide |

You can also send a vehicle number directly without a command.

## Vehicle Number Format

Indian format: `[State][RTO][Series][Number]`

```
DL01AB1234   — Delhi, RTO 01, series AB, number 1234
MH02CD5678   — Maharashtra
KA03EF9012   — Karnataka
```

Spaces and hyphens are stripped automatically.

## Project Structure

```
telegram-bot/
├── main.py                  # Entrypoint
├── config.py                # All configuration
├── requirements.txt
├── .env.example
├── scrapers/
│   ├── base_scraper.py      # Abstract base + ChallanResult dataclass
│   ├── search_engine.py     # Sequential search with event streaming
│   ├── carinfo_scraper.py   # CarInfo (highest success rate)
│   ├── cars24_scraper.py    # Cars24 (OTP may block)
│   ├── parkplus_scraper.py  # ParkPlus (CAPTCHA may block)
│   └── spinny_scraper.py    # Spinny (Parivahan gateway)
├── bot/
│   ├── bot.py               # Application builder
│   ├── handlers.py          # Command & message handlers
│   ├── formatters.py        # Telegram message formatting
│   └── rate_limiter.py      # Per-user rate limiting
├── database/
│   └── db.py                # SQLite CRUD layer
├── utils/
│   ├── errors.py            # Exception hierarchy
│   ├── validators.py        # Vehicle number validation
│   └── logging_config.py   # Rotating file + console logging
├── monitoring/
│   ├── health.py            # HTTP health check server
│   └── metrics.py           # In-process counters/gauges
└── tests/
    ├── fixtures.py          # Shared mock data
    ├── test_validators.py
    ├── test_scrapers.py
    ├── test_database.py
    ├── test_search_engine.py
    ├── test_formatters.py
    └── test_rate_limiter.py
```

## Configuration

All settings live in `config.py` and can be overridden via environment variables or `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `TELEGRAM_BOT_TOKEN` | — | Required |
| `POLLING_MODE` | `true` | `false` for webhook |
| `SCRAPER_TIMEOUT` | `20` | Seconds per platform |
| `TOTAL_TIMEOUT` | `90` | Seconds for all platforms |
| `HEADLESS_BROWSER` | `true` | Set `false` to debug |
| `CACHE_ENABLED` | `true` | Cache results 5 min |
| `LOG_LEVEL` | `INFO` | DEBUG/INFO/WARNING/ERROR |
| `HEALTH_CHECK_PORT` | `8080` | `/health` endpoint port |

For `eparivahan`, production hosts outside India may need `EPARIVAHAN_PROXY_URL`
set to an Indian proxy. The scraper now prefers direct outbound traffic and only
uses a proxy when explicitly configured, which avoids accidental platform proxy
env vars causing connection failures.

## Running Tests

```bash
pytest
```

Tests use mocked Playwright pages — no real network calls.

## Adding a New Platform

1. Create `scrapers/my_platform_scraper.py` extending `BaseScraper`
2. Implement `async def _search(self, vehicle_number: str) -> ChallanResult`
3. Register it in `scrapers/search_engine.py` → `_SCRAPER_MAP`
4. Add an entry to `PLATFORMS` in `config.py`

## Maintenance

```bash
# Manual database backup
python -c "from database import Database; Database().backup()"

# Delete searches older than 30 days
python -c "from database import Database; Database().delete_old_searches(30)"

# View platform stats
python -c "from database import Database; import json; print(json.dumps(Database().get_platform_stats(), indent=2))"
```

## Health Check

```bash
curl http://localhost:8080/health
curl http://localhost:8080/metrics
curl http://localhost:8080/ready
```

## License

MIT
