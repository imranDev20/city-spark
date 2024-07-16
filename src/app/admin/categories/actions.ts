"use server";

import prisma from "@/lib/prisma";

import { revalidatePath } from "next/cache";
import { CategoryFormInputType } from "./schema";
import { CategoryType, Prisma } from "@prisma/client";

export async function getParentCategories(categoryType: CategoryType) {
  let parentCategoryType: CategoryType | null = null;

  if (!categoryType) {
    return null;
  }

  try {
    switch (categoryType) {
      case "PRIMARY":
        return null;
      case "SECONDARY":
        parentCategoryType = "PRIMARY";
        break;
      case "TERTIARY":
        parentCategoryType = "SECONDARY";
        break;
      case "QUATERNARY":
        parentCategoryType = "TERTIARY";
        break;

      default:
        throw new Error(`Invalid category type: ${categoryType}`);
    }

    const categories = await prisma.category.findMany({
      where: {
        type: parentCategoryType,
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching parent categories:", error);
    throw new Error(
      "An error occurred while fetching parent categories. Please try again later."
    );
  }
}
export type FormState = {
  message: string;
};

export async function createCategory(data: CategoryFormInputType) {
  try {
    const createdCategory = await prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
        parentId: data.parentCategory || null,
        image: {
          create: {
            url: "https://images.unsplash.com/photo-1565103446317-476a2b789651?q=80&w=2897&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description: "Category  image 1",
          },
        },
      },
    });

    revalidatePath("/admin/categories");
    return {
      message: "Category created successfully!",
      data: createdCategory,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "An error occurred while creating the category.",
      success: false,
    };
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parentCategory: true,
        image: true,
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    if (!categoryId) {
      return {
        message: "Category ID is required",
        success: false,
      };
    }

    // Check if there are any products in this category
    const productsCount = await prisma.product.count({
      where: {
        categoryId: categoryId,
      },
    });

    if (productsCount > 0) {
      return {
        message:
          "Cannot delete category. It contains products that must be removed or reassigned first.",
        success: false,
      };
    }

    // If no products are associated, proceed with deletion
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    revalidatePath("/admin/categories");

    return {
      message: "Category deleted successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return {
          message:
            "Cannot delete this category as it is still referenced by existing products. Please remove or reassign all products from this category before deleting it.",
          success: false,
        };
      }
    }
    return {
      message:
        "An unexpected error occurred while deleting the category. Please try again later.",
      success: false,
    };
  }
}

export async function getCategoryById(categoryId: string) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        parentCategory: true,
      },
    });

    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error("Failed to fetch category");
  }
}

export async function updateCategory(
  categoryId: string,
  data: CategoryFormInputType
) {
  try {
    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: data.name,
        type: data.type,
        parentId: data.parentCategory || null,
      },
    });

    revalidatePath("/admin/categories");

    return {
      message: "Category updated successfully!",
      data: updatedCategory,
      success: true,
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      message: "An error occurred while updating the category.",
      success: false,
    };
  }
}
