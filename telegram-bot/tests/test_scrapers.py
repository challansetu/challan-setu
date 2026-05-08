"""Unit tests for CarInfo scraper — no real network calls."""
from __future__ import annotations

import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from scrapers.carinfo_scraper import CarInfoScraper, _parse, _decrypt
from scrapers import eparivahan_scraper
from tests.fixtures import CARINFO_DECRYPTED, CARINFO_DECRYPTED_EMPTY


# ── _parse() ──────────────────────────────────────────────────────────────────

class TestParse:
    def test_returns_correct_count(self):
        result = _parse(CARINFO_DECRYPTED, "DL01AB1234")
        assert len(result) == 2

    def test_maps_fields_correctly(self):
        result = _parse(CARINFO_DECRYPTED, "DL01AB1234")
        first = result[0]
        assert first["amountChallan"] == 1000
        assert first["dateChallan"] == "2024-01-15"
        assert first["detailsViolation"][0]["offence"] == "Signal jumping"
        assert first["locationChallan"] == "Connaught Place, New Delhi"
        assert first["challan_search_source"] == "CarInfo"
        assert first["rcNo"] == "DL01AB1234"
        assert first["State"] == "DL"

    def test_empty_tab_section_returns_empty_list(self):
        assert _parse(CARINFO_DECRYPTED_EMPTY, "DL01AB1234") == []

    def test_amount_with_commas(self):
        data = {
            "data": {
                "tabs": [{"tabSection": [{"date": "2024-01-01", "amount": "1,500", "offense": {"value": "Speeding"}, "location": {}}]}]
            }
        }
        result = _parse(data, "MH02CD5678")
        assert result[0]["amountChallan"] == 1500

    def test_missing_offense_gives_empty_violation(self):
        data = {
            "data": {
                "tabs": [{"tabSection": [{"date": "2024-01-01", "amount": "500", "offense": {}, "location": {}}]}]
            }
        }
        result = _parse(data, "DL01AB1234")
        assert result[0]["detailsViolation"] == []

    def test_none_amount_defaults_to_zero(self):
        data = {
            "data": {
                "tabs": [{"tabSection": [{"date": "2024-01-01", "amount": None, "offense": {"value": "Test"}, "location": {}}]}]
            }
        }
        result = _parse(data, "DL01AB1234")
        assert result[0]["amountChallan"] == 0

    def test_bad_entry_skipped_others_returned(self):
        data = {
            "data": {
                "tabs": [{"tabSection": ["not-a-dict", {"date": "2024-01-01", "amount": "200", "offense": {"value": "Test"}, "location": {}}]}]
            }
        }
        result = _parse(data, "DL01AB1234")
        assert len(result) == 1

    def test_malformed_tabs_returns_empty(self):
        assert _parse({"data": {}}, "DL01AB1234") == []
        assert _parse({}, "DL01AB1234") == []


# ── search_all_challans() — mocked network ────────────────────────────────────

class TestCarInfoScraper:
    @pytest.mark.asyncio
    async def test_returns_challans_on_success(self):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "pageProps": {"xdataprops": "dummy"}
        }

        with patch("scrapers.carinfo_scraper._get_build_id", new=AsyncMock(return_value="abc123")), \
             patch("scrapers.carinfo_scraper._decrypt", return_value=CARINFO_DECRYPTED):

            scraper = CarInfoScraper()
            with patch("httpx.AsyncClient") as mock_client_cls:
                mock_client = AsyncMock()
                mock_client.__aenter__ = AsyncMock(return_value=mock_client)
                mock_client.__aexit__ = AsyncMock(return_value=False)
                mock_client.get = AsyncMock(return_value=mock_response)
                mock_client_cls.return_value = mock_client

                result = await scraper.search_all_challans("DL01AB1234")

        assert len(result) == 2
        assert result[0]["amountChallan"] == 1000

    @pytest.mark.asyncio
    async def test_returns_empty_when_no_build_id(self):
        with patch("scrapers.carinfo_scraper._get_build_id", new=AsyncMock(return_value=None)):
            scraper = CarInfoScraper()
            with patch("httpx.AsyncClient") as mock_client_cls:
                mock_client = AsyncMock()
                mock_client.__aenter__ = AsyncMock(return_value=mock_client)
                mock_client.__aexit__ = AsyncMock(return_value=False)
                mock_client_cls.return_value = mock_client

                result = await scraper.search_all_challans("DL01AB1234")

        assert result == []

    @pytest.mark.asyncio
    async def test_returns_empty_on_network_exception(self):
        import httpx as _httpx
        with patch("scrapers.carinfo_scraper._get_build_id", new=AsyncMock(return_value="abc123")):
            scraper = CarInfoScraper()
            with patch("httpx.AsyncClient") as mock_client_cls:
                mock_client = AsyncMock()
                mock_client.__aenter__ = AsyncMock(return_value=mock_client)
                mock_client.__aexit__ = AsyncMock(return_value=False)
                mock_client.get = AsyncMock(side_effect=_httpx.NetworkError("Connection refused"))
                mock_client_cls.return_value = mock_client

                result = await scraper.search_all_challans("DL01AB1234")

        assert result == []

    @pytest.mark.asyncio
    async def test_normalises_vehicle_number(self):
        called_with = []

        async def fake_fetch(self_arg, client, vn, build_id, ua):
            called_with.append(vn)
            return []

        with patch("scrapers.carinfo_scraper._get_build_id", new=AsyncMock(return_value="abc123")), \
             patch.object(CarInfoScraper, "_fetch_with_retry", new=fake_fetch):

            scraper = CarInfoScraper()
            with patch("httpx.AsyncClient") as mock_client_cls:
                mock_client = AsyncMock()
                mock_client.__aenter__ = AsyncMock(return_value=mock_client)
                mock_client.__aexit__ = AsyncMock(return_value=False)
                mock_client_cls.return_value = mock_client
                await scraper.search_all_challans("dl 01-ab 1234")

        assert called_with[0] == "DL01AB1234"


class TestEparivahanTransportOptions:
    def test_prefers_direct_without_proxy(self):
        with patch.object(eparivahan_scraper, "_EPARIVAHAN_PROXY_URL", ""), \
             patch.object(eparivahan_scraper, "_SYSTEM_PROXY_URL", ""):
            options = eparivahan_scraper._build_client_options()

        assert len(options) == 1
        assert options[0][0] == "direct"
        assert options[0][1]["trust_env"] is False
        assert "proxy" not in options[0][1]

    def test_adds_explicit_proxy_as_fallback(self):
        with patch.object(eparivahan_scraper, "_EPARIVAHAN_PROXY_URL", "http://proxy.example:8080"), \
             patch.object(eparivahan_scraper, "_SYSTEM_PROXY_URL", ""):
            options = eparivahan_scraper._build_client_options()

        assert [name for name, _ in options] == ["direct", "configured-proxy"]
        assert options[1][1]["proxy"] == "http://proxy.example:8080"

    def test_formats_actionable_transport_error(self):
        with patch.object(eparivahan_scraper, "_EPARIVAHAN_PROXY_URL", ""):
            message = eparivahan_scraper._format_transport_failure(
                "RJ14JP1684",
                ["direct: ConnectTimeout: connection failed"],
            )

        assert "Unable to reach eparivahan for RJ14JP1684" in message
        assert "EPARIVAHAN_PROXY_URL" in message
