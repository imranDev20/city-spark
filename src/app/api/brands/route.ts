import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search");

  try {
    const brands = await prisma.brand.findMany({
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
    });

    return NextResponse.json({
      success: true,
      message: "Brands fetched successfully",
      data: brands,
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
