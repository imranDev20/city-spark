import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { template_id: string } }
) {
  const { template_id } = params;

  if (!template_id) {
    return NextResponse.json(
      {
        success: false,
        message: "Template ID is required",
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    const template = await prisma.template.findUnique({
      where: {
        id: template_id,
      },
      include: {
        fields: true,
      },
    });

    if (!template) {
      return NextResponse.json(
        {
          success: false,
          message: "Template not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template fetched successfully",
      data: template,
    });
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching the template",
        data: null,
      },
      { status: 500 }
    );
  }
}
