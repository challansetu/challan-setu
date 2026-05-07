"""Format challan data into Telegram messages."""
from __future__ import annotations


def format_challans(vehicle: str, challans: list) -> str:
    unpaid = [c for c in challans if (c.get("status") or "").upper() != "PAID"]
    total_amount = sum(int(c.get("amountChallan") or 0) for c in challans)
    unpaid_amount = sum(int(c.get("amountChallan") or 0) for c in unpaid)

    lines = [
        f"🚗 *Challan Report: `{vehicle}`*\n",
        f"📊 {len(challans)} challan(s) | Total: ₹{total_amount:,}",
        f"❌ Unpaid: {len(unpaid)} | ₹{unpaid_amount:,}\n",
    ]

    for i, c in enumerate(challans, 1):
        status = (c.get("status") or "Unknown").capitalize()
        icon = "✅" if status.upper() == "PAID" else "❌"
        amount = int(c.get("amountChallan") or 0)
        date_raw = c.get("dateChallan") or "—"
        date = date_raw.split(" ")[0] if " " in date_raw else date_raw

        violations = c.get("detailsViolation") or []
        offense = next(
            (v.get("offence") for v in violations if v.get("offence")),
            "—"
        )

        lines.append(f"\n*{i}.* {icon} ₹{amount:,} — {status}")
        lines.append(f"   📋 {offense}")
        lines.append(f"   📅 {date}")

    return "\n".join(lines)


def format_no_challans(vehicle: str) -> str:
    return f"✅ No pending challans found for `{vehicle}`"
