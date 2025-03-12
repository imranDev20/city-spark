// app/api/wishlist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Get the current authenticated user's session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Fetch user's wishlist inventory items with related product details
    const wishlistInventoryItems = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        wishlistInventory: {
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
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Wishlist retrieved successfully",
      data: wishlistInventoryItems?.wishlistInventory || [],
    });
  } catch (error) {
    console.error("Error retrieving wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while retrieving the wishlist",
      },
      { status: 500 }
    );
  }
}
