-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserLifecycleStatus" AS ENUM ('NEW_USER', 'ACTIVE', 'PAYMENT_PENDING', 'PAYMENT_FAILED', 'COMPLETED', 'CHURNED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "SearchStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'NO_DATA');

-- CreateEnum
CREATE TYPE "ChallanStatus" AS ENUM ('PAID', 'UNPAID', 'PARTIAL', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "SupportedRegion" AS ENUM ('DELHI', 'GURGAON', 'NOIDA', 'GHAZIABAD');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CHECKED_OUT', 'EXPIRED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('CREATED', 'PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'PAYMENT_FAILED', 'SETTLED', 'SETTLEMENT_FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "TrackingStatus" AS ENUM ('ORDER_CREATED', 'LAWYER_ASSIGNED', 'UNDER_REVIEW', 'IN_PROGRESS', 'SETTLED', 'REFLECTION_PENDING');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUBMITTED', 'SETTLED', 'FAILED', 'MANUAL_REVIEW');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lifecycleStatus" "UserLifecycleStatus" NOT NULL DEFAULT 'NEW_USER',
    "lastActiveAt" TIMESTAMP(3),
    "consentAccepted" BOOLEAN NOT NULL DEFAULT false,
    "consentAcceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "normalizedVehicleNumber" TEXT,
    "nickname" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challan_searches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "normalizedVehicleNumber" TEXT,
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "rawResponse" JSONB,
    "status" "SearchStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "apiProvider" TEXT NOT NULL DEFAULT 'invincibleocean',
    "apiCost" INTEGER NOT NULL DEFAULT 0,
    "cachedResponseUsed" BOOLEAN NOT NULL DEFAULT false,
    "supportableFound" INTEGER NOT NULL DEFAULT 0,
    "serviceable" BOOLEAN,
    "serviceableRegionsFound" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challan_searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challans" (
    "id" TEXT NOT NULL,
    "searchId" TEXT NOT NULL,
    "challanNo" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "rcNo" TEXT,
    "state" TEXT,
    "challanDate" TIMESTAMP(3),
    "location" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "ChallanStatus" NOT NULL,
    "receiptNo" TEXT,
    "challanSource" TEXT,
    "courtStatusDesc" TEXT,
    "courtName" TEXT,
    "normalizedVehicleNumber" TEXT,
    "city" TEXT,
    "authority" TEXT,
    "isSupported" BOOLEAN,
    "supportedRegion" "SupportedRegion",
    "unsupportedReason" TEXT,
    "matchedBy" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "rawData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challan_offences" (
    "id" TEXT NOT NULL,
    "challanId" TEXT NOT NULL,
    "offence" TEXT NOT NULL,
    "penalty" DOUBLE PRECISION,

    CONSTRAINT "challan_offences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "challanId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "grossAmount" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalAmount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "OrderStatus" NOT NULL DEFAULT 'CREATED',
    "trackingStatus" "TrackingStatus" NOT NULL DEFAULT 'ORDER_CREATED',
    "trackingHistory" JSONB,
    "pricingSnapshot" JSONB,
    "itemCount" INTEGER NOT NULL,
    "vehicleNumber" TEXT,
    "discountPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "platformFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "method" TEXT,
    "errorCode" TEXT,
    "errorDescription" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "gatewayName" TEXT NOT NULL DEFAULT 'razorpay',
    "failureReason" TEXT,
    "refundStatus" "RefundStatus",
    "refundedAmount" DOUBLE PRECISION,
    "refundedAt" TIMESTAMP(3),
    "gatewayRefundId" TEXT,
    "gatewayResponse" JSONB,
    "webhookPayload" JSONB,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlements" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "SettlementStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "governmentStatusLastCheckedAt" TIMESTAMP(3),
    "proofUrl" TEXT,
    "receiptUrl" TEXT,
    "assignedTo" TEXT,
    "settlementNotes" TEXT,
    "settledAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "externalRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settlements_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "consentAccepted" BOOLEAN NOT NULL,
    "consentTimestamp" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'homepage',
    "city" TEXT,
    "leadStatus" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_lifecycleStatus_idx" ON "users"("lifecycleStatus");

-- CreateIndex
CREATE INDEX "users_lastActiveAt_idx" ON "users"("lastActiveAt");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE INDEX "vehicles_vehicleNumber_idx" ON "vehicles"("vehicleNumber");

-- CreateIndex
CREATE INDEX "vehicles_normalizedVehicleNumber_idx" ON "vehicles"("normalizedVehicleNumber");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_userId_vehicleNumber_key" ON "vehicles"("userId", "vehicleNumber");

-- CreateIndex
CREATE INDEX "challan_searches_userId_idx" ON "challan_searches"("userId");

-- CreateIndex
CREATE INDEX "challan_searches_vehicleNumber_idx" ON "challan_searches"("vehicleNumber");

-- CreateIndex
CREATE INDEX "challan_searches_normalizedVehicleNumber_idx" ON "challan_searches"("normalizedVehicleNumber");

-- CreateIndex
CREATE INDEX "challan_searches_createdAt_idx" ON "challan_searches"("createdAt");

-- CreateIndex
CREATE INDEX "challans_vehicleNumber_idx" ON "challans"("vehicleNumber");

-- CreateIndex
CREATE INDEX "challans_challanNo_idx" ON "challans"("challanNo");

-- CreateIndex
CREATE INDEX "challans_isSupported_status_idx" ON "challans"("isSupported", "status");

-- CreateIndex
CREATE INDEX "challans_normalizedVehicleNumber_idx" ON "challans"("normalizedVehicleNumber");

-- CreateIndex
CREATE UNIQUE INDEX "challans_searchId_challanNo_key" ON "challans"("searchId", "challanNo");

-- CreateIndex
CREATE INDEX "carts_userId_status_idx" ON "carts"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_challanId_key" ON "cart_items"("cartId", "challanId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_cartId_key" ON "orders"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "order_items_orderId_challanId_key" ON "order_items"("orderId", "challanId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_orderId_key" ON "payments"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_razorpayOrderId_key" ON "payments"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "payments_razorpayOrderId_idx" ON "payments"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "payments_razorpayPaymentId_idx" ON "payments"("razorpayPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "settlements_orderId_key" ON "settlements"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "safe_driving_promises_orderId_key" ON "safe_driving_promises"("orderId");

-- CreateIndex
CREATE INDEX "safe_driving_promises_userId_idx" ON "safe_driving_promises"("userId");

-- CreateIndex
CREATE INDEX "leads_mobileNumber_idx" ON "leads"("mobileNumber");

-- CreateIndex
CREATE INDEX "leads_vehicleNumber_idx" ON "leads"("vehicleNumber");

-- CreateIndex
CREATE INDEX "leads_city_idx" ON "leads"("city");

-- CreateIndex
CREATE INDEX "leads_leadStatus_idx" ON "leads"("leadStatus");

-- CreateIndex
CREATE INDEX "leads_source_idx" ON "leads"("source");

-- CreateIndex
CREATE INDEX "leads_createdAt_idx" ON "leads"("createdAt");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challan_searches" ADD CONSTRAINT "challan_searches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challan_searches" ADD CONSTRAINT "challan_searches_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challans" ADD CONSTRAINT "challans_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "challan_searches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challan_offences" ADD CONSTRAINT "challan_offences_challanId_fkey" FOREIGN KEY ("challanId") REFERENCES "challans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_challanId_fkey" FOREIGN KEY ("challanId") REFERENCES "challans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_challanId_fkey" FOREIGN KEY ("challanId") REFERENCES "challans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safe_driving_promises" ADD CONSTRAINT "safe_driving_promises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safe_driving_promises" ADD CONSTRAINT "safe_driving_promises_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
