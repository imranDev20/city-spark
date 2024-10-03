"use server";

import { getServerAuthSession } from "@/lib/auth";
import { getCartWhereInput } from "@/lib/cart-utils";
import prisma from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session-id";
import { CategoryType, FulFillmentType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getCategoriesByType(
  type: CategoryType,
  primaryId?: string,
  secondaryId?: string,
  tertiaryId?: string
) {
  try {
    let categories;
    switch (type) {
      case CategoryType.PRIMARY:
        categories = await prisma.category.findMany({
          where: { type: CategoryType.PRIMARY },
          orderBy: { name: "asc" },
          include: {
            primaryChildCategories: {
              where: { type: CategoryType.SECONDARY },
              orderBy: { name: "asc" },
              include: {
                parentPrimaryCategory: true,
                secondaryChildCategories: {
                  where: { type: CategoryType.TERTIARY },
                  orderBy: { name: "asc" },
                  include: {
                    parentPrimaryCategory: true,
                    parentSecondaryCategory: true,
                    tertiaryChildCategories: {
                      where: { type: CategoryType.QUATERNARY },
                      orderBy: { name: "asc" },
                    },
                  },
                },
              },
            },
            primaryProducts: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        });
        break;

      case CategoryType.SECONDARY:
        categories = await prisma.category.findMany({
          where: {
            type: CategoryType.SECONDARY,
            parentPrimaryCategoryId: primaryId, //must provide
          },
          orderBy: { name: "asc" },
          include: {
            secondaryChildCategories: {
              where: { type: CategoryType.TERTIARY },
              orderBy: { name: "asc" },
            },
            parentPrimaryCategory: true,
            secondaryProducts: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        });
        break;

      case CategoryType.TERTIARY:
        categories = await prisma.category.findMany({
          where: {
            type: CategoryType.TERTIARY,
            parentSecondaryCategoryId: secondaryId, // must provide
            parentPrimaryCategoryId: primaryId, // not necessary
          },
          orderBy: { name: "asc" },
          include: {
            tertiaryChildCategories: {
              where: { type: CategoryType.QUATERNARY },
              orderBy: { name: "asc" },
            },
            parentSecondaryCategory: true,
            parentPrimaryCategory: true,
            tertiaryProducts: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        });
        break;

      case CategoryType.QUATERNARY:
        categories = await prisma.category.findMany({
          where: {
            type: CategoryType.QUATERNARY,
            parentPrimaryCategoryId: primaryId,
            parentSecondaryCategoryId: secondaryId,
            parentTertiaryCategoryId: tertiaryId, // must provide
          },
          orderBy: { name: "asc" },
          include: {
            parentPrimaryCategory: true,
            parentSecondaryCategory: true,
            parentTertiaryCategory: true,
            quaternaryProducts: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        });
        break;

      default:
        throw new Error(`Unsupported category type: ${type}`);
    }

    return {
      categories,
      success: true,
    };
  } catch (error) {
    console.error(`Error fetching ${type} categories:`, error);
    return {
      categories: [],
      success: false,
      error: `Failed to fetch ${type} categories`,
    };
  }
}

export async function getCategoryById(categoryId: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        parentPrimaryCategory: true,
        parentSecondaryCategory: true,
        parentTertiaryCategory: true,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
}

export async function addToCart(
  inventoryId: string,
  quantity: number,
  type: FulFillmentType
) {
  try {
    const session = await getServerAuthSession();
    const userId = session?.user?.id;
    const sessionId = userId ? undefined : getOrCreateSessionId();

    const result = await prisma.$transaction(async (prisma) => {
      // Check if the inventory item exists
      const inventoryItem = await prisma.inventory.findUnique({
        where: { id: inventoryId },
        include: { product: true },
      });

      if (!inventoryItem) {
        throw new Error("Product not found");
      }

      // Find or create a cart for the user or session
      const cartWhereInput = getCartWhereInput(userId, sessionId);
      let cart = await prisma.cart.findFirst({ where: cartWhereInput });

      if (!cart) {
        cart = await prisma.cart.create({
          data: userId ? { userId } : { sessionId: sessionId! },
        });
      }

      // Find existing cart item
      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          inventoryId,
          type,
        },
      });

      let cartItem;
      if (existingCartItem) {
        // Update existing cart item
        cartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: { increment: quantity } },
        });
      } else {
        // Create new cart item
        cartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            inventoryId,
            quantity,
            type,
          },
        });
      }

      // Recalculate total price
      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: {
          cartItems: {
            include: {
              inventory: {
                include: { product: true },
              },
            },
          },
        },
      });

      if (!updatedCart) {
        throw new Error("Failed to retrieve updated cart");
      }

      const totalPrice = updatedCart.cartItems.reduce((total, item) => {
        return (
          total +
          (item.inventory.product.tradePrice || 0) * (item.quantity || 0)
        );
      }, 0);

      // Update cart with new total price
      const finalCart = await prisma.cart.update({
        where: { id: cart.id },
        data: { totalPrice },
        include: { cartItems: true },
      });

      return finalCart;
    });

    // Revalidate relevant paths
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/basket");
    revalidatePath("/checkout");

    return {
      message: "Item added to cart successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return {
      message:
        error instanceof Error ? error.message : "Failed to add item to cart",
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}

export async function removeFromCart(id: string) {
  try {
    const session = await getServerAuthSession();
    const userId = session?.user?.id;
    const sessionId = userId ? undefined : getOrCreateSessionId();

    if (!id) {
      throw new Error("Invalid input");
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Delete the cart item
      await prisma.cartItem.delete({
        where: { id },
      });

      // Recalculate total price
      const cartWhereInput = getCartWhereInput(userId, sessionId);
      const updatedCart = await prisma.cart.findFirst({
        where: cartWhereInput,
        include: {
          cartItems: {
            include: {
              inventory: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      if (!updatedCart) {
        throw new Error("Cart not found");
      }

      const totalPrice = updatedCart.cartItems.reduce((total, item) => {
        return (
          total +
          (item.inventory.product.tradePrice || 0) * (item.quantity || 0)
        );
      }, 0);

      // Update cart with new total price
      const finalCart = await prisma.cart.update({
        where: { id: updatedCart.id },
        data: { totalPrice },
        include: { cartItems: true },
      });

      return finalCart;
    });

    // Revalidate relevant paths
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/basket");
    revalidatePath("/checkout");

    return {
      message: "Item removed from cart successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return {
      message:
        error instanceof Error
          ? error.message
          : "Failed to remove item from cart",
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}

export async function updateCartItemQuantity(id: string, quantity: number) {
  try {
    const session = await getServerAuthSession();
    const userId = session?.user?.id;
    const sessionId = userId ? undefined : getOrCreateSessionId();

    if (!id || isNaN(quantity)) {
      throw new Error("Invalid input");
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Update the cart item quantity
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: id },
        data: { quantity: quantity },
        include: { inventory: true },
      });

      // Recalculate total price
      const cartWhereInput = getCartWhereInput(userId, sessionId);
      const updatedCart = await prisma.cart.findFirst({
        where: cartWhereInput,
        include: {
          cartItems: {
            include: {
              inventory: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      if (!updatedCart) {
        throw new Error("Cart not found");
      }

      const totalPrice = updatedCart.cartItems.reduce((total, item) => {
        return (
          total +
          (item.inventory.product.tradePrice || 0) * (item.quantity || 0)
        );
      }, 0);

      // Update cart with new total price
      const finalCart = await prisma.cart.update({
        where: { id: updatedCart.id },
        data: { totalPrice },
        include: { cartItems: true },
      });

      return finalCart;
    });

    // Revalidate relevant paths
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/basket");
    revalidatePath("/checkout");

    return {
      message: "Cart item quantity updated successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return {
      message:
        error instanceof Error
          ? error.message
          : "Failed to update cart item quantity",
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}

export async function getCart() {
  try {
    const session = await getServerAuthSession();
    const userId = session?.user?.id;
    const sessionId = userId ? undefined : getOrCreateSessionId();

    const cartWhereInput = getCartWhereInput(userId, sessionId);
    const cart = await prisma.cart.findFirst({
      where: cartWhereInput,
      include: {
        cartItems: {
          include: {
            inventory: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    return cart;
  } catch (error) {
    console.error("Error getting cart:", error);
    return null;
  }
}

export async function searchProducts(searchTerm: string) {
  try {
    const products = await prisma.inventory.findMany({
      where: {
        product: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
      },
      include: {
        product: {
          include: {
            primaryCategory: true,
            secondaryCategory: true,
            tertiaryCategory: true,
            quaternaryCategory: true,
            brand: true,
          },
        },
      },
    });

    return products;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
}
