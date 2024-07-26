"use server";

import prisma from "@/lib/prisma";
import { unstable_cache as cache, revalidatePath } from "next/cache";
import { FormInputType } from "./new/page";

export async function createTemplate(data: FormInputType) {
  try {
    const createTemplate = await prisma.template.create({
      data: {
        name: data.name,
        description: data.description,
        fields: {
          create: [
            {
              fieldName: "Sample Field Name",
              fieldType: "TEXT",
              fieldValues: null,
            },
            {
              fieldName: "Sample field 2",
              fieldType: "SELECT",
              fieldOptions: "Option1, option2, option 3",
              fieldValues: "Option 1",
            },
          ],
        },
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

export const getTemplates = cache(async () => {
  try {
    const templates = await prisma.template.findMany({});

    return templates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw new Error("Failed to fetch templates");
  }
});

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

export async function updateTemplateById(
  templateId: string,
  data: FormInputType
) {
  try {
    const updatedtemplate = await prisma.template.update({
      where: {
        id: templateId,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    revalidatePath("/admin/templates");
    return {
      message: "Templates Updated successfully!",
      data: updatedtemplate,
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
