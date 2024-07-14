"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FormInputType } from "./new/page";
export async function createBrand(data: FormInputType) {
  try {
    const createBrand = await prisma.brand.create({
      data: {
        name: "sample brand",
        website: "sample brand website",
      },
    });
    console.log(createBrand);

    revalidatePath("/admin/brands");
    return {
      message: "Brands created successfully!",
      data: createBrand,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "An error occurred while creating the brand.",
      success: false,
    };
  }
}

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({});
    return brands;
  } catch (error) {
    console.error("Error fetching brand:", error);
    throw new Error("Failed to fetch brand");
  }
}

export async function deleteBrand(brandId: string) {
  try {
    if (!brandId) {
      return {
        message: "Brand ID is required",
        success: false,
      };
    }

    await prisma.brand.delete({
      where: {
        id: brandId,
      },
    });

    revalidatePath("/admin/brands");

    return {
      message: "Brand deleted successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting brand:", error);
    return {
      message: "An error occurred while deleting the Brand.",
      success: false,
    };
  }
}
