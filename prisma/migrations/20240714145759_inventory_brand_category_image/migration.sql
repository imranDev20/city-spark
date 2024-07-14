/*
  Warnings:

  - A unique constraint covering the columns `[brandId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "brandId" TEXT,
ADD COLUMN     "categoryId" TEXT,
ALTER COLUMN "productId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "deliveryEligibility" BOOLEAN NOT NULL,
    "collectionEligibility" BOOLEAN NOT NULL,
    "maxDeliveryTime" INTEGER NOT NULL,
    "collectionAvailabilityTime" INTEGER NOT NULL,
    "deliveryAreas" TEXT[],
    "collectionPoints" TEXT[],
    "countAvailableForDelivery" INTEGER NOT NULL,
    "countAvailableForCollection" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_productId_key" ON "Inventory"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_brandId_key" ON "Image"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_categoryId_key" ON "Image"("categoryId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
