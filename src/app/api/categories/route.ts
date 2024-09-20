import { NextRequest, NextResponse } from "next/server";
import { CategoryType } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get("type") as CategoryType;
  const parentId = searchParams.get("parentId");

  if (!type) {
    return NextResponse.json(
      {
        success: false,
        message: "Category type is required",
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    let categories;

    switch (type) {
      case "PRIMARY":
        categories = await prisma.category.findMany({
          where: { type: "PRIMARY" },
          orderBy: { name: "asc" },
        });
        break;

      case "SECONDARY":
        categories = await prisma.category.findMany({
          where: {
            type: "SECONDARY",
            parentPrimaryCategoryId: parentId,
          },
          orderBy: { name: "asc" },
        });
        break;

      case "TERTIARY":
        categories = await prisma.category.findMany({
          where: {
            type: "TERTIARY",
            parentSecondaryCategoryId: parentId,
          },
          orderBy: { name: "asc" },
        });
        break;

      case "QUATERNARY":
        categories = await prisma.category.findMany({
          where: {
            type: "QUATERNARY",
            parentTertiaryCategoryId: parentId,
          },
          orderBy: { name: "asc" },
        });
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid category type",
            data: null,
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching categories",
        data: null,
      },
      { status: 500 }
    );
  }
}
