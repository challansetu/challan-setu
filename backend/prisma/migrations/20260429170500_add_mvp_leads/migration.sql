CREATE TABLE "leads" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "mobileNumber" TEXT NOT NULL,
  "vehicleNumber" TEXT NOT NULL,
  "consentAccepted" BOOLEAN NOT NULL,
  "consentTimestamp" TIMESTAMP(3) NOT NULL,
  "source" TEXT NOT NULL DEFAULT 'homepage',
  "leadStatus" TEXT NOT NULL DEFAULT 'new',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "leads_mobileNumber_idx" ON "leads"("mobileNumber");
CREATE INDEX "leads_vehicleNumber_idx" ON "leads"("vehicleNumber");
CREATE INDEX "leads_leadStatus_idx" ON "leads"("leadStatus");
CREATE INDEX "leads_source_idx" ON "leads"("source");
CREATE INDEX "leads_createdAt_idx" ON "leads"("createdAt");
