"""Unit tests for message formatter functions."""
from bot.formatters import format_challans, format_no_challans

SAMPLE_CHALLANS = [
    {
        "amountChallan": 1000,
        "status": "Unpaid",
        "dateChallan": "2024-01-15 10:00:00",
        "detailsViolation": [{"offence": "Signal jumping", "penalty": "1000"}],
        "locationChallan": "Connaught Place",
        "challan_search_source": "CarInfo",
    },
    {
        "amountChallan": 500,
        "status": "Paid",
        "dateChallan": "2024-03-10",
        "detailsViolation": [{"offence": "No helmet", "penalty": "500"}],
        "locationChallan": "Rohini",
        "challan_search_source": "CarInfo",
    },
]


def test_format_challans_contains_vehicle():
    msg = format_challans("DL01AB1234", SAMPLE_CHALLANS)
    assert "DL01AB1234" in msg


def test_format_challans_shows_total_amount():
    msg = format_challans("DL01AB1234", SAMPLE_CHALLANS)
    assert "1,500" in msg or "1500" in msg


def test_format_challans_shows_count():
    msg = format_challans("DL01AB1234", SAMPLE_CHALLANS)
    assert "2" in msg


def test_format_challans_unpaid_shows_x():
    msg = format_challans("DL01AB1234", SAMPLE_CHALLANS)
    assert "❌" in msg


def test_format_challans_paid_shows_check():
    msg = format_challans("DL01AB1234", SAMPLE_CHALLANS)
    assert "✅" in msg


def test_format_challans_shows_offense():
    msg = format_challans("DL01AB1234", SAMPLE_CHALLANS)
    assert "Signal jumping" in msg


def test_format_challans_shows_date():
    msg = format_challans("DL01AB1234", SAMPLE_CHALLANS)
    assert "2024-01-15" in msg


def test_format_no_challans_contains_vehicle():
    msg = format_no_challans("MH02CD5678")
    assert "MH02CD5678" in msg


def test_format_no_challans_is_positive():
    msg = format_no_challans("MH02CD5678")
    assert "✅" in msg


def test_format_challans_single_item():
    challans = [SAMPLE_CHALLANS[0]]
    msg = format_challans("DL01AB1234", challans)
    assert "1" in msg
    assert "1,000" in msg or "1000" in msg


def test_format_challans_zero_amount():
    challans = [{
        "amountChallan": 0,
        "status": "Unpaid",
        "dateChallan": "2024-01-01",
        "detailsViolation": [],
        "locationChallan": "",
        "challan_search_source": "CarInfo",
    }]
    msg = format_challans("DL01AB1234", challans)
    assert "DL01AB1234" in msg
