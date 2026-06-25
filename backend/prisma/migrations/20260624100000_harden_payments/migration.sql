-- Harden payments: extra statuses, mismatch/refund/sync fields, and a
-- webhook_events table for idempotency + raw-payload audit.

-- AlterEnum: new PaymentStatus values (not used within this migration, so safe)
ALTER TYPE "PaymentStatus" ADD VALUE 'AUTHORIZED';
ALTER TYPE "PaymentStatus" ADD VALUE 'VERIFICATION_FAILED';
ALTER TYPE "PaymentStatus" ADD VALUE 'FLAGGED';

-- AlterTable
ALTER TABLE "payments"
    ADD COLUMN "flagReason" TEXT,
    ADD COLUMN "lastSyncedAt" TIMESTAMP(3),
    ADD COLUMN "refundStatus" TEXT,
    ADD COLUMN "refundId" TEXT,
    ADD COLUMN "refundedAmount" INTEGER;

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_eventId_key" ON "webhook_events"("eventId");

-- CreateIndex
CREATE INDEX "webhook_events_eventType_idx" ON "webhook_events"("eventType");
