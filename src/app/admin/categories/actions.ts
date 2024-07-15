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
        parentId:"clyjujnp8000311qgakv70hqs",
        image: {
          create: {
            url: "https://images.unsplash.com/photo-1565103446317-476a2b789651?q=80&w=2897&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
             description:"Category  image 1"
          }
        }
       
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

export async function getAllCategories(page = 1) {
  const PAGE_SIZE = 4;
  

  try {
   
    const categories = await prisma.category.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        parentCategory: true,
        image: true
      }
    });
    revalidatePath(`admin/categories?page${page}`);

    // Get the total count of categories to calculate the total number of pages
    const totalCategories = await prisma.category.count();
    const totalPages = Math.ceil(totalCategories / PAGE_SIZE);
    const currentPage = Math.min(Math.max(page,1), totalPages);
    return {
      categories,
      totalPages,
      currentPage,
    };
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
