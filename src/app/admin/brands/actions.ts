"use server";

import prisma from "@/lib/prisma";
import { unstable_cache as cache, revalidatePath } from "next/cache";
import { FormInputType } from "./new/page";
export async function createBrand(data: FormInputType) {
  try {
    const createBrand = await prisma.brand.create({
      data: {
        name: data.brandName,
        website: data.website,
        description: data.description,
        status: data.status,
        // image : {
        //   create : data.images
        // }
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

export const getBrands = cache(async () => {
  try {
    const brands = await prisma.brand.findMany({});

    return brands;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw new Error("Failed to fetch brands");
  }
});

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

export const getBrandById = cache(async (brandId: string) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: {
        id: brandId,
      },
      include: {
        image: true,
      },
    });

    if (!brand) {
      throw new Error("brand not found");
    }

    return brand;
  } catch (error) {
    console.error("Error fetching brand:", error);
    throw new Error("Failed to fetch brand");
  }
});

export async function updateBrandById(brandId: string, data: FormInputType) {
  try {
    const updatedbrand = await prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        name: data?.brandName,
        description: data?.description,
        website: data?.website,
        status: data?.status,
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
