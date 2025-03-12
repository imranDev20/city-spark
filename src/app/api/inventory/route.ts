import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const getSortOptions = (
  sortValue: string
): Prisma.InventoryOrderByWithRelationInput => {
  switch (sortValue) {
    case "price_low_to_high":
      return {
        product: {
          retailPrice: "asc",
        },
      };
    case "price_high_to_low":
      return {
        product: {
          retailPrice: "desc",
        },
      };
    case "newest":
      return {
        createdAt: "desc",
      };
    case "bestselling":
      return {
        soldCount: "desc",
      };
    default: // 'relevance' or any other value
      return {
        createdAt: "desc",
      };
  }
};

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    // console.log("Received search params:", Object.fromEntries(searchParams));

    // Parse base query parameters
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const sortBy = searchParams.get("sort_by") || "relevance";
    const minPrice = parseFloat(searchParams.get("min_price") || "0");
    const maxPrice = parseFloat(searchParams.get("max_price") || "999999999");
    const brandIds = searchParams.get("brand_id")?.split(",");

    // Category parameters - support both naming conventions for compatibility
    const primaryCategoryId =
      searchParams.get("p_id") ||
      searchParams.get("primaryCategoryId") ||
      undefined;
    const secondaryCategoryId =
      searchParams.get("s_id") ||
      searchParams.get("secondaryCategoryId") ||
      undefined;
    const tertiaryCategoryId =
      searchParams.get("t_id") ||
      searchParams.get("tertiaryCategoryId") ||
      undefined;
    const quaternaryCategoryId =
      searchParams.get("q_id") ||
      searchParams.get("quaternaryCategoryId") ||
      undefined;

    // Check for required categories
    const isPrimaryRequired = searchParams.get("isPrimaryRequired") === "true";
    const isSecondaryRequired =
      searchParams.get("isSecondaryRequired") === "true";
    const isTertiaryRequired =
      searchParams.get("isTertiaryRequired") === "true";
    const isQuaternaryRequired =
      searchParams.get("isQuaternaryRequired") === "true";

    const skip = (page - 1) * limit;
    const orderBy = getSortOptions(sortBy);

    // Check required categories
    if (
      !search &&
      ((isPrimaryRequired && !primaryCategoryId) ||
        (isSecondaryRequired && !secondaryCategoryId) ||
        (isTertiaryRequired && !tertiaryCategoryId) ||
        (isQuaternaryRequired && !quaternaryCategoryId))
    ) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          totalCount: 0,
          totalPages: 0,
          hasMore: false,
        },
      });
    }

    // Base where clause
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

    // Add brand filter
    if (brandIds && brandIds.length > 0 && brandIds[0] !== "") {
      whereClause.product.AND.push({
        brandId: {
          in: brandIds,
        },
      });
    }

    // Add category conditions
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

    // Get all non-standard parameters for template field filtering
    const excludedParams = [
      "search",
      "limit",
      "page",
      "primaryCategoryId",
      "secondaryCategoryId",
      "tertiaryCategoryId",
      "quaternaryCategoryId",
      "isPrimaryRequired",
      "isSecondaryRequired",
      "isTertiaryRequired",
      "isQuaternaryRequired",
      "p_id",
      "s_id",
      "t_id",
      "q_id",
      "sort_by",
      "minPrice",
      "maxPrice",
      "brand_id",
    ];

    const filterParams = Array.from(searchParams.entries()).filter(
      ([key]) => !excludedParams.includes(key)
    );

    // Handle template fields
    for (const [fieldName, value] of filterParams) {
      if (!value) continue;

      const values = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      if (values.length === 0) continue;

      whereClause.product.AND.push({
        productTemplate: {
          fields: {
            some: {
              AND: [
                {
                  templateField: {
                    fieldName,
                  },
                },
                {
                  fieldValue: {
                    in: values,
                  },
                },
              ],
            },
          },
        },
      });
    }

    // Add search conditions
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
            },
          },
        },
      },
    };

    // For search with relevance ordering, apply custom ranking
    if (search && sortBy === "relevance") {
      // Get all matching items first
      const [items, total] = await prisma.$transaction([
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

      // Apply pagination to ranked results
      const paginatedItems = rankedItems.slice(skip, skip + limit);

      // Calculate pagination
      const totalPages = Math.ceil(total / limit);
      const hasMore = page * limit < total;

      return NextResponse.json({
        success: true,
        message: "Inventory items fetched successfully with search ranking",
        data: paginatedItems,
        pagination: {
          page,
          limit,
          totalCount: total,
          totalPages,
          hasMore,
        },
      });
    } else {
      // For non-search queries or other sort methods, use standard sorting
      const [items, total] = await prisma.$transaction([
        prisma.inventory.findMany({
          where: whereClause,
          include: includeOptions,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.inventory.count({ where: whereClause }),
      ]);

      // Calculate pagination
      const totalPages = Math.ceil(total / limit);
      const hasMore = page * limit < total;

      return NextResponse.json({
        success: true,
        message: "Inventory items fetched successfully",
        data: items,
        pagination: {
          page,
          limit,
          totalCount: total,
          totalPages,
          hasMore,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching inventory items",
        data: [],
        pagination: {
          page: 1,
          limit: 12,
          totalCount: 0,
          totalPages: 0,
          hasMore: false,
        },
      },
      { status: 500 }
    );
  }
}
