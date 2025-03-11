"use server";

import { authOptions, getServerAuthSession } from "@/lib/auth";
import { getCartWhereInput } from "@/lib/cart-utils";
import prisma from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session-id";
import { CategoryType, FulFillmentType, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath, unstable_cache as cache } from "next/cache";

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
            parentPrimaryCategoryId: primaryId,
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
            parentSecondaryCategoryId: secondaryId,
            parentPrimaryCategoryId: primaryId,
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
            parentTertiaryCategoryId: tertiaryId,
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

type FilterOption = {
  id: string;
  name: string;
  options: string[];
};

export const getProductFilterOptions = cache(
  async (
    primaryCategoryId?: string,
    secondaryCategoryId?: string,
    tertiaryCategoryId?: string,
    quaternaryCategoryId?: string
  ): Promise<FilterOption[]> => {
    // Build where conditions array
    const conditions: Prisma.ProductWhereInput[] = [];

    if (primaryCategoryId) {
      conditions.push({ primaryCategoryId });
    }
    if (secondaryCategoryId) {
      conditions.push({ secondaryCategoryId });
    }
    if (tertiaryCategoryId) {
      conditions.push({ tertiaryCategoryId });
    }
    if (quaternaryCategoryId) {
      conditions.push({ quaternaryCategoryId });
    }

    // Create the where clause with properly typed AND condition
    const whereClause: Prisma.ProductWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    // Fetch only products that match the category hierarchy
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        productTemplate: {
          include: {
            fields: {
              include: {
                templateField: true,
              },
            },
          },
        },
      },
    });

    const filterOptions: Record<string, Set<string>> = {};

    // Only process if we have matching products
    if (products.length > 0) {
      // Process standard fields
      const standardFields = [
        "material",
        "color",
        "shape",
        "unit",
        "warranty",
        "guarantee",
      ];

      products.forEach((product) => {
        // Standard string fields
        standardFields.forEach((field) => {
          const value = product[field as keyof typeof product];
          if (typeof value === "string" && value.trim() !== "") {
            if (!filterOptions[field]) {
              filterOptions[field] = new Set();
            }
            filterOptions[field].add(value);
          }
        });

        // Numeric fields with range handling
        ["width", "height", "length", "weight", "volume"].forEach((field) => {
          const value = product[field as keyof typeof product];
          if (typeof value === "number") {
            const roundedValue = Math.round(value * 100) / 100;
            if (!filterOptions[field]) {
              filterOptions[field] = new Set();
            }
            filterOptions[field].add(roundedValue.toString());
          }
        });

        // Product template fields
        product.productTemplate?.fields.forEach((field) => {
          const fieldName = field.templateField.fieldName;
          const fieldValue = field.fieldValue;
          if (fieldValue && fieldValue.trim() !== "") {
            if (!filterOptions[fieldName]) {
              filterOptions[fieldName] = new Set();
            }
            filterOptions[fieldName].add(fieldValue);
          }
        });
      });
    }

    // Convert to array format and sort options
    const result: FilterOption[] = Object.entries(filterOptions)
      .filter(([_, options]) => options.size > 0) // Only include filters with options
      .map(([name, options]) => ({
        id: name,
        name: name,
        options: Array.from(options).sort((a, b) => {
          // Try to sort numerically if possible
          const numA = parseFloat(a);
          const numB = parseFloat(b);
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }
          // Fall back to string comparison
          return a.localeCompare(b);
        }),
      }));

    return result;
  },
  ["getProductFilterOptions"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["products", "filters"],
  }
);

export async function addToCart(
  inventoryId: string,
  quantity: number,
  type: FulFillmentType
) {
  try {
    const session = await getServerAuthSession();
    const userId = session?.user?.id;
    const sessionId = userId ? undefined : await getOrCreateSessionId();

    const result = await prisma.$transaction(async (prisma) => {
      // Get settings for delivery charge
      const settings = await prisma.settings.findFirst();
      if (!settings) {
        throw new Error("System settings not found");
      }

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

      // Calculate item price with VAT
      const itemPrice =
        inventoryItem.product.promotionalPrice &&
        inventoryItem.product.promotionalPrice > 0
          ? inventoryItem.product.promotionalPrice
          : inventoryItem.product.retailPrice || 0;

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
        const newQuantity = existingCartItem.quantity + quantity;
        cartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: newQuantity,
            price: itemPrice,
            totalPrice: itemPrice * newQuantity,
          },
        });
      } else {
        cartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            inventoryId,
            quantity,
            type,
            price: itemPrice,
            totalPrice: itemPrice * quantity,
          },
        });
      }

      // Get updated cart with all items
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

      // Calculate totals
      let deliveryTotalWithVat = 0;
      let collectionTotalWithVat = 0;
      let hasDeliveryItems = false;

      updatedCart.cartItems.forEach((item) => {
        if (item.type === FulFillmentType.FOR_DELIVERY) {
          deliveryTotalWithVat += item.totalPrice;
          hasDeliveryItems = true;
        } else {
          collectionTotalWithVat += item.totalPrice;
        }
      });

      // Apply delivery charge if there are delivery items and total is below free delivery threshold
      const deliveryCharge =
        hasDeliveryItems &&
        (!settings.freeDeliveryThreshold ||
          deliveryTotalWithVat < settings.freeDeliveryThreshold)
          ? settings.defaultDeliveryCharge
          : 0;
      const deliveryVat = deliveryCharge * 0.2; // 20% VAT on delivery

      // Calculate VAT-exclusive amounts
      const deliveryTotalWithoutVat = deliveryTotalWithVat / 1.2;
      const collectionTotalWithoutVat = collectionTotalWithVat / 1.2;
      const subTotalWithVat = deliveryTotalWithVat + collectionTotalWithVat;
      const subTotalWithoutVat =
        deliveryTotalWithoutVat + collectionTotalWithoutVat;
      const vat = subTotalWithVat - subTotalWithoutVat + deliveryVat;

      // Final totals including delivery and its VAT
      const totalPriceWithVat = subTotalWithVat + deliveryCharge + deliveryVat;
      const totalPriceWithoutVat = subTotalWithoutVat + deliveryCharge;

      // Update cart with all calculated values
      const finalCart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          deliveryTotalWithVat,
          deliveryTotalWithoutVat,
          collectionTotalWithVat,
          collectionTotalWithoutVat,
          subTotalWithVat,
          subTotalWithoutVat,
          deliveryCharge,
          vat,
          totalPriceWithVat,
          totalPriceWithoutVat,
          status: "ACTIVE",
        },
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
    const sessionId = userId ? undefined : await getOrCreateSessionId();

    if (!id) {
      throw new Error("Invalid input");
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Get settings for delivery charge
      const settings = await prisma.settings.findFirst();
      if (!settings) {
        throw new Error("System settings not found");
      }

      // Delete the cart item
      await prisma.cartItem.delete({
        where: { id },
      });

      // Get updated cart
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

      // Calculate totals
      let deliveryTotalWithVat = 0;
      let collectionTotalWithVat = 0;
      let hasDeliveryItems = false;

      updatedCart.cartItems.forEach((item) => {
        if (item.type === FulFillmentType.FOR_DELIVERY) {
          deliveryTotalWithVat += item.totalPrice;
          hasDeliveryItems = true;
        } else {
          collectionTotalWithVat += item.totalPrice;
        }
      });

      // Apply delivery charge if there are delivery items and below free delivery threshold
      const deliveryCharge =
        hasDeliveryItems &&
        (!settings.freeDeliveryThreshold ||
          deliveryTotalWithVat < settings.freeDeliveryThreshold)
          ? settings.defaultDeliveryCharge
          : 0;
      const deliveryVat = deliveryCharge * 0.2; // 20% VAT on delivery

      // Calculate VAT-exclusive amounts
      const deliveryTotalWithoutVat = deliveryTotalWithVat / 1.2;
      const collectionTotalWithoutVat = collectionTotalWithVat / 1.2;
      const subTotalWithVat = deliveryTotalWithVat + collectionTotalWithVat;
      const subTotalWithoutVat =
        deliveryTotalWithoutVat + collectionTotalWithoutVat;
      const vat = subTotalWithVat - subTotalWithoutVat + deliveryVat;

      // Final totals including delivery and its VAT
      const totalPriceWithVat = subTotalWithVat + deliveryCharge + deliveryVat;
      const totalPriceWithoutVat = subTotalWithoutVat + deliveryCharge;

      // Update cart with all calculated values
      const finalCart = await prisma.cart.update({
        where: { id: updatedCart.id },
        data: {
          deliveryTotalWithVat,
          deliveryTotalWithoutVat,
          collectionTotalWithVat,
          collectionTotalWithoutVat,
          subTotalWithVat,
          subTotalWithoutVat,
          deliveryCharge,
          vat,
          totalPriceWithVat,
          totalPriceWithoutVat,
        },
        include: { cartItems: true },
      });

      return finalCart;
    });

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
    const sessionId = userId ? undefined : await getOrCreateSessionId();

    if (!id || isNaN(quantity)) {
      throw new Error("Invalid input");
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Get settings for delivery charge
      const settings = await prisma.settings.findFirst();
      if (!settings) {
        throw new Error("System settings not found");
      }

      // Get the current cart item to update
      const currentCartItem = await prisma.cartItem.findUnique({
        where: { id },
        include: {
          inventory: {
            include: { product: true },
          },
        },
      });

      if (!currentCartItem) {
        throw new Error("Cart item not found");
      }

      // Calculate the updated price
      const itemPrice =
        currentCartItem.inventory.product.promotionalPrice &&
        currentCartItem.inventory.product.promotionalPrice > 0
          ? currentCartItem.inventory.product.promotionalPrice
          : currentCartItem.inventory.product.retailPrice || 0;

      // Update the cart item quantity and total price
      await prisma.cartItem.update({
        where: { id },
        data: {
          quantity,
          price: itemPrice,
          totalPrice: itemPrice * quantity,
        },
      });

      // Get updated cart to recalculate
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

      // Calculate totals
      let deliveryTotalWithVat = 0;
      let collectionTotalWithVat = 0;
      let hasDeliveryItems = false;

      updatedCart.cartItems.forEach((item) => {
        if (item.type === FulFillmentType.FOR_DELIVERY) {
          deliveryTotalWithVat += item.totalPrice;
          hasDeliveryItems = true;
        } else {
          collectionTotalWithVat += item.totalPrice;
        }
      });

      // Apply delivery charge if there are delivery items and below free delivery threshold
      const deliveryCharge =
        hasDeliveryItems &&
        (!settings.freeDeliveryThreshold ||
          deliveryTotalWithVat < settings.freeDeliveryThreshold)
          ? settings.defaultDeliveryCharge
          : 0;
      const deliveryVat = deliveryCharge * 0.2; // 20% VAT on delivery

      // Calculate VAT-exclusive amounts
      const deliveryTotalWithoutVat = deliveryTotalWithVat / 1.2;
      const collectionTotalWithoutVat = collectionTotalWithVat / 1.2;
      const subTotalWithVat = deliveryTotalWithVat + collectionTotalWithVat;
      const subTotalWithoutVat =
        deliveryTotalWithoutVat + collectionTotalWithoutVat;
      const vat = subTotalWithVat - subTotalWithoutVat + deliveryVat;

      // Final totals including delivery and its VAT
      const totalPriceWithVat = subTotalWithVat + deliveryCharge + deliveryVat;
      const totalPriceWithoutVat = subTotalWithoutVat + deliveryCharge;

      // Update cart with all calculated values
      const finalCart = await prisma.cart.update({
        where: { id: updatedCart.id },
        data: {
          deliveryTotalWithVat,
          deliveryTotalWithoutVat,
          collectionTotalWithVat,
          collectionTotalWithoutVat,
          subTotalWithVat,
          subTotalWithoutVat,
          deliveryCharge,
          vat,
          totalPriceWithVat,
          totalPriceWithoutVat,
        },
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

export async function updateCartItemType(id: string, newType: FulFillmentType) {
  try {
    const session = await getServerAuthSession();
    const userId = session?.user?.id;
    const sessionId = userId ? undefined : await getOrCreateSessionId();

    if (!id || !newType) {
      throw new Error("Invalid input");
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Get settings for delivery charge
      const settings = await prisma.settings.findFirst();
      if (!settings) {
        throw new Error("System settings not found");
      }

      // Get the current cart item to update
      const currentCartItem = await prisma.cartItem.findUnique({
        where: { id },
        include: {
          cart: true,
          inventory: {
            include: { product: true },
          },
        },
      });

      if (!currentCartItem) {
        throw new Error("Cart item not found");
      }

      // Check eligibility
      if (
        newType === FulFillmentType.FOR_DELIVERY &&
        !currentCartItem.inventory.deliveryEligibility
      ) {
        throw new Error("This item is not eligible for delivery");
      }
      if (
        newType === FulFillmentType.FOR_COLLECTION &&
        !currentCartItem.inventory.collectionEligibility
      ) {
        throw new Error("This item is not eligible for collection");
      }

      // Check if an item with the same product and new fulfillment type already exists
      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: currentCartItem.cartId,
          inventoryId: currentCartItem.inventoryId,
          type: newType,
          id: { not: currentCartItem.id }, // Exclude current item
        },
      });

      if (existingCartItem) {
        // Update existing item's quantity and delete the current item
        await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: existingCartItem.quantity + currentCartItem.quantity,
            totalPrice:
              (existingCartItem.quantity + currentCartItem.quantity) *
              currentCartItem.price,
          },
        });

        await prisma.cartItem.delete({
          where: { id: currentCartItem.id },
        });
      } else {
        // Just update the type if no existing item found
        await prisma.cartItem.update({
          where: { id },
          data: { type: newType },
        });
      }

      // Get updated cart to recalculate totals
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

      // Calculate totals
      let deliveryTotalWithVat = 0;
      let collectionTotalWithVat = 0;
      let hasDeliveryItems = false;

      updatedCart.cartItems.forEach((item) => {
        if (item.type === FulFillmentType.FOR_DELIVERY) {
          deliveryTotalWithVat += item.totalPrice;
          hasDeliveryItems = true;
        } else {
          collectionTotalWithVat += item.totalPrice;
        }
      });

      // Rest of the calculations remain the same...
      const deliveryCharge =
        hasDeliveryItems &&
        (!settings.freeDeliveryThreshold ||
          deliveryTotalWithVat < settings.freeDeliveryThreshold)
          ? settings.defaultDeliveryCharge
          : 0;
      const deliveryVat = deliveryCharge * 0.2;

      const deliveryTotalWithoutVat = deliveryTotalWithVat / 1.2;
      const collectionTotalWithoutVat = collectionTotalWithVat / 1.2;
      const subTotalWithVat = deliveryTotalWithVat + collectionTotalWithVat;
      const subTotalWithoutVat =
        deliveryTotalWithoutVat + collectionTotalWithoutVat;
      const vat = subTotalWithVat - subTotalWithoutVat + deliveryVat;
      const totalPriceWithVat = subTotalWithVat + deliveryCharge + deliveryVat;
      const totalPriceWithoutVat = subTotalWithoutVat + deliveryCharge;

      // Update cart with all calculated values
      const finalCart = await prisma.cart.update({
        where: { id: updatedCart.id },
        data: {
          deliveryTotalWithVat,
          deliveryTotalWithoutVat,
          collectionTotalWithVat,
          collectionTotalWithoutVat,
          subTotalWithVat,
          subTotalWithoutVat,
          deliveryCharge,
          vat,
          totalPriceWithVat,
          totalPriceWithoutVat,
        },
        include: { cartItems: true },
      });

      return finalCart;
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/basket");
    revalidatePath("/checkout");

    return {
      message: `Successfully moved item to ${newType.toLowerCase()}`,
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error updating cart item type:", error);
    return {
      message:
        error instanceof Error
          ? error.message
          : "Failed to update cart item type",
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
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

type BrandInfo = {
  id: string;
  name: string;
  image: string | null;
};

export type BrandsByCategory = {
  [categoryName: string]: BrandInfo[];
};

export async function getTopBrands(): Promise<BrandsByCategory> {
  try {
    // First get all primary categories
    const primaryCategories = await prisma.category.findMany({
      where: {
        type: "PRIMARY",
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Get the specific secondary categories (Boilers and Radiators)
    const secondaryCategories = await prisma.category.findMany({
      where: {
        type: "SECONDARY",
        OR: [
          { name: { equals: "Boilers", mode: "insensitive" } },
          { name: { equals: "Radiators", mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Create a map to store results
    const brandsByCategory: BrandsByCategory = {};

    // For each primary category, get top 10 brands
    await Promise.all(
      primaryCategories.map(async (category) => {
        const brands = await prisma.brand.findMany({
          where: {
            status: "ACTIVE",
            products: {
              some: {
                primaryCategoryId: category.id,
              },
            },
          },
          select: {
            id: true,
            name: true,
            image: true,
            _count: {
              select: {
                products: {
                  where: {
                    primaryCategoryId: category.id,
                  },
                },
              },
            },
          },
          orderBy: {
            products: {
              _count: "desc",
            },
          },
          take: 10,
        });

        if (brands.length > 0) {
          // Only add categories that have brands
          brandsByCategory[category.name.toLowerCase()] = brands.map(
            (brand) => ({
              id: brand.id,
              name: brand.name,
              image: brand.image,
            })
          );
        }
      })
    );

    // For each secondary category (Boilers and Radiators), get top 10 brands
    await Promise.all(
      secondaryCategories.map(async (category) => {
        const brands = await prisma.brand.findMany({
          where: {
            status: "ACTIVE",
            products: {
              some: {
                secondaryCategoryId: category.id,
              },
            },
          },
          select: {
            id: true,
            name: true,
            image: true,
            _count: {
              select: {
                products: {
                  where: {
                    secondaryCategoryId: category.id,
                  },
                },
              },
            },
          },
          orderBy: {
            products: {
              _count: "desc",
            },
          },
          take: 10,
        });

        if (brands.length > 0) {
          // Only add categories that have brands
          brandsByCategory[category.name.toLowerCase()] = brands.map(
            (brand) => ({
              id: brand.id,
              name: brand.name,
              image: brand.image,
            })
          );
        }
      })
    );

    return brandsByCategory;
  } catch (error) {
    console.error("Error fetching top brands:", error);
    return {};
  }
}

export type WishlistActionResponse = {
  success: boolean;
  message: string;
  isWishlisted?: boolean;
};

export async function toggleWishlistItem(
  inventoryId: string
): Promise<WishlistActionResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return {
        success: false,
        message: "You must be logged in to save items to your wishlist",
      };
    }

    // Get user by email with wishlistInventory check
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        wishlistInventory: {
          where: { id: inventoryId },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const isInWishlist = user.wishlistInventory.length > 0;

    if (isInWishlist) {
      // Remove from wishlist
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          wishlistInventory: {
            disconnect: {
              id: inventoryId,
            },
          },
        },
      });

      revalidatePath("/products");
      revalidatePath(`/products/p/[...slug]`);

      return {
        success: true,
        message: "Item removed from your wishlist",
        isWishlisted: false,
      };
    } else {
      // Add to wishlist
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          wishlistInventory: {
            connect: {
              id: inventoryId,
            },
          },
        },
      });

      revalidatePath("/products");
      revalidatePath(`/products/p/[...slug]`);

      return {
        success: true,
        message: "Item added to your wishlist",
        isWishlisted: true,
      };
    }
  } catch (error) {
    console.error("Error toggling wishlist item:", error);
    return {
      success: false,
      message: "An error occurred while updating your wishlist",
    };
  }
}

export async function checkWishlistStatus(
  inventoryId: string
): Promise<{ isWishlisted: boolean }> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { isWishlisted: false };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        wishlistInventory: {
          where: { id: inventoryId },
        },
      },
    });

    return {
      isWishlisted: user?.wishlistInventory.length ? true : false,
    };
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return { isWishlisted: false };
  }
}
