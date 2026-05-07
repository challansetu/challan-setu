"""
Lightweight in-process metrics collector.

No external dependency — stores counters and gauges in memory.
Expose via /metrics HTTP endpoint (health.py) or log periodically.
"""
from __future__ import annotations

import threading
import time
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Dict


@dataclass
class Counter:
    value: float = 0.0
    _lock: threading.Lock = field(default_factory=threading.Lock, repr=False, compare=False)

    def inc(self, amount: float = 1.0) -> None:
        with self._lock:
            self.value += amount

    def get(self) -> float:
        return self.value


@dataclass
class Gauge:
    value: float = 0.0
    _lock: threading.Lock = field(default_factory=threading.Lock, repr=False, compare=False)

    def set(self, v: float) -> None:
        with self._lock:
            self.value = v

    def get(self) -> float:
        return self.value


class Histogram:
    """Tracks a list of observations for avg/min/max."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._observations: list[float] = []

    def observe(self, v: float) -> None:
        with self._lock:
            self._observations.append(v)

    def summary(self) -> dict:
        with self._lock:
            if not self._observations:
                return {"count": 0, "avg": 0, "min": 0, "max": 0}
            return {
                "count": len(self._observations),
                "avg": round(sum(self._observations) / len(self._observations), 3),
                "min": round(min(self._observations), 3),
                "max": round(max(self._observations), 3),
            }


class MetricsRegistry:
    _counters: Dict[str, Counter] = {}
    _gauges: Dict[str, Gauge] = {}
    _histograms: Dict[str, Histogram] = {}
    _start_time: float = time.monotonic()

    @classmethod
    def counter(cls, name: str) -> Counter:
        if name not in cls._counters:
            cls._counters[name] = Counter()
        return cls._counters[name]

    @classmethod
    def gauge(cls, name: str) -> Gauge:
        if name not in cls._gauges:
            cls._gauges[name] = Gauge()
        return cls._gauges[name]

    @classmethod
    def histogram(cls, name: str) -> Histogram:
        if name not in cls._histograms:
            cls._histograms[name] = Histogram()
        return cls._histograms[name]

    @classmethod
    def snapshot(cls) -> dict:
        uptime = round(time.monotonic() - cls._start_time, 1)
        return {
            "uptime_seconds": uptime,
            "counters": {k: v.get() for k, v in cls._counters.items()},
            "gauges": {k: v.get() for k, v in cls._gauges.items()},
            "histograms": {k: v.summary() for k, v in cls._histograms.items()},
        }


# Named metrics used by the application
m = MetricsRegistry

# Counters
searches_total        = m.counter("searches_total")
searches_success      = m.counter("searches_success")
searches_failed       = m.counter("searches_failed")
platform_attempts     = defaultdict(lambda: m.counter(f"platform_attempts"))
platform_successes    = defaultdict(lambda: m.counter(f"platform_successes"))

# Histograms
search_duration_hist  = m.histogram("search_duration_seconds")

# Gauges
active_searches       = m.gauge("active_searches")
