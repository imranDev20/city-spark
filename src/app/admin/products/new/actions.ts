"use server";

import prisma from "@/lib/prisma";
import { productSchema } from "./schema";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
      },
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

    const createdProduct = await prisma.product.create({
      data: {
        name: "Sample Product",
        description: "This is a sample product description.",
        model: "ABC123",
        type: "Electronics",
        warranty: "1 year",
        guarantee: "30 days",
        tradePrice: 299.99,
        contractPrice: 279.99,
        promotionalPrice: 259.99,
        unit: "pcs",
        weight: 1.5,
        color: "Black",
        length: 10.0,
        width: 5.0,
        height: 3.0,
        material: "Plastic",

        template: {
          connect: {
            id: "clyjswdsq0000nrkfwsxy3s0q",
          },
        },

        features: {
          create: [{ name: "Feature 1" }, { name: "Feature 2" }],
        },

        category: {
          connect: { id: "clyjb5z6z0003qhhhtywwiez8" }, // Replace with actual category ID
        },
        brand: {
          connect: { id: "clyjaoap30000daapsr8p341h" }, // Replace with actual brand ID
        },
        manuals: {
          set: ["manual1.pdf", "manual2.pdf"],
        },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1565103446317-476a2b789651?q=80&w=2897&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Example Unsplash image URL
              description: "Product Image 1",
            },
            {
              url: "https://images.unsplash.com/photo-1565103446317-476a2b789651?q=80&w=2897&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Example Unsplash image URL
              description: "Product Image 2",
            },
          ],
        },
      },
    });

    revalidatePath("/admin/products");

    return {
      message: "Products created successfully!",
      data: createdProduct,
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
