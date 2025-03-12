-- CreateTable
CREATE TABLE "_UserInventoryWishlist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserInventoryWishlist_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserInventoryWishlist_B_index" ON "_UserInventoryWishlist"("B");

-- AddForeignKey
ALTER TABLE "_UserInventoryWishlist" ADD CONSTRAINT "_UserInventoryWishlist_A_fkey" FOREIGN KEY ("A") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserInventoryWishlist" ADD CONSTRAINT "_UserInventoryWishlist_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
