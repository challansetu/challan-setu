"""Per-user rate limiting using a token-bucket approach."""
from __future__ import annotations

import time
from collections import defaultdict, deque
from config import MAX_SEARCHES_PER_MINUTE, SEARCH_COOLDOWN
from utils.errors import UserRateLimitError


class RateLimiter:
    """
    Allows MAX_SEARCHES_PER_MINUTE searches per 60-second window per user.
    Also enforces a minimum SEARCH_COOLDOWN between consecutive searches.
    """

    def __init__(self) -> None:
        # user_id → deque of request timestamps (float)
        self._windows: dict[int, deque] = defaultdict(deque)
        self._last_search: dict[int, float] = {}

    def check(self, user_id: int) -> None:
        """Raise UserRateLimitError if the user is rate-limited."""
        now = time.monotonic()

        # Cooldown check — only applies if user has searched before
        last = self._last_search.get(user_id)
        if last is not None and now - last < SEARCH_COOLDOWN:
            remaining = int(SEARCH_COOLDOWN - (now - last)) + 1
            raise UserRateLimitError(
                f"Please wait {remaining}s before searching again."
            )

        # Window check
        window = self._windows[user_id]
        cutoff = now - 60.0
        while window and window[0] < cutoff:
            window.popleft()

        if len(window) >= MAX_SEARCHES_PER_MINUTE:
            oldest = window[0]
            wait = int(60 - (now - oldest)) + 1
            raise UserRateLimitError(
                f"Rate limit reached. Please wait {wait}s."
            )

    def record(self, user_id: int) -> None:
        """Record a search attempt after passing check()."""
        now = time.monotonic()
        self._windows[user_id].append(now)
        self._last_search[user_id] = now
