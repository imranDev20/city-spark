/*
  Warnings:

  - You are about to drop the column `comment` on the `OrderTimeline` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `OrderTimeline` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `OrderTimeline` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `OrderTimeline` table. All the data in the column will be lost.
  - Added the required column `eventType` to the `OrderTimeline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `OrderTimeline` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderTimelineEventType" AS ENUM ('ORDER_PLACED', 'PAYMENT_RECEIVED', 'ORDER_PROCESSING', 'ORDER_SHIPPED', 'ORDER_DELIVERED', 'ORDER_CANCELLED', 'REFUND_INITIATED', 'REFUND_COMPLETED', 'NOTE_ADDED', 'STATUS_CHANGED');

-- AlterTable
ALTER TABLE "OrderTimeline" DROP COLUMN "comment",
DROP COLUMN "createdBy",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "eventType" "OrderTimelineEventType" NOT NULL,
ADD COLUMN     "message" TEXT NOT NULL;

-- DropEnum
DROP TYPE "OrderTimelineStatus";
