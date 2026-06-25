# Payments (/payments) — Razorpay Setup

A public **"pay any amount"** page at `/payments`. The user enters an amount + their
name/phone (email & note optional), pays via Razorpay Checkout (UPI, cards, net
banking, wallets), and the backend verifies the payment and records it.

## How it works (full secure flow)

1. **Frontend** (`/payments`) collects amount + details → calls `POST /api/payments/order`.
2. **Backend** creates a Razorpay **order** (using the secret key), saves a `payments`
   row with status `CREATED`, and returns the order to the browser.
3. **Razorpay Checkout** opens; the user pays.
4. On success Razorpay returns a signature → frontend calls `POST /api/payments/verify`.
5. **Backend** verifies the HMAC signature and marks the payment `PAID`.
6. A **webhook** (`POST /api/payments/webhook`) independently confirms the payment
   server-to-server, so it's recorded even if the user closes the tab.

Until valid keys are added, the page loads but starting a payment returns a friendly
"Payment gateway is not configured" message — nothing breaks.

## What you need to do

### 1. Create a Razorpay account
- Sign up at https://razorpay.com → complete KYC to accept live payments.
- You can build/test immediately in **Test Mode** without KYC.

### 2. Get your API keys
- Razorpay Dashboard → **Settings → API Keys → Generate Key**.
- You get a **Key ID** (starts with `rzp_test_` or `rzp_live_`) and a **Key Secret**
  (shown once — copy it).

### 3. Set up the webhook (recommended)
- Dashboard → **Settings → Webhooks → Add New Webhook**.
- Webhook URL: `https://<your-backend-domain>/api/payments/webhook`
- Secret: choose any strong string — put the **same** value in `RAZORPAY_WEBHOOK_SECRET`.
- Active events: `payment.captured`, `payment.failed`, `order.paid`.

### 4. Add the keys to your environment

**Backend** (`backend/.env` or root `.env`):
```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=<your key secret>
RAZORPAY_WEBHOOK_SECRET=<the webhook secret you chose>
```

**Frontend** (`frontend/.env` — must be the **same Key ID**, the public one):
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
NEXT_PUBLIC_API_URL=https://<your-backend-domain>
```
> Note: the frontend reads the Key ID from the backend's `/order` response, so the
> `NEXT_PUBLIC_RAZORPAY_KEY_ID` is only a convenience/fallback. The **secret** must
> never be exposed to the frontend.

Add the webhook events too (so failures/refunds/late authorizations are captured even if the user closes the tab):
`payment.authorized`, `payment.captured`, `payment.failed`, `order.paid`, `refund.processed`, `refund.failed`.

### 5. Run the database migration
Two migrations add the `payments` and `webhook_events` tables.

> ⚠️ `backend/.env` is empty — DB credentials live in the **root** `.env`, which the
> Prisma CLI does not auto-load. Source it first:
```bash
cd backend && set -a && . ../.env && set +a && npx prisma migrate deploy
```
On **production**, Railway already runs `npx prisma migrate deploy` automatically on
deploy (`backend/railway.json` → `preDeployCommand`), so no manual step is needed there.

### 6. Test it
- With **test keys**, open `/payments`, enter an amount, and use Razorpay's
  [test cards](https://razorpay.com/docs/payments/payments/test-card-details/)
  (e.g. card `4111 1111 1111 1111`, any future expiry, any CVV) or test UPI `success@razorpay`.
- Confirm a `payments` row appears with status `PAID`.

### 7. Go live
- Complete KYC, switch the dashboard to **Live Mode**, generate **live** keys
  (`rzp_live_...`), and replace the env values. Re-point the webhook to live.

## Failure & edge-case handling

The flow is hardened for the cases that matter to a "pay any amount" page:

| Status | Meaning |
|--------|---------|
| `CREATED` | Order made, awaiting payment (pending) |
| `AUTHORIZED` | Authorized but not yet captured (transient under auto-capture) |
| `PAID` | Captured / order paid — **final success** |
| `FAILED` | Payment failed — final failure |
| `VERIFICATION_FAILED` | Checkout signature mismatch — never marked paid; logged for review |
| `FLAGGED` | Amount / currency / order mismatch — held for **manual review** |

- **Signature first, then API confirm:** the checkout callback signature is verified,
  then the payment is fetched from the Razorpay API and only marked `PAID` if it is
  actually `captured` **and** amount/currency/order match.
- **Webhook is the source of truth:** `payment.captured` / `order.paid` mark `PAID`
  even if the user closed the tab. Webhooks are **idempotent** (deduped by
  `x-razorpay-event-id`, stored in `webhook_events`), and state transitions are guarded
  so a successful payment is **never** downgraded to failed (handles out-of-order/duplicate webhooks).
- **Reconciliation cron** (every 5 min) re-queries Razorpay for any `CREATED`/`AUTHORIZED`
  payment older than 2 minutes — recovers lost callbacks, "backend died after success",
  and late authorizations.
- **Frontend UX:** "Confirming payment…" → confirmed only after the backend says so;
  cancel = not a failure (order stays pending); failed shows a retry + "auto-refunded
  per bank timeline" message; unresolved shows a pending screen with the Order ID and
  a support prompt, while polling `GET /api/payments/status/:orderId`.
- **Refunds** are issued manually via the Razorpay dashboard; `refund.processed` /
  `refund.failed` webhooks update the payment record (`refundStatus`/`refundId`/`refundedAmount`).

### Intentionally NOT built (over-engineering for a no-fulfillment page)
Manual/late capture pipeline, business-order idempotency & dedupe, retry-with-dedupe,
and a full refund-initiation lifecycle — there is no cart/order/fulfillment here, and
Razorpay auto-captures. Revisit these only if `/payments` becomes a real order checkout.

## Notes
- The page is `noindex` (transactional — not meant to rank). Share the link directly
  or in WhatsApp.
- Amount limits: ₹1 – ₹5,00,000 (configurable in `create-order.dto.ts`).
- This is a standalone `payments` table — it does **not** restore the old
  orders/carts/settlements layer that was removed on 2026-06-13.
