import { NextRequest, NextResponse } from "next/server";
import { CategoryType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Enhanced query schema to include parent category filters
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  page_size: z.coerce.number().min(1).default(10),
  sort_by: z.enum(["name", "createdAt"]).optional().default("createdAt"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
  filter_type: z.nativeEnum(CategoryType).optional().nullable(),
  search: z.string().optional().nullable(),
  primary_category_id: z.string().optional().nullable(),
  secondary_category_id: z.string().optional().nullable(),
  tertiary_category_id: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse and validate query parameters
    const validatedParams = querySchema.parse({
      page: searchParams.get("page"),
      page_size: searchParams.get("page_size"),
      sort_by: searchParams.get("sort_by") || undefined,
      sort_order: searchParams.get("sort_order") || undefined,
      filter_type: searchParams.get("filter_type"),
      search: searchParams.get("search"),
      primary_category_id: searchParams.get("primary_category_id"),
      secondary_category_id: searchParams.get("secondary_category_id"),
      tertiary_category_id: searchParams.get("tertiary_category_id"),
    });

    const {
      page,
      page_size,
      sort_by,
      sort_order,
      filter_type,
      search,
      primary_category_id,
      secondary_category_id,
      tertiary_category_id,
    } = validatedParams;

    const skip = (page - 1) * page_size;

    // Build the base where clause
    const where: {
      type?: CategoryType;
      AND?: any[];
      OR?: {
        [key: string]: any;
      }[];
    } = {};

    // Initialize AND array for combining conditions
    const andConditions = [];

    // Add type filter if provided
    if (filter_type) {
      andConditions.push({ type: filter_type });
    }

    // Add parent category filters if provided
    if (primary_category_id) {
      andConditions.push({ parentPrimaryCategoryId: primary_category_id });
    }

    if (secondary_category_id) {
      andConditions.push({ parentSecondaryCategoryId: secondary_category_id });
    }

    if (tertiary_category_id) {
      andConditions.push({ parentTertiaryCategoryId: tertiary_category_id });
    }

    // Add search condition if provided
    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          {
            parentPrimaryCategory: {
              name: { contains: search, mode: "insensitive" },
            },
          },
          {
            parentSecondaryCategory: {
              name: { contains: search, mode: "insensitive" },
            },
          },
          {
            parentTertiaryCategory: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        ],
      });
    }

    // Add AND conditions to where clause if there are any
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Execute queries in parallel
    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        include: {
          parentPrimaryCategory: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          parentSecondaryCategory: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          parentTertiaryCategory: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          _count: {
            select: {
              primaryProducts: true,
              secondaryProducts: true,
              tertiaryProducts: true,
              quaternaryProducts: true,
              primaryChildCategories: true,
              secondaryChildCategories: true,
              tertiaryChildCategories: true,
            },
          },
        },
        where,
        orderBy: {
          [sort_by]: sort_order,
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
          pageSize: page_size,
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
