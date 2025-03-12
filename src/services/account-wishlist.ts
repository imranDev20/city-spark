// services/wishlist.ts
import axios from "axios";
import { Prisma } from "@prisma/client";

// Type for an inventory item in the wishlist with relations
export type WishlistInventoryItem = Prisma.InventoryGetPayload<{
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

// Response type from the wishlist API
export interface WishlistResponse {
  success: boolean;
  message: string;
  data: WishlistInventoryItem[];
}

/**
 * Fetches all wishlist inventory items for the logged-in user
 * @returns Promise with wishlist inventory items data
 */
export async function fetchWishlist(): Promise<WishlistInventoryItem[]> {
  try {
    const response = await axios.get<WishlistResponse>("/api/account/wishlist");

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch wishlist");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Handle unauthenticated error
      throw new Error("You must be logged in to view your wishlist");
    }

    // Handle other errors
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : error instanceof Error
        ? error.message
        : "An unknown error occurred";

    throw new Error(errorMessage);
  }
}

/**
 * Check if an inventory item is available in stock
 * Helper function to determine product availability based on inventory data
 */
export function isInventoryAvailable(
  inventoryItem: WishlistInventoryItem
): boolean {
  const availableStock = inventoryItem.stockCount - inventoryItem.heldCount;
  return availableStock > 0;
}

/**
 * Get formatted price for a wishlist inventory item's product
 * Helper function to get the best price for display
 */
export function getProductPrice(
  inventoryItem: WishlistInventoryItem
): number | null {
  // Return promotional price if available, otherwise return retail price
  return inventoryItem.product.promotionalPrice !== null
    ? inventoryItem.product.promotionalPrice
    : inventoryItem.product.retailPrice;
}
