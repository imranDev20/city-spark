import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    // console.log("Received search params:", Object.fromEntries(searchParams));

    // Extract and validate query parameters
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("page_size") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const sortBy = searchParams.get("sort_by") || "createdAt";
    const sortOrder = (searchParams.get("sort_order") || "desc") as
      | "asc"
      | "desc";
    const role = searchParams.get("role");

    const skip = (page - 1) * limit;
    console.log("Pagination params:", { page, limit, skip });

    // Build where clause based on search and filters
    let whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      whereClause.role = role;
    }

    console.log("Where clause:", JSON.stringify(whereClause, null, 2));

    // Get total count and users in parallel
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where: whereClause,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          orders: {
            select: {
              id: true,
              orderNumber: true,
              createdAt: true,
              orderStatus: true,
            },
          },
          addresses: true,
          carts: {
            select: {
              id: true,
              totalPriceWithVat: true,
              createdAt: true,
            },
          },
          wishlistInventory: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
      }),
      prisma.user.count({
        where: whereClause,
      }),
    ]);

    console.log("Query results:", {
      usersFound: users.length,
      totalCount: total,
      currentPage: page,
    });

    // Calculate pagination
    const totalPages = Math.ceil(total / limit);
    const hasMore = page * limit < total;

    // Structure the response
    const response = {
      success: true,
      message: "Users fetched successfully",
      data: {
        users,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalCount: total,
          totalPages,
          hasMore,
        },
      },
    };

    console.log("Response pagination:", response.data.pagination);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching users:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching users",
        data: {
          users: [],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            totalPages: 0,
            hasMore: false,
          },
        },
      },
      { status: 500 }
    );
  }
}
