"""
Minimal HTTP health-check server.

Runs in a background thread alongside the Telegram bot.
Endpoints:
    GET /health  → {"status": "ok", "uptime": 123}
    GET /metrics → full metrics snapshot
    GET /ready   → 200 if bot is ready, 503 otherwise
"""
from __future__ import annotations

import json
import logging
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from typing import Callable

from config import HEALTH_CHECK_PORT
from monitoring.metrics import MetricsRegistry

log = logging.getLogger("monitoring.health")

_ready: bool = False


def set_ready(state: bool) -> None:
    global _ready
    _ready = state


class _Handler(BaseHTTPRequestHandler):
    def log_message(self, *_) -> None:
        pass  # suppress access logs

    def _send_json(self, code: int, body: dict) -> None:
        payload = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self) -> None:
        if self.path == "/health":
            snap = MetricsRegistry.snapshot()
            self._send_json(200, {"status": "ok", "uptime": snap["uptime_seconds"]})
        elif self.path == "/metrics":
            self._send_json(200, MetricsRegistry.snapshot())
        elif self.path == "/ready":
            if _ready:
                self._send_json(200, {"ready": True})
            else:
                self._send_json(503, {"ready": False})
        else:
            self._send_json(404, {"error": "not found"})


def start_health_server() -> None:
    try:
        server = HTTPServer(("0.0.0.0", HEALTH_CHECK_PORT), _Handler)
    except OSError as exc:
        log.warning("Health server could not bind to port %d: %s", HEALTH_CHECK_PORT, exc)
        return
    t = threading.Thread(target=server.serve_forever, daemon=True, name="health-server")
    t.start()
    log.info("Health server running on port %d", HEALTH_CHECK_PORT)
