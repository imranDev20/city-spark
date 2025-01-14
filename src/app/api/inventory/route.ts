import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    console.log("Received search params:", Object.fromEntries(searchParams));

    // Parse base query parameters
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const primaryCategoryId =
      searchParams.get("primaryCategoryId") || undefined;
    const secondaryCategoryId =
      searchParams.get("secondaryCategoryId") || undefined;
    const tertiaryCategoryId =
      searchParams.get("tertiaryCategoryId") || undefined;
    const quaternaryCategoryId =
      searchParams.get("quaternaryCategoryId") || undefined;
    const isPrimaryRequired = searchParams.get("isPrimaryRequired") === "true";
    const isSecondaryRequired =
      searchParams.get("isSecondaryRequired") === "true";
    const isTertiaryRequired =
      searchParams.get("isTertiaryRequired") === "true";
    const isQuaternaryRequired =
      searchParams.get("isQuaternaryRequired") === "true";

    const skip = (page - 1) * limit;

    // Check if any required category is missing (only if not searching)
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
        AND: [], // Initialize AND array
      },
    };

    // Add category conditions
    if (!search) {
      const categoryConditions: any = {};
      if (primaryCategoryId)
        categoryConditions.primaryCategoryId = primaryCategoryId;
      if (secondaryCategoryId)
        categoryConditions.secondaryCategoryId = secondaryCategoryId;
      if (tertiaryCategoryId)
        categoryConditions.tertiaryCategoryId = tertiaryCategoryId;
      if (quaternaryCategoryId)
        categoryConditions.quaternaryCategoryId = quaternaryCategoryId;

      if (Object.keys(categoryConditions).length > 0) {
        whereClause.product.AND.push(categoryConditions);
      }
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

    // Handle filter parameters
    const filterParams = Array.from(searchParams.entries()).filter(
      ([key]) =>
        ![
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
        ].includes(key)
    );

    for (const [fieldName, value] of filterParams) {
      if (fieldName === "minPrice") {
        whereClause.product.AND.push({
          tradePrice: { gte: parseFloat(value) },
        });
      } else if (fieldName === "maxPrice") {
        whereClause.product.AND.push({
          tradePrice: { lte: parseFloat(value) },
        });
      } else if (fieldName === "brand") {
        whereClause.product.AND.push({
          brand: {
            name: { in: [value] },
          },
        });
      } else {
        // Handle template fields (like Barcode)
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
                    fieldValue: value,
                  },
                ],
              },
            },
          },
        });
      }
    }

    // Remove empty AND array if no conditions were added
    if (whereClause.product.AND.length === 0) {
      delete whereClause.product.AND;
    }

    console.log("Final where clause:", JSON.stringify(whereClause, null, 2));

    // Get items and total count
    const [items, total] = await Promise.all([
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
        },
        orderBy: {
          createdAt: "desc",
        },
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
