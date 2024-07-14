"use server";

import prisma from "@/lib/prisma";

import { revalidatePath } from "next/cache";
import { categorySchema } from "./schema";
import { CategoryFormInputType } from "./new/page";

type CategoryType = "PRIMARY" | "SECONDARY" | "TERTIARY" | "QUATERNARY";

export async function getCategories(categoryType: CategoryType) {
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
