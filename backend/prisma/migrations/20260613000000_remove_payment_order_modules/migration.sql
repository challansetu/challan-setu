-- Remove payment / order / cart / settlement / safe-driving-promise feature.
-- Drops the transactional layer that is no longer used (business runs on lead capture).

-- DropTable (dependents first to respect FKs)
DROP TABLE IF EXISTS "settlements" CASCADE;
DROP TABLE IF EXISTS "payments" CASCADE;
DROP TABLE IF EXISTS "safe_driving_promises" CASCADE;
DROP TABLE IF EXISTS "order_items" CASCADE;
DROP TABLE IF EXISTS "cart_items" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "carts" CASCADE;

-- DropEnum
DROP TYPE IF EXISTS "SettlementStatus";
DROP TYPE IF EXISTS "RefundStatus";
DROP TYPE IF EXISTS "PaymentStatus";
DROP TYPE IF EXISTS "TrackingStatus";
DROP TYPE IF EXISTS "OrderStatus";
DROP TYPE IF EXISTS "CartStatus";
