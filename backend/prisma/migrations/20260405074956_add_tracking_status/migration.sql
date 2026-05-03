-- CreateEnum
CREATE TYPE "TrackingStatus" AS ENUM ('ORDER_CREATED', 'LAWYER_ASSIGNED', 'UNDER_REVIEW', 'IN_PROGRESS', 'SETTLED', 'REFLECTION_PENDING');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "trackingHistory" JSONB,
ADD COLUMN     "trackingStatus" "TrackingStatus" NOT NULL DEFAULT 'ORDER_CREATED';
