import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { delay } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);

  // await delay(10000);

  try {
    const skip = (page - 1) * limit;

    const [brands, totalCount] = await Promise.all([
      prisma.brand.findMany({
        where: search
          ? {
              name: {
                contains: search,
                mode: "insensitive",
              },
            }
          : undefined,
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: { products: true },
          },
        },
        take: limit,
        skip: skip,
      }),
      prisma.brand.count({
        where: search
          ? {
              name: {
                contains: search,
                mode: "insensitive",
              },
            }
          : undefined,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      success: true,
      message: "Brands fetched successfully",
      data: brands.map((brand) => ({
        id: brand.id,
        name: brand.name,
        count: brand._count.products,
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching brands",
        data: null,
      },
      { status: 500 }
    );
  }
}
