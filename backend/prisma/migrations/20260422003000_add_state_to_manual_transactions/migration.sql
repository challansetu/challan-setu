ALTER TABLE "manual_transactions"
ADD COLUMN "state" TEXT;

CREATE INDEX "manual_transactions_state_idx"
ON "manual_transactions"("state");
