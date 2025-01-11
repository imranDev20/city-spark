-- CreateEnum
CREATE TYPE "OrderTimelineStatus" AS ENUM ('ORDER_PLACED', 'PAYMENT_PENDING', 'PAYMENT_RECEIVED', 'PROCESSING', 'READY_FOR_SHIPPING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'READY_FOR_COLLECTION', 'COLLECTED', 'CANCELLED', 'REFUND_REQUESTED', 'REFUND_PROCESSED', 'RETURN_INITIATED', 'RETURN_RECEIVED');

-- CreateTable
CREATE TABLE "OrderTimeline" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "OrderTimelineStatus" NOT NULL,
    "comment" TEXT,
    "metadata" JSONB,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderTimeline_orderId_idx" ON "OrderTimeline"("orderId");

-- AddForeignKey
ALTER TABLE "OrderTimeline" ADD CONSTRAINT "OrderTimeline_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
