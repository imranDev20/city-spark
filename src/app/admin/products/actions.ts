"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unstable_cache as cache } from "next/cache";
import { ProductFormInputType } from "./schema";
import { CategoryType, Category } from "@prisma/client";

// Cached products for ssr in the list
export const getProducts = cache(async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
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
      const categories = await prisma.category.findMany({
        where: {
          type: categoryType,
        },
        include: {
          parentCategory: {
            where: {
              id: parentId,
            },
          },
        },
      });

      console.log(categories, categoryType, parentId);

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
        brand: true,
        productTemplate: {
          include: {
            fields: {
              include: {
                templateField: true,
              },
            },
          },
        },
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
    let createdProductTemplateId: string | undefined;

    if (data.productTemplateFields && data.productTemplateFields?.length > 0) {
      const createdProductTemplate = await prisma.productTemplate.create({
        data: {
          templateId: data.template || "",
          fields: {
            create: data.productTemplateFields?.map((field) => ({
              templateFieldId: field.fieldId,
              fieldValue: field.fieldValue,
            })),
          },
        },
      });
      createdProductTemplateId = createdProductTemplate.id;
    }

    const createdProduct = await prisma.product.create({
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
        volume: data.volume,
        productTemplate: createdProductTemplateId
          ? {
              connect: { id: createdProductTemplateId },
            }
          : undefined,
        features: data.features?.map((item) => item.feature),
        category: data.category
          ? {
              connect: { id: data.category },
            }
          : undefined,
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
        brand: data.brand
          ? {
              connect: { id: data.brand },
            }
          : undefined,
        status: data.status || "DRAFT",
        manuals: data.manuals,
        images: data.images?.map((item) => item.image),
      },
    });

    await prisma.inventory.create({
      data: {
        productId: createdProduct.id,
        deliveryEligibility: false,
        collectionEligibility: false,
        countAvailableForCollection: 0,
        countAvailableForDelivery: 0,
        maxCollectionCount: 0,
        maxDeliveryCount: 0,
        minCollectionCount: 0,
        minDeliveryCount: 0,
        stockCount: 0,
        collectionAvailabilityTime: "",
        collectionPoints: [],
        deliveryAreas: [],
      },
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");

    return {
      message: "Product created successfully!",
      data: createdProduct,
      success: true,
    };
  } catch (error) {
    console.error(error);
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
    const updatedProductTemplate = await prisma.productTemplate.update({
      where: { id: data.productTemplate },
      data: {
        templateId: data.template,
        fields: {
          deleteMany: {},
          create: data.productTemplateFields?.map((productTemplateField) => ({
            templateFieldId: productTemplateField.fieldId,
            fieldValue: productTemplateField.fieldValue,
          })),
        },
      },
      include: {
        fields: {
          include: {
            productTemplate: true,
          },
        },
      },
    });

    // productTemplateId = updatedProductTemplate.id;

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
        volume: data.volume,
        status: data.status,
        productTemplate: updatedProductTemplate.id
          ? {
              connect: { id: updatedProductTemplate.id },
            }
          : undefined,
        features: data.features?.map((item) => item.feature),
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

        images: data.images?.map((item) => item.image),
        updatedAt: new Date(), // Ensures updatedAt is set to the current date and time
      },
    });

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
