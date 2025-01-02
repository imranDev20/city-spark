-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cartId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "cartId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
