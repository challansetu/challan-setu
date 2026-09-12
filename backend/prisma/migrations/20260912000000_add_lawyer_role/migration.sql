-- AlterEnum
ALTER TYPE "AdminRole" ADD VALUE 'LAWYER';

-- AlterTable
ALTER TABLE "admin_users" ADD COLUMN "vehiclePrefixes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
