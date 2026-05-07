"""Shared data types for scrapers."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ChallanResult:
    """Normalised challan record."""
    success: bool
    platform: str
    vehicle_number: str
    scrape_time: float = 0.0
    challan_id: Optional[str] = None
    violation_type: Optional[str] = None
    amount: Optional[int] = None
    status: Optional[str] = None
    issue_date: Optional[str] = None
    due_date: Optional[str] = None
    location: Optional[str] = None
    owner_name: Optional[str] = None
    registration_number: Optional[str] = None
    raw_data: dict = field(default_factory=dict)
    error: Optional[str] = None


class BaseScraper:
    """Minimal base — kept for backwards compatibility with tests."""

    @staticmethod
    def _parse_amount(text: Optional[str]) -> Optional[int]:
        if not text:
            return None
        digits = "".join(c for c in text if c.isdigit())
        return int(digits) if digits else None

    @staticmethod
    def _clean_text(text: Optional[str]) -> Optional[str]:
        if not text:
            return None
        return " ".join(text.split()).strip() or None
