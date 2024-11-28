import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session-id";
import { Prisma } from "@prisma/client";

type CartItemWithRelations = Prisma.CartItemGetPayload<{
  include: {
    inventory: {
      include: {
        product: {
          include: {
            brand: {
              select: {
                name: true;
              };
            };
          };
        };
      };
    };
  };
}>;

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
};

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse<CartItemWithRelations[]>>> {
  try {
    const session = await getServerAuthSession();
    const sessionId = getOrCreateSessionId();

    const cart = await prisma.cart.findFirst({
      where: session?.user?.id
        ? { userId: session.user.id }
        : { sessionId: sessionId },
      include: {
        cartItems: {
          include: {
            inventory: {
              include: {
                product: {
                  include: {
                    brand: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      data: cart.cartItems,
    });
  } catch (error) {
    console.error("Cart fetch error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Database error occurred",
            code: error.code,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}
