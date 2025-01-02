/*
  Warnings:

  - Made the column `collectionTotalWithVat` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveryTotalWithVat` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveryTotalWithoutVat` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subTotalWithVat` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subTotalWithoutVat` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalPriceWithVat` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalPriceWithoutVat` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vat` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `collectionTotalWithoutVat` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveryCharge` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `CartItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalPrice` on table `CartItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orderNumber` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cartId` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalPrice` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cartId_fkey";

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "collectionTotalWithVat" SET NOT NULL,
ALTER COLUMN "deliveryTotalWithVat" SET NOT NULL,
ALTER COLUMN "deliveryTotalWithoutVat" SET NOT NULL,
ALTER COLUMN "subTotalWithVat" SET NOT NULL,
ALTER COLUMN "subTotalWithoutVat" SET NOT NULL,
ALTER COLUMN "totalPriceWithVat" SET NOT NULL,
ALTER COLUMN "totalPriceWithoutVat" SET NOT NULL,
ALTER COLUMN "vat" SET NOT NULL,
ALTER COLUMN "collectionTotalWithoutVat" SET NOT NULL,
ALTER COLUMN "deliveryCharge" SET NOT NULL;

-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "totalPrice" SET NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "orderNumber" SET NOT NULL,
ALTER COLUMN "cartId" SET NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "totalPrice" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
