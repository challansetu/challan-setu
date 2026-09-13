"""Unit tests for CarInfo scraper — no real network calls."""
from __future__ import annotations

import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from scrapers.carinfo_scraper import (
    CarInfoScraper,
    ScraperUnavailableError,
    _CHROME_PROFILES,
    _parse,
    _decrypt,
)
from scrapers import eparivahan_scraper
from tests.fixtures import CARINFO_DECRYPTED, CARINFO_DECRYPTED_EMPTY


# ── UA profiles ───────────────────────────────────────────────────────────────

class TestChromeProfiles:
    """
    CarInfo routes by User-Agent: mobile UAs get the App Router build, which has
    no /_next/data endpoint and 404s. Only desktop UAs reach the legacy Pages
    build the scraper depends on. A mobile profile here silently returns
    "no challans" for every lookup that picks it.
    """

    def test_profiles_exist(self):
        assert len(_CHROME_PROFILES) >= 1

    @pytest.mark.parametrize("profile", _CHROME_PROFILES)
    def test_no_mobile_profiles(self, profile):
        ua, _sec_ch_ua, mobile, platform = profile
        assert mobile == "?0", f"mobile sec-ch-ua-mobile in profile: {ua}"
        assert "Mobile" not in ua, f"mobile token in UA: {ua}"
        assert "Android" not in ua, f"Android UA would hit the App Router: {ua}"
        assert platform not in ('"Android"', '"iOS"'), f"mobile platform: {platform}"


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

    def test_genuine_empty_tab_section_returns_empty(self):
        # The only payload that may be reported as "no challans"
        assert _parse({"data": {"tabs": [{"tabSection": []}]}}, "DL01AB1234") == []

    @pytest.mark.parametrize("payload", [
        # A vehicle with no challans: tab holds an empty-state message, no tabSection.
        {"data": {"tabs": [{"title": "Pending", "message": {"text": "No challans"}}]}},
        {"data": {"tabs": [{"tabSection": None}]}},
    ])
    def test_absent_tab_section_is_genuine_empty(self, payload):
        assert _parse(payload, "DL01AB1234") == []

    @pytest.mark.parametrize("payload", [
        {},                                        # no envelope at all
        {"data": {}},                              # no tabs
        {"data": {"tabs": []}},                    # empty tabs
        {"data": {"tabs": "nope"}},                # tabs wrong type
        {"data": {"tabs": [{"tabSection": {}}]}},  # tabSection wrong type
        {"data": {"tabs": [{"tabSection": "x"}]}},
    ])
    def test_malformed_payload_raises_rather_than_reporting_empty(self, payload):
        with pytest.raises(ScraperUnavailableError):
            _parse(payload, "DL01AB1234")


# ── search_all_challans() — mocked network ────────────────────────────────────

class TestHandleResponse:
    """Classification of upstream responses — where 'broken' vs 'empty' is decided."""

    def _resp(self, status, json_body=None, raises=False):
        r = MagicMock()
        r.status_code = status
        if raises:
            r.json.side_effect = ValueError("not json")
        else:
            r.json.return_value = json_body
        return r

    def test_404_signals_build_id_refresh(self):
        assert CarInfoScraper()._handle_response(self._resp(404), "DL01AB1234") is None

    @pytest.mark.parametrize("status", [429, 500, 502, 503])
    def test_transient_statuses_raise_retryable_error(self, status):
        # Plain Exception => the retry wrapper will back off and try again
        with pytest.raises(Exception) as ei:
            CarInfoScraper()._handle_response(self._resp(status), "DL01AB1234")
        assert not isinstance(ei.value, ScraperUnavailableError)

    @pytest.mark.parametrize("status", [301, 403, 418])
    def test_unexpected_status_is_terminal(self, status):
        with pytest.raises(ScraperUnavailableError):
            CarInfoScraper()._handle_response(self._resp(status), "DL01AB1234")

    def test_non_json_body_is_terminal(self):
        with pytest.raises(ScraperUnavailableError):
            CarInfoScraper()._handle_response(self._resp(200, raises=True), "DL01AB1234")

    def test_missing_xdataprops_is_genuine_empty(self):
        resp = self._resp(200, {"pageProps": {}})
        assert CarInfoScraper()._handle_response(resp, "DL01AB1234") == []

    def test_decrypt_failure_is_terminal(self):
        resp = self._resp(200, {"pageProps": {"xdataprops": "garbage"}})
        with patch("scrapers.carinfo_scraper._decrypt", return_value=None):
            with pytest.raises(ScraperUnavailableError):
                CarInfoScraper()._handle_response(resp, "DL01AB1234")

    def test_successful_decrypt_returns_challans(self):
        resp = self._resp(200, {"pageProps": {"xdataprops": "dummy"}})
        with patch("scrapers.carinfo_scraper._decrypt", return_value=CARINFO_DECRYPTED):
            result = CarInfoScraper()._handle_response(resp, "DL01AB1234")
        assert len(result) == 2
        assert result[0]["amountChallan"] == 1000


# ── search_all_challans() — mocked transport ──────────────────────────────────

@pytest.fixture
def no_sleep():
    """Skip human-pacing and retry backoff delays."""
    with patch("scrapers.carinfo_scraper.asyncio.sleep", new=AsyncMock()):
        yield


def _mock_curl_session(get_mock):
    """Stand in for curl_cffi AsyncSession (the transport used in production)."""
    session = AsyncMock()
    session.__aenter__ = AsyncMock(return_value=session)
    session.__aexit__ = AsyncMock(return_value=False)
    session.get = get_mock
    factory = MagicMock(return_value=session)
    return factory, session


class TestCarInfoScraper:
    """
    These patch the curl_cffi transport, since _USE_CURL is true whenever
    curl_cffi is installed — patching httpx.AsyncClient would leak real network calls.
    """

    def _patch_transport(self, get_mock):
        factory, _ = _mock_curl_session(get_mock)
        return patch.multiple(
            "scrapers.carinfo_scraper",
            _USE_CURL=True,
            _CurlSession=factory,
        )

    def _json_response(self, status=200, body=None):
        r = MagicMock()
        r.status_code = status
        r.json.return_value = body if body is not None else {"pageProps": {"xdataprops": "dummy"}}
        return r

    @pytest.mark.asyncio
    async def test_returns_challans_on_success(self, no_sleep):
        get_mock = AsyncMock(return_value=self._json_response())
        with self._patch_transport(get_mock), \
             patch("scrapers.carinfo_scraper._get_build_id", new=AsyncMock(return_value="abc123")), \
             patch("scrapers.carinfo_scraper._decrypt", return_value=CARINFO_DECRYPTED):
            result = await CarInfoScraper().search_all_challans("DL01AB1234")

        assert len(result) == 2
        assert result[0]["amountChallan"] == 1000

    @pytest.mark.asyncio
    async def test_genuine_empty_returns_empty_list(self, no_sleep):
        """A vehicle with no challans must still resolve to [] — not an error."""
        get_mock = AsyncMock(return_value=self._json_response(body={"pageProps": {}}))
        with self._patch_transport(get_mock), \
             patch("scrapers.carinfo_scraper._get_build_id", new=AsyncMock(return_value="abc123")):
            result = await CarInfoScraper().search_all_challans("DL01AB1234")

        assert result == []

    @pytest.mark.asyncio
    async def test_missing_build_id_raises(self, no_sleep):
        get_mock = AsyncMock(return_value=self._json_response())
        with self._patch_transport(get_mock), \
             patch("scrapers.carinfo_scraper._get_build_id", new=AsyncMock(return_value=None)):
            with pytest.raises(ScraperUnavailableError):
                await CarInfoScraper().search_all_challans("DL01AB1234")

    @pytest.mark.asyncio
    async def test_persistent_404_raises_instead_of_reporting_no_challans(self, no_sleep):
        """
        Regression test for the Aug 2026 outage: CarInfo moved /challan-details to
        the App Router, so _next/data 404s forever. That must never look like a
        vehicle with zero challans.
        """
        get_mock = AsyncMock(return_value=self._json_response(status=404))
        with self._patch_transport(get_mock), \
             patch("scrapers.carinfo_scraper._get_build_id", new=AsyncMock(return_value="abc123")):
            with pytest.raises(ScraperUnavailableError) as ei:
                await CarInfoScraper().search_all_challans("DL01AB1234")

        assert "404" in str(ei.value)

    @pytest.mark.asyncio
    async def test_network_error_raises_after_retries_exhausted(self, no_sleep):
        import httpx as _httpx
        get_mock = AsyncMock(side_effect=_httpx.NetworkError("Connection refused"))
        with self._patch_transport(get_mock), \
             patch("scrapers.carinfo_scraper._get_build_id", new=AsyncMock(return_value="abc123")):
            with pytest.raises(ScraperUnavailableError):
                await CarInfoScraper().search_all_challans("DL01AB1234")

        assert get_mock.await_count == 3  # _MAX_RETRIES

    @pytest.mark.asyncio
    async def test_terminal_error_is_not_retried(self, no_sleep):
        get_mock = AsyncMock(return_value=self._json_response(status=403))
        with self._patch_transport(get_mock), \
             patch("scrapers.carinfo_scraper._get_build_id", new=AsyncMock(return_value="abc123")):
            with pytest.raises(ScraperUnavailableError):
                await CarInfoScraper().search_all_challans("DL01AB1234")

        assert get_mock.await_count == 1

    @pytest.mark.asyncio
    async def test_empty_result_confirmed_with_fresh_session_finds_challans(self, no_sleep):
        """
        A session/cookie hiccup on the first attempt can produce an empty
        result for a vehicle that genuinely has challans. The scraper must
        confirm with a fresh session before trusting "no challans".
        """
        get_mock = AsyncMock(side_effect=[
            self._json_response(body={"pageProps": {}}),  # first attempt: empty
            self._json_response(),  # confirmation attempt: real xdataprops
        ])
        with self._patch_transport(get_mock), \
             patch("scrapers.carinfo_scraper._get_build_id", new=AsyncMock(return_value="abc123")), \
             patch("scrapers.carinfo_scraper._decrypt", return_value=CARINFO_DECRYPTED):
            result = await CarInfoScraper().search_all_challans("DL01AB1234")

        assert len(result) == 2
        assert get_mock.await_count == 2

    @pytest.mark.asyncio
    async def test_empty_result_confirmed_still_empty_stays_empty(self, no_sleep):
        """If the fresh-session confirmation also comes back empty, trust it."""
        get_mock = AsyncMock(return_value=self._json_response(body={"pageProps": {}}))
        with self._patch_transport(get_mock), \
             patch("scrapers.carinfo_scraper._get_build_id", new=AsyncMock(return_value="abc123")):
            result = await CarInfoScraper().search_all_challans("DL01AB1234")

        assert result == []
        assert get_mock.await_count == 2

    @pytest.mark.asyncio
    async def test_normalises_vehicle_number(self, no_sleep):
        requested = []

        async def fake_get(url, **kwargs):
            requested.append(url)
            return self._json_response(body={"pageProps": {}})

        get_mock = AsyncMock(side_effect=fake_get)
        with self._patch_transport(get_mock), \
             patch("scrapers.carinfo_scraper._get_build_id", new=AsyncMock(return_value="abc123")):
            await CarInfoScraper().search_all_challans("dl 01-ab 1234")

        assert "DL01AB1234.json" in requested[0]


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
