// app/api/products/recently-viewed/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteParams = Promise<{
  product_id: string;
}>;

export async function GET(req: Request, { params }: { params: RouteParams }) {
  try {
    // Get productIds from searchParams
    const { searchParams } = new URL(req.url);
    const productIds = searchParams.get("ids")?.split(",") || [];

    if (productIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No product IDs provided",
          data: [],
        },
        { status: 400 }
      );
    }

    const inventoryItems = await prisma.inventory.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
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
      take: 10, // Limit to 4 products
    });

    // Maintain the original order from productIds
    const sortedInventoryItems = productIds
      .map((id) => inventoryItems.find((item) => item.id === id))
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      message: "Recently viewed products retrieved successfully",
      data: sortedInventoryItems,
    });
  } catch (error) {
    console.error("Error fetching recently viewed products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch recently viewed products",
        data: [],
      },
      { status: 500 }
    );
  }
}
