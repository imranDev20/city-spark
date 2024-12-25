import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteParams = Promise<{
  user_id: string;
}>;

export async function GET(req: Request, { params }: { params: RouteParams }) {
  try {
    const resolvedParams = await params;

    if (!resolvedParams.user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: resolvedParams.user_id,
      },
      include: {
        // Include all relevant relations
        orders: {
          include: {
            orderItems: {
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
            cart: {
              include: {
                cartItems: {
                  include: {
                    inventory: {
                      include: {
                        product: true,
                      },
                    },
                  },
                },
                promoCode: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        wishlist: {
          include: {
            brand: true,
            inventory: true,
            primaryCategory: true,
            secondaryCategory: true,
            tertiaryCategory: true,
            quaternaryCategory: true,
          },
        },
        addresses: true,
        accounts: {
          select: {
            provider: true,
            providerAccountId: true,
            type: true,
            expires_at: true,
          },
        },
        sessions: {
          select: {
            expires: true,
            sessionToken: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Remove sensitive information
    const sanitizedUser = {
      ...user,
      password: undefined,
      accounts: user.accounts.map((account) => ({
        ...account,
        access_token: undefined,
        refresh_token: undefined,
        id_token: undefined,
      })),
      sessions: user.sessions.map((session) => ({
        expires: session.expires,
      })),
    };

    return NextResponse.json({
      success: true,
      data: sanitizedUser,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
