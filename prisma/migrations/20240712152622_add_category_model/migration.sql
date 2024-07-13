-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "primaryId" INTEGER NOT NULL,
    "secondaryId" INTEGER NOT NULL,
    "tertiaryId" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
