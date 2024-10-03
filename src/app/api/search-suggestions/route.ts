import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const searchSchema = z.object({
  term: z.string().trim().min(1).max(100).nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const term = searchParams.get("term");

    const validatedParams = searchSchema.safeParse({ term });

    if (!validatedParams.success) {
      return NextResponse.json(
        { error: "Invalid search term" },
        { status: 400 }
      );
    }

    const { term: validTerm } = validatedParams.data;

    let where: Prisma.InventoryWhereInput = {};

    if (validTerm) {
      where = {
        product: {
          OR: [
            { name: { contains: validTerm, mode: "insensitive" } },
            { description: { contains: validTerm, mode: "insensitive" } },
            { features: { has: validTerm } },
            {
              primaryCategory: {
                name: { contains: validTerm, mode: "insensitive" },
              },
            },
            {
              secondaryCategory: {
                name: { contains: validTerm, mode: "insensitive" },
              },
            },
            {
              tertiaryCategory: {
                name: { contains: validTerm, mode: "insensitive" },
              },
            },
            {
              quaternaryCategory: {
                name: { contains: validTerm, mode: "insensitive" },
              },
            },
          ],
        },
      };
    }

    const suggestions = await prisma.inventory.findMany({
      where,
      select: {
        id: true,
        product: {
          select: {
            name: true,
            images: true,
            tradePrice: true,
            features: true,
            primaryCategory: { select: { name: true } },
            secondaryCategory: { select: { name: true } },
            tertiaryCategory: { select: { name: true } },
            quaternaryCategory: { select: { name: true } },
          },
        },
      },
      take: 5,
    });

    return NextResponse.json({ suggestions: suggestions });
  } catch (error) {
    console.error("Error in search suggestions API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
