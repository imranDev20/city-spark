import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const templates = await prisma.template.findMany({
      include: {
        fields: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Templates fetched successfully",
      data: templates,
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching templates",
        data: null,
      },
      { status: 500 }
    );
  }
}
