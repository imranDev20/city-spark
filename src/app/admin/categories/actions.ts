"use server";

import prisma from "@/lib/prisma";

import { revalidatePath } from "next/cache";
import { categorySchema } from "./schema";
import { CategoryFormInputType } from "./new/page";

type CategoryType = "PRIMARY" | "SECONDARY" | "TERTIARY" | "QUATERNARY";

export async function getParentCategories(categoryType: CategoryType) {
  try {
    console.log(`categoryType`, categoryType);
    if (categoryType == "PRIMARY") {
      throw new Error("Failed to fetch categoryies");
    }
    if (categoryType == "SECONDARY") {
      categoryType = "PRIMARY";
    } else if (categoryType == "TERTIARY") {
      categoryType = "SECONDARY";
    } else if (categoryType == "QUATERNARY") {
      categoryType = "TERTIARY";
    }
    const category = await prisma.category.findMany({
      where: {
        type: categoryType,
      },
    });

    return category;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
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
        type:"SECONDARY",
        // images: data.images ?? '',
        parentId:"clyjujnp8000311qgakv70hqs",
      },
    });
    console.log(`createdCategory`, createdCategory);
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

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({

      include: {
        parentCategory:true,
        
      }
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

    // Delete the product
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
    return {
      message: "An error occurred while deleting the category.",
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
        parentCategory:true,
      }
     
    });
   
    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error("Failed to fetch category");
  }
}
export async function updateCategoryById(categoryId: string, data: CategoryFormInputType) {
  try {
    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: data.name,
        type: 'SECONDARY',
        parentId: 'clyjujnp8000311qgakv70hqs'
        
      },
    });

    revalidatePath("/admin/categories");
    return {
      message: "Category created successfully!",
      data: category,
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
