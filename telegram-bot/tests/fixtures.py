"""Shared test fixtures and mock data."""
from __future__ import annotations

# ── Valid/invalid vehicle numbers ─────────────────────────────────────────────

VALID_VEHICLE_NUMBERS = [
    ("DL01AB1234", "DL01AB1234"),
    ("dl 01 ab 1234", "DL01AB1234"),
    ("MH-02-CD-5678", "MH02CD5678"),
    ("KA03EF9012", "KA03EF9012"),
    ("UP14BT2345", "UP14BT2345"),
]

INVALID_VEHICLE_NUMBERS = [
    "",
    "   ",
    "INVALID",
    "123456",
    "DL AB 1234",
    "A" * 25,
]

# ── Mock CarInfo decrypted payload ────────────────────────────────────────────

CARINFO_DECRYPTED = {
    "data": {
        "tabs": [
            {
                "tabSection": [
                    {
                        "date": "2024-01-15",
                        "amount": "1000",
                        "offense": {"value": "Signal jumping"},
                        "location": {"value": "Connaught Place, New Delhi"},
                    },
                    {
                        "date": "2024-03-10",
                        "amount": "500",
                        "offense": {"value": "No helmet"},
                        "location": {"value": "Rohini, Delhi"},
                    },
                ]
            }
        ]
    }
}

CARINFO_DECRYPTED_EMPTY = {
    "data": {
        "tabs": [{"tabSection": []}]
    }
}
