"use server";

import prisma from "@/lib/prisma";

import { revalidatePath } from "next/cache";
import { categorySchema } from "./schema";

type categoryType = "PRIMARY"|"SECONDARY" | "TERTIARY" | "QUATERNARY";

export async function getCategory(categoryType: categoryType) {
  try {
    if(categoryType == 'PRIMARY') {
      throw new Error("Failed to fetch categoryies");
    }
    if(categoryType == 'SECONDARY') {
      categoryType = 'PRIMARY';
    }
    else if(categoryType == 'TERTIARY') {
      categoryType = 'SECONDARY';
    } else if(categoryType == 'QUATERNARY') {
      categoryType = 'TERTIARY';
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

export async function createCategory(previousState: FormState, data: FormData) {
  try {
    const formData = Object.fromEntries(data);
    console.log(`formData`, formData);

    const parsedData = {
      ...formData,
      name: formData.name,
      type: formData.type,
      images: formData.images,
      parentId: Number(formData.parentCategory),    
    };

    const validationResult = categorySchema.safeParse(parsedData);

    // If validation fails, return the error messages
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((err) => err.message)
        .join(", ");
      return {
        message: `Validation failed: ${errorMessages}`,
        success: false,
      };
    }

    // const createdCategory = await prisma.category.create({
    //   name: formData.name,
    //   type: formData.type,
    //   images: formData.images,
    //   parentId: Number(formData.parentCategory)
    // });

    revalidatePath("/admin/categories");

    return {
      message: "Category created successfully!",
      // data: createdCategory,
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
