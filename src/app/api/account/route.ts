import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get authenticated session using Next-Auth
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user with relations
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        orders: {
          orderBy: {
            createdAt: "desc",
          },
          take: 2, // Get only 2 most recent orders
          include: {
            orderItems: true,
          },
        },
        addresses: true,
        wishlist: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Format response data
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      stats: {
        orders: user.orders.length,
        wishlist: user.wishlist.length,
        addresses: user.addresses.length,
      },
      recentOrders: user.orders.map((order) => ({
        id: order.orderNumber,
        date: order.createdAt,
        status: order.orderStatus,
        total: order.totalPrice,
      })),
    };

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Error fetching account data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching account data",
      },
      { status: 500 }
    );
  }
}
