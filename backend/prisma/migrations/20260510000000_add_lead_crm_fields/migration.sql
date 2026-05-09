-- AddColumn crmStatus
ALTER TABLE "leads" ADD COLUMN "crmStatus" TEXT NOT NULL DEFAULT 'new';

-- AddColumn paymentStatus
ALTER TABLE "leads" ADD COLUMN "paymentStatus" TEXT NOT NULL DEFAULT 'pending';

-- AddColumn totalChallan
ALTER TABLE "leads" ADD COLUMN "totalChallan" INTEGER;

-- AddColumn paidAmount
ALTER TABLE "leads" ADD COLUMN "paidAmount" INTEGER;

-- AddColumn settledAmount
ALTER TABLE "leads" ADD COLUMN "settledAmount" INTEGER;

-- AddColumn discountGiven
ALTER TABLE "leads" ADD COLUMN "discountGiven" INTEGER;

-- CreateIndex
CREATE INDEX "leads_crmStatus_idx" ON "leads"("crmStatus");
