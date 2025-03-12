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

      const includeOptions = {
        product: {
          include: {
            primaryCategory: true,
            secondaryCategory: true,
            tertiaryCategory: true,
            quaternaryCategory: true,
            brand: true,
          },
        },
      };

      // If there's a search, apply the same ranking logic as search suggestions
      if (search) {
        const [items, totalCount] = await Promise.all([
          prisma.inventory.findMany({
            where: whereClause,
            include: includeOptions,
            take: Math.min(limit * 5, 300), // Get enough to rank but not too many
          }),
          prisma.inventory.count({ where: whereClause }),
        ]);

        // Apply search ranking logic (same as search suggestions)
        const group1 = []; // Products where brand name AND product name match search term
        const group2 = []; // Products where only brand name matches search term
        const group3 = []; // Products where only product name matches search term
        const group4 = []; // All other matches

        const searchLower = search.toLowerCase();

        for (const item of items) {
          const productName = item.product.name.toLowerCase();
          const brandName = item.product.brand?.name.toLowerCase() || "";

          // Group 1: Brand name matches AND product name matches
          if (
            brandName.includes(searchLower) &&
            productName.includes(searchLower)
          ) {
            group1.push(item);
          }
          // Group 2: Only brand name matches
          else if (brandName.includes(searchLower)) {
            group2.push(item);
          }
          // Group 3: Only product name matches
          else if (productName.includes(searchLower)) {
            group3.push(item);
          }
          // Group 4: Other matches (description, model, etc.)
          else {
            group4.push(item);
          }
        }

        // Combine groups in priority order
        const rankedItems = [...group1, ...group2, ...group3, ...group4];

        // Apply limit to get only what we need
        const limitedItems = rankedItems.slice(0, limit);

        return {
          inventoryItems: limitedItems,
          totalCount,
        };
      } else {
        // For non-search, use standard sorting
        const [inventoryItems, totalCount] = await Promise.all([
          prisma.inventory.findMany({
            where: whereClause,
            include: includeOptions,
            orderBy: {
              createdAt: "desc",
            },
            take: limit,
          }),
          prisma.inventory.count({ where: whereClause }),
        ]);

        return {
          inventoryItems,
          totalCount,
        };
      }
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
