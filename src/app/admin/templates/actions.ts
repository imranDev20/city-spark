"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TemplateFormInputType } from "./schema";
import { Prisma, Status } from "@prisma/client";

export async function createTemplate(data: TemplateFormInputType) {
  try {
    const createTemplate = await prisma.template.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        fields: {
          create: data.fields.map((item) => ({
            fieldName: item.fieldName,
            fieldType: item.fieldType,
            fieldOptions: item.fieldOptions,
          })),
        },
      },
    });

    revalidatePath("/admin/templates");
    revalidatePath("/admin/products/[product_id]", "page");
    revalidatePath("/admin/products/new");

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

type GetTemplatesParams = {
  page?: number;
  page_size?: number;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  filterStatus?: Status;
  searchTerm?: string;
};

export const getTemplates = async ({
  page = 1,
  page_size = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
  filterStatus,
  searchTerm,
}: GetTemplatesParams = {}) => {
  try {
    const skip = (page - 1) * page_size;

    let whereClause: Prisma.TemplateWhereInput = {};

    if (filterStatus) {
      whereClause.status = filterStatus;
    }

    if (searchTerm) {
      whereClause.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    const [templates, totalCount] = await Promise.all([
      prisma.template.findMany({
        where: whereClause,
        skip,
        take: page_size,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.template.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / page_size);

    return {
      templates,
      pagination: {
        currentPage: page,
        page_size,
        totalCount,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw new Error("Failed to fetch templates");
  }
};

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
    revalidatePath("/admin/products/[product_id]", "page");
    revalidatePath("/admin/products");

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

export const getTemplateById = async (templateId: string) => {
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
};

export async function updateTemplate(
  templateId: string,
  data: TemplateFormInputType
) {
  try {
    // First, fetch the existing template with its fields
    const existingTemplate = await prisma.template.findUnique({
      where: { id: templateId },
      include: { fields: true },
    });

    if (!existingTemplate) {
      throw new Error("Template not found");
    }

    // Prepare arrays for update, create, and delete operations
    const fieldsToUpdate = [];
    const fieldsToCreate = [];
    const fieldIdsToKeep = new Set();

    // Categorize fields
    for (const field of data.fields) {
      if (field.fieldId) {
        fieldsToUpdate.push(field);
        fieldIdsToKeep.add(field.fieldId);
      } else {
        fieldsToCreate.push(field);
      }
    }

    // Identify fields to delete
    const fieldIdsToDelete = existingTemplate.fields
      .filter((field) => !fieldIdsToKeep.has(field.id))
      .map((field) => field.id);

    // Perform the update
    const updatedTemplate = await prisma.template.update({
      where: { id: templateId },
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        fields: {
          update: fieldsToUpdate.map((field) => ({
            where: { id: field.fieldId },
            data: {
              fieldName: field.fieldName,
              fieldType: field.fieldType,
              fieldOptions: field.fieldOptions,
            },
          })),
          create: fieldsToCreate,
          deleteMany: { id: { in: fieldIdsToDelete } },
        },
      },
      include: { fields: true },
    });

    revalidatePath("/admin/templates");
    revalidatePath(`/admin/templates/${updatedTemplate.id}`);
    revalidatePath("/admin/products/[product_id]", "page");
    revalidatePath("/admin/products/new");

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
