-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "maxCollectionCount" INTEGER,
ADD COLUMN     "maxDeliveryCount" INTEGER,
ADD COLUMN     "minCollectionCount" INTEGER,
ADD COLUMN     "minDeliveryCount" INTEGER,
ALTER COLUMN "maxDeliveryTime" DROP NOT NULL,
ALTER COLUMN "maxDeliveryTime" SET DATA TYPE TEXT,
ALTER COLUMN "collectionAvailabilityTime" DROP NOT NULL,
ALTER COLUMN "collectionAvailabilityTime" SET DATA TYPE TEXT,
ALTER COLUMN "countAvailableForDelivery" DROP NOT NULL,
ALTER COLUMN "countAvailableForCollection" DROP NOT NULL;
