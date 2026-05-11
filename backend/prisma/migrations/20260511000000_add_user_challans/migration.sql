-- CreateTable
CREATE TABLE "user_challans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "challanNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "settledAmount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_challans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_challans_userId_idx" ON "user_challans"("userId");

-- AddForeignKey
ALTER TABLE "user_challans" ADD CONSTRAINT "user_challans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
