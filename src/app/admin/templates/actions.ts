"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FormInputType } from "./new/page";

export async function createTemplate(data: FormInputType) {
  try {
    const createTemplate = await prisma.template.create({
      data: {
        name: "Sample Template",
        description: "This is a sample template description.",
        fields: [
          { fieldName: "sample", fieldType: "sample", fieldValue: "sample" },
        ],
      },
    });
    console.log(createTemplate);

    revalidatePath("/admin/templates");

    return {
      message: "Template created successfully!",
      data: createTemplate,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "An error occurred while creating the template.",
      success: false,
    };
  }
}

export async function getTemplates() {
  try {
    const templates = await prisma.template.findMany({});
    return templates;
  } catch (error) {
    console.error("Error fetching template:", error);
    throw new Error("Failed to fetch template");
  }
}

export async function deleteTemplate(templateId: string) {
  try {
    if (!templateId) {
      return {
        message: "Template ID is required",
        success: false,
      };
    }

    await prisma.template.delete({
      where: {
        id: templateId,
      },
    });

    revalidatePath("/admin/templates");

    return {
      message: "Template deleted successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting template:", error);
    return {
      message: "An error occurred while deleting the template.",
      success: false,
    };
  }
}