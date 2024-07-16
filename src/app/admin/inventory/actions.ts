"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unstable_cache as cache } from "next/cache";

export const getAllInventory = cache(async () => {
    try {
      const inventory = await prisma.inventory.findMany({
        include: {
        product:true
        },
      });
  
      return inventory;
    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw new Error("Failed to fetch inventory");
    }
  });