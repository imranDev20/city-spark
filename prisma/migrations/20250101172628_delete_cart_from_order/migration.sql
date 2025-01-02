/*
  Warnings:

  - You are about to drop the column `cartId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cartId_fkey";

-- DropIndex
DROP INDEX "Order_cartId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "cartId";
