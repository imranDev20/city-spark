import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const revalidate = 60;

type RouteParams = Promise<{
  order_id: string;
}>;

export async function GET(req: Request, { params }: { params: RouteParams }) {
  try {
    const resolvedParams = await params;

    if (!resolvedParams.order_id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    console.log(resolvedParams);

    const order = await prisma.order.findUnique({
      where: {
        id: resolvedParams.order_id,
      },
      include: {
        cart: {
          select: {
            subTotalWithVat: true,
            subTotalWithoutVat: true,
            vat: true,
            deliveryCharge: true,
            totalPriceWithVat: true,
            totalPriceWithoutVat: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
        timeline: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
