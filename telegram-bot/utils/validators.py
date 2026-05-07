"""Vehicle number validation for Indian registration plates."""
import re
from .errors import InvalidVehicleNumberError

# Standard Indian vehicle number pattern:
# 2 letters (state code) + 2 digits (RTO code) + 1-2 letters + 4 digits
# e.g., DL01AB1234, MH02C5678, KA03EF1234
_VEHICLE_PATTERN = re.compile(
    r"^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$",
    re.IGNORECASE,
)

# Older format: state + 2 digits + up to 4 digits (no alpha suffix)
_VEHICLE_PATTERN_OLD = re.compile(
    r"^[A-Z]{2}[0-9]{1,2}[0-9]{1,4}$",
    re.IGNORECASE,
)

MAX_INPUT_LENGTH = 20


def normalize_vehicle_number(raw: str) -> str:
    """Strip spaces, hyphens, dots and uppercase."""
    cleaned = re.sub(r"[\s\-.]", "", raw.strip()).upper()
    return cleaned


def validate_vehicle_number(raw: str) -> str:
    """Return the normalised vehicle number or raise InvalidVehicleNumberError."""
    if not raw or not raw.strip():
        raise InvalidVehicleNumberError("Vehicle number cannot be empty.")

    if len(raw) > MAX_INPUT_LENGTH:
        raise InvalidVehicleNumberError(
            f"Vehicle number too long (max {MAX_INPUT_LENGTH} characters)."
        )

    normalised = normalize_vehicle_number(raw)

    if not (_VEHICLE_PATTERN.match(normalised) or _VEHICLE_PATTERN_OLD.match(normalised)):
        raise InvalidVehicleNumberError(
            f"'{raw}' is not a valid Indian vehicle number."
        )

    return normalised
