"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductFormInputType } from "./new/page";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        brand: true,
      },
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductById(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        brand: true,
        features: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function createProduct(data: ProductFormInputType) {
  try {
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
            id: "clyjugd8l000011qghedzgbxo",
          },
        },

        features: {
          create: [{ name: "Feature 1" }, { name: "Feature 2" }],
        },

        category: {
          connect: { id: "clyjum3y5000511qgrq4szisu" }, // Replace with actual category ID
        },
        brand: {
          connect: { id: "clyjuid5c000111qgbiuuybyy" }, // Replace with actual brand ID
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

export async function deleteProduct(productId: string) {
  try {
    if (!productId) {
      return {
        message: "Product ID is required",
        success: false,
      };
    }

    // Delete the product
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    revalidatePath("/admin/products");

    return {
      message: "Product deleted successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      message: "An error occurred while deleting the product.",
      success: false,
    };
  }
}
