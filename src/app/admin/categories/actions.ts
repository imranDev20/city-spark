"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unstable_cache as cache } from "next/cache";
import { CategoryFormInputType, CategoryType } from "./schema";

// Fetch parent categories
export const getParentCategories = cache(async (categoryType: CategoryType) => {
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
});

// Create a new category
export async function createCategory(data: CategoryFormInputType) {
  try {
    const createdCategory = await prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
        parentId: data.parentCategory || null,
        image: data.image,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/categories/new");
    revalidatePath(`/admin/categories/${createdCategory.id}`);
    revalidatePath("/admin/categories/[category_id]", "page");

    return {
      message: "Category created successfully!",
      data: createdCategory,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message:
        "An error occurred while creating the category. Please try again later.",
      success: false,
    };
  }
}

// Fetch categories with caching
export const getCategories = cache(async () => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parentCategory: true,
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories. Please try again later.");
  }
});

// Fetch a category by ID
export const getCategoryById = cache(async (categoryId: string) => {
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
    throw new Error("Failed to fetch category. Please try again later.");
  }
});

// Update a category
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
        image: data.image,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/categories/new");
    revalidatePath(`/admin/categories/${updatedCategory.id}`);
    revalidatePath("/admin/categories/[category_id]", "page");

    return {
      message: "Category updated successfully!",
      data: updatedCategory,
      success: true,
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      message:
        "An error occurred while updating the category. Please try again later.",
      success: false,
    };
  }
}

export async function deleteCategory(categoryId: string) {
  if (!categoryId) {
    return null;
  }

  try {
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return {
      message: "Category deleted successfully!",
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message:
        "An error occurred while deleting the category. Please try again later.",
      success: false,
    };
  }
}
