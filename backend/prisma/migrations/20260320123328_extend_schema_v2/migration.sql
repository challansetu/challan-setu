/*
  Warnings:

  - Added the required column `updatedAt` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SupportedRegion" AS ENUM ('DELHI', 'GURGAON', 'NOIDA');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "WebhookStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED', 'IGNORED');

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'REFUNDED';

-- AlterEnum
ALTER TYPE "SettlementStatus" ADD VALUE 'SUBMITTED';

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "challan_searches" ADD COLUMN     "apiCost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "apiProvider" TEXT NOT NULL DEFAULT 'invincibleocean',
ADD COLUMN     "cachedResponseUsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "normalizedVehicleNumber" TEXT,
ADD COLUMN     "serviceable" BOOLEAN,
ADD COLUMN     "serviceableRegionsFound" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "supportableFound" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "challans" ADD COLUMN     "authority" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "isSupported" BOOLEAN,
ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "matchedBy" TEXT,
ADD COLUMN     "normalizedVehicleNumber" TEXT,
ADD COLUMN     "supportedRegion" "SupportedRegion",
ADD COLUMN     "unsupportedReason" TEXT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "discountPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "platformFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "vehicleNumber" TEXT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "gatewayName" TEXT NOT NULL DEFAULT 'razorpay',
ADD COLUMN     "gatewayRefundId" TEXT,
ADD COLUMN     "gatewayResponse" JSONB,
ADD COLUMN     "refundStatus" "RefundStatus",
ADD COLUMN     "refundedAmount" DOUBLE PRECISION,
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ADD COLUMN     "webhookPayload" JSONB;

-- AlterTable
ALTER TABLE "settlements" ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "governmentStatusLastCheckedAt" TIMESTAMP(3),
ADD COLUMN     "proofUrl" TEXT,
ADD COLUMN     "receiptUrl" TEXT,
ADD COLUMN     "settlementNotes" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "consentAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consentAcceptedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "normalizedVehicleNumber" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();
ALTER TABLE "vehicles" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "challanId" TEXT NOT NULL,
    "challanNo" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safe_driving_promises" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "promiseVersion" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "safe_driving_promises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "WebhookStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challan_settlements" (
    "id" TEXT NOT NULL,
    "settlementId" TEXT NOT NULL,
    "challanId" TEXT NOT NULL,
    "challanNo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "govtReceiptNo" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challan_settlements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_items_orderId_challanId_key" ON "order_items"("orderId", "challanId");

-- CreateIndex
CREATE UNIQUE INDEX "safe_driving_promises_orderId_key" ON "safe_driving_promises"("orderId");

-- CreateIndex
CREATE INDEX "safe_driving_promises_userId_idx" ON "safe_driving_promises"("userId");

-- CreateIndex
CREATE INDEX "webhook_events_source_event_idx" ON "webhook_events"("source", "event");

-- CreateIndex
CREATE INDEX "webhook_events_status_idx" ON "webhook_events"("status");

-- CreateIndex
CREATE INDEX "webhook_events_createdAt_idx" ON "webhook_events"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "challan_settlements_settlementId_challanId_key" ON "challan_settlements"("settlementId", "challanId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "challan_searches_normalizedVehicleNumber_idx" ON "challan_searches"("normalizedVehicleNumber");

-- CreateIndex
CREATE INDEX "challan_searches_createdAt_idx" ON "challan_searches"("createdAt");

-- CreateIndex
CREATE INDEX "challans_isSupported_status_idx" ON "challans"("isSupported", "status");

-- CreateIndex
CREATE INDEX "challans_normalizedVehicleNumber_idx" ON "challans"("normalizedVehicleNumber");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "payments_razorpayPaymentId_idx" ON "payments"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "vehicles_normalizedVehicleNumber_idx" ON "vehicles"("normalizedVehicleNumber");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_challanId_fkey" FOREIGN KEY ("challanId") REFERENCES "challans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safe_driving_promises" ADD CONSTRAINT "safe_driving_promises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safe_driving_promises" ADD CONSTRAINT "safe_driving_promises_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challan_settlements" ADD CONSTRAINT "challan_settlements_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "settlements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challan_settlements" ADD CONSTRAINT "challan_settlements_challanId_fkey" FOREIGN KEY ("challanId") REFERENCES "challans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
