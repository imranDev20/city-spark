"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unstable_cache as cache } from "next/cache";
import { InventoryFormInputType } from "./schema";

export const getInventorItems = cache(async () => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: true,
      },
    });

    return inventory;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw new Error("Failed to fetch inventory");
  }
});

export async function deleteInventoryItem(inventoryId: string) {
  try {
    if (!inventoryId) {
      return {
        message: "Inventory ID is required",
        success: false,
      };
    }

    // Delete the inventory
    await prisma.inventory.delete({
      where: {
        id: inventoryId,
      },
    });

    revalidatePath("/admin/inventory");

    return {
      message: "Inventory deleted successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting inventory:", error);
    return {
      message: "An error occurred while deleting the inventory.",
      success: false,
    };
  }
}

export const getInventoryItemById = cache(async (inventoryId: string) => {
  try {
    const inventory = await prisma.inventory.findUnique({
      where: {
        id: inventoryId,
      },
      include: {
        product: true,
      },
    });

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    return inventory;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw new Error("Failed to fetch inventory");
  }
});

export async function updateInventoryItem(
  inventoryId: string,
  data: InventoryFormInputType
) {
  try {
    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        productId: data.productId,
        deliveryEligibility: data.deliveryEligibility,
        collectionEligibility: data.collectionEligibility,
        maxDeliveryTime: data.maxDeliveryTime,
        collectionAvailabilityTime: data.collectionAvailabilityTime,
        deliveryAreas: data.deliveryAreas?.map((area) =>
          area.deliveryArea.toUpperCase()
        ),
        collectionPoints: data.collectionPoints?.map((point) =>
          point.collectionPoint.toUpperCase()
        ),
        countAvailableForDelivery: Number(data.countAvailableForDelivery),
        countAvailableForCollection: Number(data.countAvailableForCollection),
        minDeliveryCount: Number(data.minDeliveryCount),
        minCollectionCount: Number(data.minCollectionCount),
        maxDeliveryCount: Number(data.maxDeliveryCount),
        maxCollectionCount: Number(data.maxCollectionCount),
        stockCount: Number(data.stock),
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/inventory");
    revalidatePath(`/admin/inventory/${inventoryId}`);

    return {
      message: "Inventory updated successfully!",
      data: updatedInventory,
      success: true,
    };
  } catch (error) {
    console.error("Error updating inventory:", error);
    return {
      message: "An error occurred while updating the inventory.",
      success: false,
    };
  }
}
