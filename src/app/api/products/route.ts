import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("page_size") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sort_by") || "createdAt";
    const sortOrder = (searchParams.get("sort_order") || "desc") as
      | "asc"
      | "desc";
    const filterStatus = searchParams.get("filter_status") as Status | null;

    // Get brand and category filters
    const brandId = searchParams.get("brand_id");
    const primaryCategoryId = searchParams.get("primary_category_id");
    const secondaryCategoryId = searchParams.get("secondary_category_id");
    const tertiaryCategoryId = searchParams.get("tertiary_category_id");
    const quaternaryCategoryId = searchParams.get("quaternary_category_id");

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Build base filters including categories and brand
    const baseFilters = {
      ...(primaryCategoryId && { primaryCategoryId }),
      ...(secondaryCategoryId && { secondaryCategoryId }),
      ...(tertiaryCategoryId && { tertiaryCategoryId }),
      ...(quaternaryCategoryId && { quaternaryCategoryId }),
      ...(brandId && { brandId }),
    };

    // Build the where clause for filtering
    const where = {
      AND: [
        baseFilters,
        filterStatus ? { status: filterStatus } : {},
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { brand: { name: { contains: search, mode: "insensitive" } } },
                {
                  primaryCategory: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
              ],
            }
          : {},
      ],
    };

    // Execute both count and findMany in parallel
    const [totalCount, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          status: true,
          images: true,
          retailPrice: true,
          promotionalPrice: true,
          createdAt: true,
          updatedAt: true,
          brand: {
            select: {
              id: true,
              name: true,
            },
          },
          primaryCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          secondaryCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          tertiaryCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          quaternaryCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: pageSize,
      }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
