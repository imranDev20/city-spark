/*
  Warnings:

  - You are about to drop the column `primaryId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `tertiaryId` on the `Category` table. All the data in the column will be lost.
  - The primary key for the `Feature` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Feature` table. All the data in the column will be lost.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - Added the required column `type` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('PRIMARY', 'SECONDARY', 'TERTIARY', 'QUATERNARY');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_productId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "primaryId",
DROP COLUMN "secondaryId",
DROP COLUMN "tertiaryId",
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "type" "CategoryType" NOT NULL;

-- AlterTable
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_pkey",
DROP COLUMN "description",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Feature_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Feature_id_seq";

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "price",
ADD COLUMN     "brandId" TEXT,
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "contractPrice" DOUBLE PRECISION,
ADD COLUMN     "guarantee" TEXT,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "length" DOUBLE PRECISION,
ADD COLUMN     "manuals" TEXT[],
ADD COLUMN     "material" TEXT,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "primaryCategoryId" TEXT,
ADD COLUMN     "promotionalPrice" DOUBLE PRECISION,
ADD COLUMN     "quaternaryCategoryId" TEXT,
ADD COLUMN     "secondaryCategoryId" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "template" TEXT,
ADD COLUMN     "tertiaryCategoryId" TEXT,
ADD COLUMN     "tradePrice" DOUBLE PRECISION,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "unit" TEXT,
ADD COLUMN     "warranty" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION,
ADD COLUMN     "width" DOUBLE PRECISION,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Product_id_seq";

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
