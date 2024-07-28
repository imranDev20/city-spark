/*
  Warnings:

  - You are about to drop the column `brandId` on the `Image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_brandId_fkey";

-- DropIndex
DROP INDEX "Image_brandId_key";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "brandId";
