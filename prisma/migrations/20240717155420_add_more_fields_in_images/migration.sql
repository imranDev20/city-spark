-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "lastModified" INTEGER,
ADD COLUMN     "lastModifiedDate" TIMESTAMP(3),
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "type" TEXT;
