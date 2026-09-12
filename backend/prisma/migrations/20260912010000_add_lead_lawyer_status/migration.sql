-- AlterTable
ALTER TABLE "leads" ADD COLUMN "lawyerStatus" TEXT NOT NULL DEFAULT 'not_connected';

-- CreateIndex
CREATE INDEX "leads_lawyerStatus_idx" ON "leads"("lawyerStatus");
