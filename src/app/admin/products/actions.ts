"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unstable_cache as cache } from "next/cache";
import { ProductFormInputType } from "./schema";
import { CategoryType, Category } from "@prisma/client";
import { redirect } from "next/navigation";

// Cached products for ssr in the list
export const getProducts = cache(async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        primaryCategory: true,
        brand: true,
      },
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
});

export const getBrands = cache(async () => {
  try {
    const brands = await prisma.brand.findMany({});
    return brands;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
});

export const getTemplates = cache(async () => {
  try {
    const templates = await prisma.template.findMany({
      include: {
        fields: true,
      },
    });
    return templates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw new Error("Failed to fetch templates");
  }
});

export const getTemplateById = cache(async (templateId: string) => {
  if (!templateId) {
    console.error("No template Id");
    return null;
  }

  try {
    const template = await prisma.template.findUnique({
      where: {
        id: templateId,
      },
      include: {
        fields: true,
      },
    });

    return template;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw new Error("Failed to fetch templates");
  }
});

export const getCategories = cache(
  async (categoryType: CategoryType, parentId?: string) => {
    try {
      let categories: Category[];

      switch (categoryType) {
        case "PRIMARY":
          categories = await prisma.category.findMany({
            where: {
              type: "PRIMARY",
            },
          });
          break;

        case "SECONDARY":
          categories = await prisma.category.findMany({
            where: {
              type: "SECONDARY",
              parentPrimaryCategoryId: parentId,
            },
          });
          break;

        case "TERTIARY":
          categories = await prisma.category.findMany({
            where: {
              type: "TERTIARY",
              parentSecondaryCategoryId: parentId,
            },
          });
          break;

        case "QUATERNARY":
          categories = await prisma.category.findMany({
            where: {
              type: "QUATERNARY",
              parentTertiaryCategoryId: parentId,
            },
          });

          break;

        default:
          console.error("Error fetching categories:");
          throw new Error("Failed to fetch categories");
          break;
      }

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  }
);

export const getProductById = cache(async (productId: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        brand: true,
        features: true,
        template: true,
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
});

export async function createProduct(data: ProductFormInputType) {
  try {
    console.log(`data`, data);
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
            id: "clykb82130000tc4yw0v2du0u",
          },
        },

        features: {
          create: [{ name: "Feature 1" }, { name: "Feature 2" }],
        },

        category: {
          connect: { id: "clyjum3y5000511qgrq4szisu" }, // Replace with actual category ID
        },
        brand: {
          connect: { id: "clylgt71m00009gvbup4hari6" }, // Replace with actual brand ID
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

export async function updateProduct(
  productId: string,
  data: ProductFormInputType
) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        model: data.model,
        type: data.type,
        warranty: data.warranty,
        guarantee: data.guarantee,
        tradePrice: data.tradePrice,
        contractPrice: data.contractPrice,
        promotionalPrice: data.promotionalPrice,
        unit: data.unit,
        weight: data.weight,
        color: data.color,
        length: data.length,
        width: data.width,
        height: data.height,
        material: data.material,
        status: data.status,
        template: data.template
          ? {
              connect: { id: data.template },
            }
          : undefined,

        features: {
          deleteMany: {}, // Clear existing features
          create:
            data.features?.map((feature) => ({ name: feature.feature })) || [],
        },

        brand: data.brand
          ? {
              connect: { id: data.brand },
            }
          : undefined,

        manuals: {
          set: data.manuals ?? [],
        },

        primaryCategory: data.primaryCategory
          ? {
              connect: { id: data.primaryCategory },
            }
          : undefined,

        secondaryCategory: data.secondaryCategory
          ? {
              connect: { id: data.secondaryCategory },
            }
          : undefined,

        tertiaryCategory: data.tertiaryCategory
          ? {
              connect: { id: data.tertiaryCategory },
            }
          : undefined,

        quaternaryCategory: data.quaternaryCategory
          ? {
              connect: { id: data.quaternaryCategory },
            }
          : undefined,

        // we can delete the current images from edgesotre
        // and at the same time delete it from db
        // then create new image urls

        images: {
          deleteMany: {}, // Clear existing images
          create:
            data.images?.map(({ image }, index) => ({
              url: image.url,
              description: `${data.name}-${index}`,
              name: image.name,
              size: image.size,
              lastModified: image.lastModified?.toString(),
              thumbnailUrl: image.thumbnailUrl,
              type: image.type,
            })) || [],
        },

        updatedAt: new Date(), // Ensures updatedAt is set to the current date and time
      },
    });

    if (data.templateFields) {
      await prisma.template.update({
        where: { id: data.template },
        data: {
          fields: {
            deleteMany: {}, // This will delete all existing fields
            create: data.templateFields.map((field) => ({
              fieldName: field.fieldName,
              fieldType: field.fieldType,
              fieldOptions: field.fieldOptions,
              fieldValues: field.fieldValues,
            })),
          },
        },
      });
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);

    return {
      message: "Product updated successfully!",
      data: updatedProduct,
      success: true,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      message: "An error occurred while updating the product.",
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
