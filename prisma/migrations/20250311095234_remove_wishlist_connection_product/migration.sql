/*
  Warnings:

  - You are about to drop the `_UserWishlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserWishlist" DROP CONSTRAINT "_UserWishlist_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserWishlist" DROP CONSTRAINT "_UserWishlist_B_fkey";

-- DropTable
DROP TABLE "_UserWishlist";
