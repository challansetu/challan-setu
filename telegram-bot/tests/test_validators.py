"""Unit tests for vehicle number validation."""
import pytest
from utils.validators import validate_vehicle_number, normalize_vehicle_number
from utils.errors import InvalidVehicleNumberError
from tests.fixtures import VALID_VEHICLE_NUMBERS, INVALID_VEHICLE_NUMBERS


@pytest.mark.parametrize("raw, expected", VALID_VEHICLE_NUMBERS)
def test_valid_vehicle_numbers(raw, expected):
    assert validate_vehicle_number(raw) == expected


@pytest.mark.parametrize("raw", INVALID_VEHICLE_NUMBERS)
def test_invalid_vehicle_numbers(raw):
    with pytest.raises(InvalidVehicleNumberError):
        validate_vehicle_number(raw)


def test_normalize_strips_spaces():
    assert normalize_vehicle_number("DL 01 AB 1234") == "DL01AB1234"


def test_normalize_strips_hyphens():
    assert normalize_vehicle_number("DL-01-AB-1234") == "DL01AB1234"


def test_normalize_uppercases():
    assert normalize_vehicle_number("dl01ab1234") == "DL01AB1234"


def test_error_message_is_helpful():
    with pytest.raises(InvalidVehicleNumberError) as exc_info:
        validate_vehicle_number("NOTACAR")
    assert "valid" in str(exc_info.value).lower() or "NOTACAR" in str(exc_info.value)
