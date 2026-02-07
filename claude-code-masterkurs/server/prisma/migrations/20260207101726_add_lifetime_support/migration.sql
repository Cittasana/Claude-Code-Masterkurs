-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "is_lifetime" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lifetime_purchased_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "subscriptions_is_lifetime_idx" ON "subscriptions"("is_lifetime");
