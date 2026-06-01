-- Add missing indexes for admin panel performance
-- Orders: createdAt and status+createdAt for dashboard "today" queries and date-range filters
CREATE INDEX IF NOT EXISTS "orders_createdAt_idx" ON "orders"("createdAt");
CREATE INDEX IF NOT EXISTS "orders_status_createdAt_idx" ON "orders"("status", "createdAt");

-- Payments: status and createdAt for "failed payments today" dashboard query
CREATE INDEX IF NOT EXISTS "payments_status_idx" ON "payments"("status");
CREATE INDEX IF NOT EXISTS "payments_createdAt_idx" ON "payments"("createdAt");

-- Settlements: status for pending/processing filter queries
CREATE INDEX IF NOT EXISTS "settlements_status_idx" ON "settlements"("status");
