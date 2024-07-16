"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FormInputType } from "./new/page";
export async function createBrand(data: FormInputType) {
  try {
    const createBrand = await prisma.brand.create({
      data: {
        name: data.brandName,
        website: data.website,
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

export async function getBrandById(brandId: string) {
  try {
    const brand = await prisma.brand.findUnique({
      where: {
        id: brandId,
      },
    });

    if (!brand) {
      throw new Error("Brand not found");
    }

    return brand;
  } catch (error) {
    console.error("Error fetching brand:", error);
    throw new Error("Failed to fetch brand");
  }
}

export async function updateBrandById(brandId: string, data: FormInputType) {
  try {
    const updatedbrand = await prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        name: data?.brandName,
      },
    });

    revalidatePath("/admin/brands");
    return {
      message: "Brand Updated successfully!",
      data: updatedbrand,
      success: true,
    };
  } catch (error) {
    console.error("Error updating brand:", error);
    return {
      message: "An error occurred while updating the brand.",
      success: false,
    };
  }
}
