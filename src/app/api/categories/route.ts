import { NextRequest, NextResponse } from "next/server";
import { CategoryType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).default(10),
  sortBy: z.enum(["name", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  filterType: z.nativeEnum(CategoryType).optional(),
  searchTerm: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse and validate query parameters
    const validatedParams = querySchema.parse({
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      sortBy: searchParams.get("sortBy"),
      sortOrder: searchParams.get("sortOrder"),
      filterType: searchParams.get("filterType"),
      searchTerm: searchParams.get("searchTerm"),
    });

    const { page, pageSize, sortBy, sortOrder, filterType, searchTerm } =
      validatedParams;
    const skip = (page - 1) * pageSize;

    // Build where clause
    let where: any = {};

    if (filterType) {
      where.type = filterType;
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        {
          parentPrimaryCategory: {
            name: { contains: searchTerm, mode: "insensitive" },
          },
        },
        {
          parentSecondaryCategory: {
            name: { contains: searchTerm, mode: "insensitive" },
          },
        },
        {
          parentTertiaryCategory: {
            name: { contains: searchTerm, mode: "insensitive" },
          },
        },
      ];
    }

    // Execute queries in parallel
    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        include: {
          parentPrimaryCategory: true,
          parentSecondaryCategory: true,
          parentTertiaryCategory: true,
        },
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: pageSize,
      }),
      prisma.category.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      status: "success",
      data: {
        categories,
        pagination: {
          currentPage: page,
          totalPages,
          pageSize,
          totalCount,
        },
      },
    });
  } catch (error) {
    console.error("Error in categories API:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid request parameters",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
