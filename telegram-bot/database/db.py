"""
SQLite database layer for the challan bot.

All operations are synchronous (SQLite is fast enough for a single-instance
Telegram bot). Wrap in asyncio.to_thread() in async contexts.
"""
from __future__ import annotations

import json
import logging
import os
import shutil
import sqlite3
import threading
from contextlib import contextmanager
from datetime import datetime, timedelta
from typing import Optional

from config import DATABASE_PATH, DATABASE_BACKUP_PATH, SEARCH_RETENTION_DAYS

log = logging.getLogger("database")

_SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    user_id       INTEGER PRIMARY KEY,
    first_name    TEXT,
    username      TEXT,
    total_searches INTEGER DEFAULT 0,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    last_search_at TEXT
);

CREATE TABLE IF NOT EXISTS searches (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id            INTEGER NOT NULL,
    vehicle_number     TEXT NOT NULL,
    status             TEXT NOT NULL,          -- 'success' | 'failure'
    result_data        TEXT,                   -- JSON
    successful_platform TEXT,
    search_duration    REAL,
    error_message      TEXT,
    created_at         TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS platform_stats (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    platform_name        TEXT UNIQUE NOT NULL,
    total_searches       INTEGER DEFAULT 0,
    successful_searches  INTEGER DEFAULT 0,
    failed_searches      INTEGER DEFAULT 0,
    total_response_time  REAL DEFAULT 0.0,
    last_updated         TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_searches_user_id ON searches(user_id);
CREATE INDEX IF NOT EXISTS idx_searches_vehicle  ON searches(vehicle_number);
CREATE INDEX IF NOT EXISTS idx_searches_created  ON searches(created_at);
"""

_PLATFORM_NAMES = ["CarInfo", "Cars24", "ParkPlus", "Spinny"]


class Database:
    """Thread-safe SQLite database wrapper."""

    _local = threading.local()

    def __init__(self, db_path: str = DATABASE_PATH) -> None:
        self.db_path = db_path
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        self._init_schema()
        self._seed_platform_stats()

    # ── Connection management ─────────────────────────────────────────────────

    def _conn(self) -> sqlite3.Connection:
        """Return a per-thread connection."""
        if not getattr(self._local, "conn", None):
            conn = sqlite3.connect(self.db_path, check_same_thread=False)
            conn.row_factory = sqlite3.Row
            conn.execute("PRAGMA journal_mode=WAL")
            conn.execute("PRAGMA foreign_keys=ON")
            self._local.conn = conn
        return self._local.conn

    @contextmanager
    def _transaction(self):
        conn = self._conn()
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise

    # ── Schema ────────────────────────────────────────────────────────────────

    def _init_schema(self) -> None:
        with self._transaction() as conn:
            conn.executescript(_SCHEMA)
        log.debug("Schema initialised at %s", self.db_path)

    def _seed_platform_stats(self) -> None:
        with self._transaction() as conn:
            for name in _PLATFORM_NAMES:
                conn.execute(
                    "INSERT OR IGNORE INTO platform_stats (platform_name) VALUES (?)", (name,)
                )

    # ── User operations ───────────────────────────────────────────────────────

    def upsert_user(
        self, user_id: int, first_name: str = "", username: str = ""
    ) -> None:
        with self._transaction() as conn:
            conn.execute(
                """
                INSERT INTO users (user_id, first_name, username)
                VALUES (?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    first_name = excluded.first_name,
                    username   = excluded.username
                """,
                (user_id, first_name, username),
            )

    def get_user(self, user_id: int) -> Optional[dict]:
        row = self._conn().execute(
            "SELECT * FROM users WHERE user_id = ?", (user_id,)
        ).fetchone()
        return dict(row) if row else None

    # ── Search operations ─────────────────────────────────────────────────────

    def save_search(
        self,
        user_id: int,
        vehicle_number: str,
        status: str,                     # 'success' | 'failure'
        result_data: Optional[dict],
        successful_platform: Optional[str],
        search_duration: float,
        error_message: Optional[str] = None,
    ) -> int:
        result_json = json.dumps(result_data) if result_data else None
        with self._transaction() as conn:
            cur = conn.execute(
                """
                INSERT INTO searches
                    (user_id, vehicle_number, status, result_data,
                     successful_platform, search_duration, error_message)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    user_id, vehicle_number, status, result_json,
                    successful_platform, search_duration, error_message,
                ),
            )
            conn.execute(
                """
                UPDATE users SET
                    total_searches = total_searches + 1,
                    last_search_at = datetime('now')
                WHERE user_id = ?
                """,
                (user_id,),
            )
        log.debug("Saved search %d for user %d", cur.lastrowid, user_id)
        return cur.lastrowid

    def get_user_history(self, user_id: int, limit: int = 5) -> list[dict]:
        rows = self._conn().execute(
            """
            SELECT id, vehicle_number, status, successful_platform,
                   search_duration, created_at, error_message
            FROM searches
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
            """,
            (user_id, limit),
        ).fetchall()
        return [dict(r) for r in rows]

    def get_search_by_id(self, search_id: int) -> Optional[dict]:
        row = self._conn().execute(
            "SELECT * FROM searches WHERE id = ?", (search_id,)
        ).fetchone()
        if not row:
            return None
        d = dict(row)
        if d.get("result_data"):
            try:
                d["result_data"] = json.loads(d["result_data"])
            except json.JSONDecodeError:
                pass
        return d

    # ── Platform stats ────────────────────────────────────────────────────────

    def update_platform_stats(
        self, platform_name: str, success: bool, response_time: float
    ) -> None:
        col = "successful_searches" if success else "failed_searches"
        with self._transaction() as conn:
            conn.execute(
                f"""
                UPDATE platform_stats SET
                    total_searches      = total_searches + 1,
                    {col}              = {col} + 1,
                    total_response_time = total_response_time + ?,
                    last_updated        = datetime('now')
                WHERE platform_name = ?
                """,
                (response_time, platform_name),
            )

    def get_platform_stats(self) -> list[dict]:
        rows = self._conn().execute(
            """
            SELECT
                platform_name,
                total_searches,
                successful_searches,
                failed_searches,
                CASE WHEN total_searches > 0
                     THEN ROUND(total_response_time / total_searches, 2)
                     ELSE 0 END AS average_response_time,
                CASE WHEN total_searches > 0
                     THEN ROUND(100.0 * successful_searches / total_searches, 1)
                     ELSE 0 END AS success_rate,
                last_updated
            FROM platform_stats
            ORDER BY success_rate DESC
            """
        ).fetchall()
        return [dict(r) for r in rows]

    # ── Maintenance ───────────────────────────────────────────────────────────

    def delete_old_searches(self, days: int = SEARCH_RETENTION_DAYS) -> int:
        cutoff = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d %H:%M:%S")
        with self._transaction() as conn:
            cur = conn.execute(
                "DELETE FROM searches WHERE created_at < ?", (cutoff,)
            )
        log.info("Deleted %d searches older than %d days", cur.rowcount, days)
        return cur.rowcount

    def backup(self) -> str:
        """Copy the database file to the backup directory. Returns backup path."""
        os.makedirs(DATABASE_BACKUP_PATH, exist_ok=True)
        stamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        dest = os.path.join(DATABASE_BACKUP_PATH, f"challan_bot_{stamp}.db")
        shutil.copy2(self.db_path, dest)
        log.info("Database backed up to %s", dest)
        return dest

    def get_global_stats(self) -> dict:
        conn = self._conn()
        total = conn.execute("SELECT COUNT(*) FROM searches").fetchone()[0]
        success = conn.execute(
            "SELECT COUNT(*) FROM searches WHERE status = 'success'"
        ).fetchone()[0]
        users = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
        today = conn.execute(
            "SELECT COUNT(*) FROM searches WHERE date(created_at) = date('now')"
        ).fetchone()[0]
        return {
            "total_searches": total,
            "successful_searches": success,
            "failed_searches": total - success,
            "success_rate": round(100 * success / total, 1) if total else 0,
            "total_users": users,
            "searches_today": today,
        }
