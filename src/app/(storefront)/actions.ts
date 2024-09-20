"use server";

import prisma from "@/lib/prisma";

export const getInventoryItemsForStorefront = async ({
  primaryCategoryId,
  secondaryCategoryId,
  tertiaryCategoryId,
  quaternaryCategoryId,
  isPrimaryRequired = false,
  isSecondaryRequired = false,
  isTertiaryRequired = false,
  isQuaternaryRequired = false,
  page = 1,
  limit = 10,
}: {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
  isPrimaryRequired?: boolean;
  isSecondaryRequired?: boolean;
  isTertiaryRequired?: boolean;
  isQuaternaryRequired?: boolean;
  page?: number;
  limit?: number;
}) => {
  try {
    const skip = (page - 1) * limit;

    // Check if any required category is missing
    if (
      (isPrimaryRequired && !primaryCategoryId) ||
      (isSecondaryRequired && !secondaryCategoryId) ||
      (isTertiaryRequired && !tertiaryCategoryId) ||
      (isQuaternaryRequired && !quaternaryCategoryId)
    ) {
      return { inventoryItems: [], hasMore: false, totalCount: 0 };
    }

    const whereClause: {
      product?: {
        primaryCategoryId?: string;
        secondaryCategoryId?: string;
        tertiaryCategoryId?: string;
        quaternaryCategoryId?: string;
      };
    } = {};

    // Build the where clause only if at least one category is provided
    if (
      primaryCategoryId ||
      secondaryCategoryId ||
      tertiaryCategoryId ||
      quaternaryCategoryId
    ) {
      whereClause.product = {};
      if (primaryCategoryId)
        whereClause.product.primaryCategoryId = primaryCategoryId;
      if (secondaryCategoryId)
        whereClause.product.secondaryCategoryId = secondaryCategoryId;
      if (tertiaryCategoryId)
        whereClause.product.tertiaryCategoryId = tertiaryCategoryId;
      if (quaternaryCategoryId)
        whereClause.product.quaternaryCategoryId = quaternaryCategoryId;
    }

    // Check if any of the provided category IDs exist
    const categoryExists = await prisma.category.findFirst({
      where: {
        OR: [
          { id: primaryCategoryId },
          { id: secondaryCategoryId },
          { id: tertiaryCategoryId },
          { id: quaternaryCategoryId },
        ].filter(Boolean),
      },
    });

    if (!categoryExists) {
      return { inventoryItems: [], hasMore: false, totalCount: 0 };
    }

    const [inventoryItems, totalCount] = await Promise.all([
      prisma.inventory.findMany({
        where: whereClause,
        include: {
          product: {
            include: {
              primaryCategory: true,
              secondaryCategory: true,
              tertiaryCategory: true,
              quaternaryCategory: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.inventory.count({ where: whereClause }),
    ]);

    const hasMore = totalCount > skip + inventoryItems.length;

    return {
      inventoryItems,
      hasMore,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    throw new Error("Failed to fetch inventory items");
  }
};

export async function getInventoryItem(inventoryItemId: string) {
  try {
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: inventoryItemId },
      include: {
        product: {
          include: {
            brand: true,
            primaryCategory: true,
            secondaryCategory: true,
            tertiaryCategory: true,
            quaternaryCategory: true,
            productTemplate: {
              include: {
                fields: true,
              },
            },
          },
        },
      },
    });

    if (!inventoryItem) {
      throw new Error("Inventory item not found");
    }

    return inventoryItem;
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    throw error;
  }
}

export const getLatestInventoryItems = async (limit: number = 10) => {
  try {
    const inventoryItems = await prisma.inventory.findMany({
      include: {
        product: {
          include: {
            brand: true,
            primaryCategory: true,
            secondaryCategory: true,
            tertiaryCategory: true,
            quaternaryCategory: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return inventoryItems;
  } catch (error) {
    console.error("Error fetching latest inventory items:", error);
    throw new Error("Failed to fetch latest inventory items");
  }
};
