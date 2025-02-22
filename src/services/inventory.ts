// services/inventory.ts
import axios from "axios";
import { Prisma } from "@prisma/client";

// Types
export type InventoryItemWithRelations = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        brand: true;
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
      };
    };
  };
}>;

export interface RecentlyViewedResponse {
  success: boolean;
  message: string;
  data: InventoryItemWithRelations[];
}

// Service function
export async function fetchRecentlyViewedInventory(
  inventoryIds: string[]
): Promise<InventoryItemWithRelations[]> {
  try {
    if (!inventoryIds.length) {
      return [];
    }

    const { data } = await axios.get<RecentlyViewedResponse>(
      `/api/inventory/recently-viewed?ids=${inventoryIds.join(",")}`
    );

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch recently viewed items"
      );
    }
    throw error;
  }
}
