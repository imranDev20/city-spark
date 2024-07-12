/*
  Warnings:

  - You are about to drop the column `primaryCategoryId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `quaternaryCategoryId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryCategoryId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `tertiaryCategoryId` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "primaryCategoryId",
DROP COLUMN "quaternaryCategoryId",
DROP COLUMN "secondaryCategoryId",
DROP COLUMN "tertiaryCategoryId",
ALTER COLUMN "description" DROP NOT NULL;
