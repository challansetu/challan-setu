"""Bot entrypoint."""
import logging
import os
import sys

from dotenv import load_dotenv
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
)
log = logging.getLogger("main")


def main() -> None:
    if not os.getenv("TELEGRAM_BOT_TOKEN"):
        log.critical("TELEGRAM_BOT_TOKEN is not set")
        sys.exit(1)

    from bot import build_application
    app = build_application()
    log.info("Starting bot (polling mode)")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
