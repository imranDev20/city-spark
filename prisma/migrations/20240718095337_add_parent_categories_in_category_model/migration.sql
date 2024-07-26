-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "parentPrimaryCategoryId" TEXT,
ADD COLUMN     "parentSecondaryCategoryId" TEXT,
ADD COLUMN     "parentTertiaryCategoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentPrimaryCategoryId_fkey" FOREIGN KEY ("parentPrimaryCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentSecondaryCategoryId_fkey" FOREIGN KEY ("parentSecondaryCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentTertiaryCategoryId_fkey" FOREIGN KEY ("parentTertiaryCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
