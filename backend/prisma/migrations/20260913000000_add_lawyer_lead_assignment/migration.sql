-- AlterTable
ALTER TABLE "leads" ADD COLUMN "assignedLawyerId" TEXT;

-- CreateIndex
CREATE INDEX "leads_assignedLawyerId_idx" ON "leads"("assignedLawyerId");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_assignedLawyerId_fkey" FOREIGN KEY ("assignedLawyerId") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "lawyer_assignment_state" (
    "id" TEXT NOT NULL,
    "vehiclePrefix" TEXT NOT NULL,
    "lastAssignedLawyerId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lawyer_assignment_state_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lawyer_assignment_state_vehiclePrefix_key" ON "lawyer_assignment_state"("vehiclePrefix");
