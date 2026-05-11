-- CreateTable
CREATE TABLE "lead_challans" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "challanNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "settledAmount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_challans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lead_challans_leadId_idx" ON "lead_challans"("leadId");

-- AddForeignKey
ALTER TABLE "lead_challans" ADD CONSTRAINT "lead_challans_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
