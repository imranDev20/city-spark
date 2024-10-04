import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const min_price = parseFloat(searchParams.get("min_price") || "0");
  const max_price = parseFloat(searchParams.get("max_price") || "Infinity");

  try {
    const skip = (page - 1) * limit;

    // Base where clause
    let whereClause: any = {
      AND: [
        search
          ? {
              OR: [
                {
                  product: { name: { contains: search, mode: "insensitive" } },
                },
                {
                  product: {
                    description: { contains: search, mode: "insensitive" },
                  },
                },
                {
                  product: {
                    brand: { name: { contains: search, mode: "insensitive" } },
                  },
                },
              ],
            }
          : {},
        {
          product: {
            tradePrice: {
              gte: min_price,
              lte: max_price,
            },
          },
        },
      ],
    };

    // Dynamic filters
    searchParams.forEach((value, key) => {
      if (
        !["search", "limit", "page", "min_price", "max_price"].includes(key)
      ) {
        if (key === "brands") {
          whereClause.AND.push({
            product: {
              brand: {
                name: { equals: value, mode: "insensitive" },
              },
            },
          });
        } else if (
          [
            "material",
            "color",
            "shape",
            "unit",
            "warranty",
            "guarantee",
          ].includes(key)
        ) {
          whereClause.AND.push({
            product: {
              [key]: { equals: value, mode: "insensitive" },
            },
          });
        } else if (
          ["width", "height", "length", "weight", "volume"].includes(key)
        ) {
          whereClause.AND.push({
            product: {
              [key]: { equals: parseFloat(value) },
            },
          });
        } else {
          // Handle custom fields from product templates
          whereClause.AND.push({
            product: {
              productTemplate: {
                fields: {
                  some: {
                    templateField: {
                      fieldName: key,
                    },
                    fieldValue: { equals: value, mode: "insensitive" },
                  },
                },
              },
            },
          });
        }
      }
    });

    // Rest of the function remains the same
    const [inventoryItems, totalCount] = await Promise.all([
      prisma.inventory.findMany({
        where: whereClause,
        orderBy: {
          product: {
            name: "asc",
          },
        },
        include: {
          product: true,
        },
        take: limit,
        skip: skip,
      }),
      prisma.inventory.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      success: true,
      message: "Inventory items fetched successfully",
      data: inventoryItems,
      pagination: {
        page,
        limit,
        totalCount,
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
        data: null,
      },
      { status: 500 }
    );
  }
}
