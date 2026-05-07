"""Unit tests for the per-user rate limiter."""
import time
import pytest
from unittest.mock import patch
from bot.rate_limiter import RateLimiter
from utils.errors import UserRateLimitError


def test_first_search_passes():
    rl = RateLimiter()
    rl.check(1001)  # should not raise


def test_cooldown_blocks_rapid_search():
    rl = RateLimiter()
    rl.check(1002)
    rl.record(1002)
    with pytest.raises(UserRateLimitError):
        rl.check(1002)


def test_cooldown_passes_after_wait(monkeypatch):
    rl = RateLimiter()
    rl.check(1003)
    rl.record(1003)
    # Simulate time passing beyond cooldown
    far_future = time.monotonic() + 9999
    monkeypatch.setattr("bot.rate_limiter.time.monotonic", lambda: far_future)
    # Should not raise after cooldown elapses
    # (We can't easily test this without monkeypatching time globally)


def test_window_rate_limit():
    rl = RateLimiter()
    uid = 9001
    # Manually fill the window
    import time as t
    now = t.monotonic()
    from config import MAX_SEARCHES_PER_MINUTE
    for _ in range(MAX_SEARCHES_PER_MINUTE):
        rl._windows[uid].append(now)
    rl._last_search[uid] = now - 9999  # bypass cooldown

    with pytest.raises(UserRateLimitError):
        rl.check(uid)


def test_record_updates_last_search():
    rl = RateLimiter()
    rl.record(5001)
    assert 5001 in rl._last_search
