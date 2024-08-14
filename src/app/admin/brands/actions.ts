"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BrandFormInputType } from "./schema";
import { unstable_cache as cache } from "next/cache";
import { backendClient } from "@/lib/edgestore-server";

export async function createBrand(data: BrandFormInputType) {
  try {
    const createBrand = await prisma.brand.create({
      data: {
        name: data.brandName,
        website: data.website,
        description: data.description,
        image: data.image,
        countryOfOrigin: data.countryOfOrigin,
        status: data.status,
      },
    });

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
    const brands = await prisma.brand.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
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

    const deletedBrand = await prisma.brand.delete({
      where: {
        id: brandId,
      },
    });

    if (deletedBrand.image) {
      await backendClient.publicImages.deleteFile({
        url: deletedBrand.image,
      });
    }

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
    });

    if (!brand) {
      throw new Error("Brand not found");
    }

    return brand;
  } catch (error) {
    console.error("Error fetching brand:", error);
    throw new Error("Failed to fetch brand");
  }
});

export async function updateBrand(brandId: string, data: BrandFormInputType) {
  try {
    const existingBrand = await prisma.brand.findUnique({
      where: {
        id: brandId,
      },
    });

    if (existingBrand?.image && existingBrand.image !== data.image) {
      await backendClient.publicImages.deleteFile({
        url: existingBrand.image,
      });
    }

    const updatedbrand = await prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        name: data.brandName,
        description: data.description,
        image: data.image,
        status: data.status,
        website: data.website,
        countryOfOrigin: data.countryOfOrigin,
      },
    });

    revalidatePath("/admin/brands");
    revalidatePath(`/admin/brands/${updatedbrand.id}`);
    revalidatePath("/admin/products/[product_id]", "page");

    return {
      message: "Brand Updated Successfully!",
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
