"use server";

import prisma from "@/lib/prisma";
import { unstable_cache as cache } from "next/cache";

export const getInventoryItemsForStorefront = cache(
  async ({
    primaryCategoryId,
    secondaryCategoryId,
    tertiaryCategoryId,
    quaternaryCategoryId,
    isPrimaryRequired = false,
    isSecondaryRequired = false,
    isTertiaryRequired = false,
    isQuaternaryRequired = false,
    limit = 12,
    search,
    minPrice = 0,
    maxPrice = 999999999,
    brandIds,
  }: {
    primaryCategoryId?: string;
    secondaryCategoryId?: string;
    tertiaryCategoryId?: string;
    quaternaryCategoryId?: string;
    isPrimaryRequired?: boolean;
    isSecondaryRequired?: boolean;
    isTertiaryRequired?: boolean;
    isQuaternaryRequired?: boolean;
    limit?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    brandIds?: string[];
  }) => {
    try {
      console.log("Server-side fetch with params:", {
        primaryCategoryId,
        secondaryCategoryId,
        tertiaryCategoryId,
        quaternaryCategoryId,
        isPrimaryRequired,
        isSecondaryRequired,
        isTertiaryRequired,
        isQuaternaryRequired,
        limit,
        search,
        minPrice,
        maxPrice,
        brandIds,
      });

      // Check if any required category is missing
      if (
        !search &&
        ((isPrimaryRequired && !primaryCategoryId) ||
          (isSecondaryRequired && !secondaryCategoryId) ||
          (isTertiaryRequired && !tertiaryCategoryId) ||
          (isQuaternaryRequired && !quaternaryCategoryId))
      ) {
        return { inventoryItems: [], totalCount: 0 };
      }

      // Base where clause consistent with the API route
      const whereClause: any = {
        product: {
          AND: [],
        },
      };

      // Add price filter with OR for null values
      whereClause.product.AND.push({
        OR: [
          {
            retailPrice: {
              gte: minPrice,
              lte: maxPrice === Infinity ? 999999999 : maxPrice,
            },
          },
          {
            retailPrice: null,
          },
        ],
      });

      // Add brand filter if provided
      if (brandIds && brandIds.length > 0) {
        whereClause.product.AND.push({
          brandId: {
            in: brandIds,
          },
        });
      }

      // Build the where clause for categories
      if (
        primaryCategoryId ||
        secondaryCategoryId ||
        tertiaryCategoryId ||
        quaternaryCategoryId
      ) {
        const categoryConditions: any = {};
        if (primaryCategoryId) {
          categoryConditions.primaryCategoryId = primaryCategoryId;
        }
        if (secondaryCategoryId) {
          categoryConditions.secondaryCategoryId = secondaryCategoryId;
        }
        if (tertiaryCategoryId) {
          categoryConditions.tertiaryCategoryId = tertiaryCategoryId;
        }
        if (quaternaryCategoryId) {
          categoryConditions.quaternaryCategoryId = quaternaryCategoryId;
        }

        if (Object.keys(categoryConditions).length > 0) {
          whereClause.product.AND.push(categoryConditions);
        }
      }

      // Add search condition
      if (search) {
        whereClause.product.AND.push({
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { model: { contains: search, mode: "insensitive" } },
            { brand: { name: { contains: search, mode: "insensitive" } } },
          ],
        });
      }

      // Clean up empty AND arrays
      if (whereClause.product.AND.length === 0) {
        delete whereClause.product.AND;
      }

      console.log(
        "Server-side where clause:",
        JSON.stringify(whereClause, null, 2)
      );

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
                brand: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: limit,
        }),
        prisma.inventory.count({ where: whereClause }),
      ]);

      console.log(
        `Server-side fetch found ${inventoryItems.length} items out of ${totalCount} total`
      );

      return {
        inventoryItems,
        totalCount,
      };
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      throw new Error("Failed to fetch inventory items");
    }
  },
  ["inventory-items"],
  {
    revalidate: 3600, // Cache for 60 minutes
    tags: ["inventory-items"],
  }
);

export const getInventoryItem = cache(
  async (inventoryItemId: string) => {
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
                  fields: {
                    include: {
                      templateField: true,
                    },
                  },
                  template: true,
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
  },
  ["inventory-item"],
  {
    revalidate: 3600,
    tags: ["inventory-items"],
  }
);
