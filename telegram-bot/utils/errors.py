"""Custom exception hierarchy for the challan bot."""


class ChallanBotError(Exception):
    """Root exception for this project."""
    user_message: str = "An unexpected error occurred. Please try again."


# ── Input validation ──────────────────────────────────────────────────────────

class InputValidationError(ChallanBotError):
    user_message = "Invalid input. Please check your vehicle number format."


class InvalidVehicleNumberError(InputValidationError):
    user_message = (
        "Invalid vehicle number format. "
        "Expected format: DL01AB1234 or DL 01 AB 1234"
    )


# ── Network / HTTP ────────────────────────────────────────────────────────────

class NetworkError(ChallanBotError):
    user_message = "Network error. Please check your internet connection."


class ConnectionTimeoutError(NetworkError):
    user_message = "Connection timed out. The platform may be slow."


class PlatformUnavailableError(NetworkError):
    user_message = "Platform temporarily unavailable."


class RateLimitedError(NetworkError):
    user_message = "Too many requests. Please wait a moment and try again."


class HTTPError(NetworkError):
    def __init__(self, status_code: int, url: str = ""):
        self.status_code = status_code
        self.url = url
        super().__init__(f"HTTP {status_code} from {url}")
        if status_code == 404:
            self.user_message = "Page not found on this platform."
        elif status_code == 429:
            self.user_message = "Rate limited by platform. Trying next one."
        elif status_code >= 500:
            self.user_message = "Platform server error. Trying next one."
        else:
            self.user_message = f"HTTP error {status_code}. Trying next platform."


# ── Scraping ──────────────────────────────────────────────────────────────────

class ScrapingError(ChallanBotError):
    user_message = "Failed to extract data from platform."


class ElementNotFoundError(ScrapingError):
    user_message = "Expected page element not found. Platform may have changed."


class ParseError(ScrapingError):
    user_message = "Failed to parse platform response."


class CaptchaEncounteredError(ScrapingError):
    user_message = "CAPTCHA detected. Cannot automate this platform."


class PageStructureChangedError(ScrapingError):
    user_message = "Platform structure has changed. Please contact support."


class NoChallansFoundError(ScrapingError):
    """Not an error per se — vehicle has no challans on this platform."""
    user_message = "No challans found for this vehicle number."


# ── Session ───────────────────────────────────────────────────────────────────

class SessionError(ChallanBotError):
    user_message = "Session expired. Please try again."


class AuthenticationError(SessionError):
    user_message = "Authentication failed. Session may have expired."


# ── Bot / Telegram ────────────────────────────────────────────────────────────

class BotError(ChallanBotError):
    user_message = "Bot encountered an error. Please try again."


class TelegramAPIError(BotError):
    user_message = "Telegram API error. Please try again shortly."


# ── Database ──────────────────────────────────────────────────────────────────

class DatabaseError(ChallanBotError):
    user_message = "Database error. Your search was not saved."


class DatabaseConnectionError(DatabaseError):
    user_message = "Cannot connect to database."


# ── Rate limiting (user-facing) ───────────────────────────────────────────────

class UserRateLimitError(ChallanBotError):
    user_message = (
        "You're searching too fast! Please wait a moment before trying again."
    )


# ── Mapping for structured logging & user messaging ───────────────────────────

FRIENDLY_MESSAGES: dict[type, str] = {
    InvalidVehicleNumberError: (
        "Please enter a valid Indian vehicle number.\n"
        "Example: `DL01AB1234` or `MH02CD5678`"
    ),
    ConnectionTimeoutError: "The platform took too long to respond.",
    PlatformUnavailableError: "This platform is temporarily unavailable.",
    RateLimitedError: "We're being rate-limited by the platform.",
    CaptchaEncounteredError: "This platform requires CAPTCHA verification.",
    NoChallansFoundError: "No challans found for this vehicle.",
    UserRateLimitError: (
        "You're making too many requests. Please wait 12 seconds."
    ),
}


def get_user_message(exc: Exception) -> str:
    for exc_type, msg in FRIENDLY_MESSAGES.items():
        if isinstance(exc, exc_type):
            return msg
    if isinstance(exc, ChallanBotError):
        return exc.user_message
    return "Something went wrong. Please try again."
