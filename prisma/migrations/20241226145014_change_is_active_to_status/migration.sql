/*
  Warnings:

  - You are about to drop the column `isActive` on the `PromoCode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PromoCode" DROP COLUMN "isActive",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT';
