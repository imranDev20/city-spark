"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FormInputType } from "./new/page";
import { unstable_cache as cache } from "next/cache";

export async function createTemplate(data: FormInputType) {
  try {
    const createTemplate = await prisma.template.create({
      data: {
        name: data.name,
        description: data.description,
        fields: {
          create: data.fields.map((item) => ({
            fieldName: item.fieldName,
            fieldType: item.fieldType,
            fieldValue: item.fieldValue || "",
          })),
        },
      },
    });

    revalidatePath("/admin/templates");
    revalidatePath("/admin/products");
    revalidatePath("/admin/products/[product_id]", "page");

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
    const templates = await prisma.template.findMany({
      include: {},
    });
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

export const getTemplateById = cache(async (templateId: string) => {
  if (!templateId) {
    console.error("No template Id");
    return null;
  }

  try {
    const template = await prisma.template.findUnique({
      where: {
        id: templateId,
      },
      include: {
        fields: true,
      },
    });

    return template;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw new Error("Failed to fetch templates");
  }
});

export async function updateTemplate(templateId: string, data: FormInputType) {
  console.log(data.fields);

  try {
    const updatedTemplate = await prisma.template.update({
      where: {
        id: templateId,
      },
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        fields: {
          deleteMany: {}, // This will delete all existing fields
          create: data.fields.map((field) => ({
            fieldName: field.fieldName,
            fieldType: field.fieldType,
            fieldOptions: field.fieldOptions,
            fieldValue: field.fieldValue,
          })),
        },
      },
    });

    console.log(updatedTemplate);

    revalidatePath("/admin/templates");
    revalidatePath(`/admin/templates/${updatedTemplate.id}`);
    revalidatePath("/admin/products/[product_id]", "page");

    return {
      message: "Template updated successfully!",
      data: updatedTemplate,
      success: true,
    };
  } catch (error) {
    console.error("Error updating template:", error);
    return {
      message: "An error occurred while updating the template.",
      success: false,
    };
  }
}
