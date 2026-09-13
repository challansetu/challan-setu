-- CreateIndex
CREATE INDEX "leads_mobileNumber_vehicleNumber_createdAt_idx" ON "leads"("mobileNumber", "vehicleNumber", "createdAt");
