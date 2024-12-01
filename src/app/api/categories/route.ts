import { NextRequest, NextResponse } from "next/server";
import { CategoryType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Define the query parameter schema with proper optional handling
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  page_size: z.coerce.number().min(1).default(10),
  sortBy: z.enum(["name", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  filterType: z.nativeEnum(CategoryType).optional().nullable(),
  searchTerm: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse and validate query parameters with null handling
    const validatedParams = querySchema.parse({
      page: searchParams.get("page"),
      page_size: searchParams.get("page_size"),
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
      filterType: searchParams.get("filterType"),
      searchTerm: searchParams.get("searchTerm"),
    });

    const { page, page_size, sortBy, sortOrder, filterType, searchTerm } =
      validatedParams;
    const skip = (page - 1) * page_size;

    // Build where clause with type safety
    const where: {
      type?: CategoryType;
      OR?: {
        [key: string]: any;
      }[];
    } = {};

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

    // Execute queries in parallel with proper typing
    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        include: {
          parentPrimaryCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          parentSecondaryCategory: {
            select: {
              id: true,
              name: true,
            },
          },
          parentTertiaryCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: page_size,
      }),
      prisma.category.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / page_size);

    return NextResponse.json({
      status: "success",
      data: {
        categories,
        pagination: {
          currentPage: page,
          totalPages,
          page_size,
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
