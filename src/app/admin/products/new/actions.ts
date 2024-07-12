"use server";

import prisma from "@/lib/prisma";
import { productSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: { images: true },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export type FormState = {
  message: string;
};

export async function createProduct(previousState: FormState, data: FormData) {
  try {
    const formData = Object.fromEntries(data);

    const parsedData = {
      ...formData,
      tradePrice: Number(formData.tradePrice),
      contractPrice: Number(formData.contractPrice),
      promotionalPrice: Number(formData.promotionalPrice),
      weight: Number(formData.weight),
      height: Number(formData.height),
      width: Number(formData.width),
      length: Number(formData.length),
      brand: Number(formData.brand),
    };

    const validationResult = productSchema.safeParse(parsedData);

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

    const { brand } = validationResult.data;

    const newProduct = await prisma.product.create({
      data: {
        name: "Sample Product",
        description: "This is a sample product.",
        tradePrice: 100.0,
        contractPrice: 90.0,
        promotionalPrice: 80.0,
        unitOfMeasurement: "kg",
        weight: 1.5,
        length: 10.0,
        width: 5.0,
        height: 2.0,
        brandId: brand || 1, //change later, don't use default 1
        features: {
          createMany: {
            data: [
              {
                name: "Some feature 1",
              },
              {
                name: "Some feature 2",
              },
            ],
          },
        },
        images: {
          createMany: {
            data: [
              {
                url: "https://images.unsplash.com/photo-1720582760044-c4d220f09305?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
              {
                url: "https://images.unsplash.com/photo-1720582760044-c4d220f09305?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
            ],
          },
        },
      },
    });

    revalidatePath("/admin/products");

    return {
      message: "Products created successfully!",
      data: newProduct,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "An error occurred while creating the product.",
      success: false,
    };
  }
}
