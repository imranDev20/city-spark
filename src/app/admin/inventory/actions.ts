"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unstable_cache as cache } from "next/cache";
import { InventoryFormInputType } from "./schema";

export const getAllInventory = cache(async () => {
    try {
      const inventory = await prisma.inventory.findMany({
        include: {
        product:{
          include: {
            images:true,
          }
        },
        },
      });
  
      return inventory;
    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw new Error("Failed to fetch inventory");
    }
  });

  export async function createInventory(data: InventoryFormInputType) {
    try {
      console.log(`data`, data);

     
      const createdInventory = await prisma.inventory.create({
      data: {
       productId: data.productId,
       deliveryEligibility: data.deliveryEligibility,
       collectionEligibility: data.collectionEligibility,
       maxDeliveryTime: data.maxDeliveryTime,
       collectionAvailabilityTime: data.collectionAvailabilityTime,
       deliveryAreas: data.deliveryAreas?.map(area => area.deliveryArea.toUpperCase()),
       collectionPoints: data.collectionPoints?.map(point => point.collectionPoint.toUpperCase()),
       countAvailableForDelivery: Number(data.countAvailableForDelivery),
       countAvailableForCollection: Number(data.countAvailableForCollection),
       minDeliveryCount: Number(data.minDeliveryCount),
       minCollectionCount:Number(data.minCollectionCount),
       maxDeliveryCount: Number(data.maxDeliveryCount),
       maxCollectionCount: Number(data.maxCollectionCount),
       stockCount: Number(data.stock)


      }
    });
  
      revalidatePath("/admin/inventories");
  
      return {
        message: "Inventory created successfully!",
        data: createdInventory,
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "An error occurred while creating the inventory.",
        success: false,
      };
    }
  }

  export async function deleteInventory(inventoryId: string) {
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