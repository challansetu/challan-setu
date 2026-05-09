-- AddColumn crmStatus
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "crmStatus" TEXT NOT NULL DEFAULT 'new';

-- AddColumn paymentStatus
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "paymentStatus" TEXT NOT NULL DEFAULT 'pending';

-- AddColumn challanSettled
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "challanSettled" TEXT NOT NULL DEFAULT 'no';

-- AddColumn totalChallan
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "totalChallan" INTEGER;

-- AddColumn paidAmount
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "paidAmount" INTEGER;

-- AddColumn settledAmount
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "settledAmount" INTEGER;

-- AddColumn discountGiven
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "discountGiven" INTEGER;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "leads_crmStatus_idx" ON "leads"("crmStatus");
