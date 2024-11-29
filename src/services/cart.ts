// src/services/cart.ts

import axios from "axios";
import { Prisma } from "@prisma/client";

export type CartItemWithRelations = Prisma.CartItemGetPayload<{
  include: {
    inventory: {
      include: {
        product: {
          include: {
            brand: {
              select: {
                name: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type GroupedCartItems = {
  delivery: CartItemWithRelations[];
  collection: CartItemWithRelations[];
};

/**
 * Fetches cart items from the API
 * @returns Promise containing array of cart items with their relations
 * @throws Error if the API request fails
 */
export const fetchCartItems = async (): Promise<CartItemWithRelations[]> => {
  const { data } = await axios.get("/api/cart");
  if (!data.success) {
    throw new Error(data.error?.message || "Failed to fetch cart items");
  }
  return data.data;
};

/**
 * Groups cart items by their fulfillment type (delivery or collection)
 * @param cartItems Array of cart items to be grouped
 * @returns Object containing grouped cart items
 */
export const groupCartItems = (
  cartItems: CartItemWithRelations[]
): GroupedCartItems => {
  return cartItems.reduce(
    (acc, item) => {
      if (item.type === "FOR_DELIVERY") {
        acc.delivery.push(item);
      } else {
        acc.collection.push(item);
      }
      return acc;
    },
    {
      delivery: [] as CartItemWithRelations[],
      collection: [] as CartItemWithRelations[],
    }
  );
};

/**
 * Calculates the total price of items in the cart
 * @param cartItems Array of cart items
 * @returns Total price of all items
 */
export const calculateCartTotal = (
  cartItems: CartItemWithRelations[]
): number => {
  return cartItems.reduce(
    (sum, item) =>
      sum + (item.inventory.product.tradePrice || 0) * (item.quantity || 0),
    0
  );
};
