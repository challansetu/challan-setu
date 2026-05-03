# ChallanSetu — Vehicle Challan Discovery & Payment Platform

A production-ready full-stack web application for discovering and paying vehicle traffic challans online with platform-funded discounts.

## Tech Stack

| Layer        | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Next.js 14, TypeScript, Tailwind CSS |
| Backend     | NestJS, TypeScript                   |
| Database    | PostgreSQL + Prisma ORM              |
| Cache/Queue | Redis + Bull                         |
| Payments    | Razorpay                            |
| Auth        | OTP-based + JWT                     |
| Container   | Docker Compose                      |

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Next.js 14 │────▶│  NestJS API  │────▶│ PostgreSQL  │
│  Frontend   │     │   Backend    │     │  (Prisma)   │
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                    ┌──────┴───────┐
                    │    Redis     │
                    │ Cache/Queue  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Challan  │ │ Razorpay │ │   Bull   │
        │ Provider │ │ Payment  │ │  Queues  │
        └──────────┘ └──────────┘ └──────────┘
```

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Razorpay test account

### 1. Environment Setup

```bash
cp .env.example .env
# Fill in your Razorpay keys and challan provider credentials
```

### 2. Start Infrastructure

```bash
docker compose up -d postgres redis
```

### 3. Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run start:dev
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 5. Full Docker Setup

```bash
docker compose up --build
```

## Modules

| Module        | Description                                    |
|--------------|------------------------------------------------|
| auth         | OTP send/verify, JWT token management          |
| users        | User profile CRUD                              |
| vehicles     | Vehicle registration management                |
| challans     | Challan search, external provider integration  |
| pricing      | Discount rule engine, pricing calculation       |
| carts        | Cart management for challan selection          |
| orders       | Order creation with pricing snapshot           |
| payments     | Razorpay order creation, signature verification|
| settlements  | Queue-based settlement processing              |
| admin        | Dashboard stats, user/order/settlement management |
| notifications| SMS notifications (pluggable)                  |

## Database Schema

12 tables: `users`, `vehicles`, `challan_searches`, `challans`, `challan_offences`, `carts`, `cart_items`, `orders`, `payments`, `settlements`, `discount_rules`, `audit_logs`

## API Endpoints

### Auth
- `POST /api/auth/send-otp` — Send OTP
- `POST /api/auth/verify-otp` — Verify OTP & get JWT

### Users
- `GET /api/users/me` — Get profile
- `PUT /api/users/me` — Update profile

### Vehicles
- `GET /api/vehicles` — List user vehicles
- `POST /api/vehicles` — Add vehicle

### Challans
- `POST /api/challans/search` — Search challans (rate limited)
- `GET /api/challans/history` — Search history

### Cart
- `GET /api/cart` — Get cart with pricing
- `PUT /api/cart` — Update cart items
- `DELETE /api/cart` — Clear cart

### Orders
- `POST /api/orders` — Create order from cart
- `GET /api/orders` — List user orders
- `GET /api/orders/:id` — Get order details

### Payments
- `POST /api/payments/initiate` — Create Razorpay order
- `POST /api/payments/verify` — Verify payment signature
- `POST /api/payments/webhook` — Razorpay webhook handler

### Admin (ADMIN role required)
- `GET /api/admin/dashboard` — Dashboard stats
- `GET /api/admin/users` — List users
- `GET /api/admin/orders` — List all orders
- `GET /api/admin/settlements` — Pending settlements
- `PUT /api/admin/settlements/:id/settle` — Mark settled
- `GET /api/admin/audit-logs` — Audit logs
- `GET /api/admin/discount-rules` — List discount rules
- `POST /api/admin/discount-rules` — Create discount rule

## Business Rules

1. **External API secrets** are never exposed to the frontend
2. **Amount calculation** is always server-side; frontend values are never trusted
3. **Empty strings** are converted to `null` during normalization
4. **Challan status** is normalized to `PAID | UNPAID | PARTIAL | UNKNOWN`
5. **Paid challans** are visible but disabled for selection
6. **Settlement status** is maintained separately since the challan lookup API doesn't confirm official payment
7. **Discounts** are platform-funded promotional offers, not government concessions
8. **Rate limiting** is applied on challan search endpoints
9. **Payment verification** uses Razorpay signature verification server-side
10. **Webhooks** provide redundant payment status updates

## Frontend Pages

| Route              | Description                |
|-------------------|----------------------------|
| `/`               | Landing page with search   |
| `/login`          | OTP login/signup           |
| `/results`        | Challan list & selection   |
| `/checkout`       | Order review & payment     |
| `/payment-result` | Success/failure result     |
| `/dashboard`      | User dashboard             |
| `/admin`          | Admin panel                |

## Seed Data

The seed script creates:
- Admin user (phone: `9999999999`)
- Test user (phone: `8287650767`)
- Default discount rule: 30% off, capped at ₹500
- Sample vehicle: `UP16DZ3281`

## Swagger API Docs

Available at `http://localhost:4000/api/docs` when backend is running.

## License

MIT
