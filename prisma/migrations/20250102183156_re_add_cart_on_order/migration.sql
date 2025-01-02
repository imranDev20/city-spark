/*
  Warnings:

  - A unique constraint covering the columns `[cartId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Made the column `status` on table `Cart` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cartId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_cartId_key" ON "Order"("cartId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
