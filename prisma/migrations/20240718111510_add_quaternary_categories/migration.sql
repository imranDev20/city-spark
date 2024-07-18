-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "quaternaryCategoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_quaternaryCategoryId_fkey" FOREIGN KEY ("quaternaryCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
