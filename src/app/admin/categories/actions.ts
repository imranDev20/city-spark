"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unstable_cache as cache } from "next/cache";
import { CategoryFormInputType, CategoryType } from "./schema";
import { backendClient } from "@/lib/edgestore-server";

// Fetch parent categories
export const getParentCategories = cache(async (categoryType: CategoryType) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        type: categoryType,
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
        parentPrimaryCategoryId: data.parentPrimaryCategory || null,
        parentSecondaryCategoryId: data.parentSecondaryCategory || null,
        parentTertiaryCategoryId: data.parentTertiaryCategory || null,
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
        parentPrimaryCategory: true,
        parentSecondaryCategory: true,
        parentTertiaryCategory: true,
      },
      orderBy: {
        createdAt: "desc",
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
        parentPrimaryCategory: true,
        parentSecondaryCategory: true,
        parentTertiaryCategory: true,
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
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (existingCategory?.image && existingCategory?.image !== data.image) {
      await backendClient.publicImages.deleteFile({
        url: existingCategory?.image,
      });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: data.name,
        type: data.type,
        parentPrimaryCategoryId: data.parentPrimaryCategory || null,
        parentSecondaryCategoryId: data.parentSecondaryCategory || null,
        parentTertiaryCategoryId: data.parentTertiaryCategory || null,
        image: data.image,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/categories/new");
    revalidatePath(`/admin/categories/${updatedCategory.id}`);
    revalidatePath("/admin/categories/[category_id]", "page");
    revalidatePath("/admin/products/[product_id]", "page");

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
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (existingCategory?.image) {
      await backendClient.publicImages.deleteFile({
        url: existingCategory?.image,
      });
    }

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/categories/new");
    revalidatePath(`/admin/categories/${categoryId}`);
    revalidatePath("/admin/categories/[category_id]", "page");
    revalidatePath("/admin/products/[product_id]", "page");

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
