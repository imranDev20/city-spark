import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Status, Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("page_size") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sort_by") || "updatedAt";
    const sortOrder = (searchParams.get("sort_order") ||
      "desc") as Prisma.SortOrder;
    const filterStatus = searchParams.get("filter_status") as Status | null;

    // Category filters
    const primaryCategoryId = searchParams.get("primary_category_id");
    const secondaryCategoryId = searchParams.get("secondary_category_id");
    const tertiaryCategoryId = searchParams.get("tertiary_category_id");
    const quaternaryCategoryId = searchParams.get("quaternary_category_id");

    // Get the main product search term
    const productSearch = searchParams.get("product_search") || "";

    // Build product where clause for filtering
    const productWhereClause: Prisma.ProductWhereInput = {
      ...(primaryCategoryId ? { primaryCategoryId } : {}),
      ...(secondaryCategoryId ? { secondaryCategoryId } : {}),
      ...(tertiaryCategoryId ? { tertiaryCategoryId } : {}),
      ...(quaternaryCategoryId ? { quaternaryCategoryId } : {}),
      // Add product search filter
      ...(productSearch
        ? {
            OR: [
              { name: { contains: productSearch, mode: "insensitive" } },
              { description: { contains: productSearch, mode: "insensitive" } },
              {
                brand: {
                  name: { contains: productSearch, mode: "insensitive" },
                },
              },
            ],
          }
        : {}),
    };

    // Build brand where clause
    const where: Prisma.BrandWhereInput = {
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      ...(filterStatus ? { status: filterStatus } : {}),
      ...(Object.keys(productWhereClause).length > 0
        ? { products: { some: productWhereClause } }
        : {}),
    };

    // Execute queries
    const [totalCount, brands] = await Promise.all([
      prisma.brand.count({ where }),
      prisma.brand.findMany({
        where,
        select: {
          id: true,
          name: true,
          updatedAt: true,
          description: true,
          status: true,
          image: true,
          _count: {
            select: {
              products: {
                where: productWhereClause,
              },
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      data: brands,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasMore: page * pageSize < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
