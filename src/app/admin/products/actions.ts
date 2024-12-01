"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductFormInputType } from "./schema";
import { backendClient } from "@/lib/edgestore-server";
import exceljs from "exceljs";
import dayjs from "dayjs";

export async function createProduct(data: ProductFormInputType) {
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        let createdProductTemplate;

        if (data.templateId) {
          createdProductTemplate = await tx.productTemplate.create({
            data: {
              templateId: data.templateId,
              fields: {
                create: data.productTemplateFields?.map(
                  (productTemplateField) => ({
                    templateFieldId: productTemplateField.fieldId,
                    fieldValue: productTemplateField.fieldValue,
                  })
                ),
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
        }

        const createdProduct = await tx.product.create({
          data: {
            name: data.name,
            description: data.description,
            model: data.model ?? null,
            type: data.type ?? null,
            warranty: data.warranty ?? null,
            guarantee: data.guarantee ?? null,
            tradePrice: data.tradePrice ? parseFloat(data.tradePrice) : null,
            contractPrice: data.contractPrice
              ? parseFloat(data.contractPrice)
              : null,
            promotionalPrice: data.promotionalPrice
              ? parseFloat(data.promotionalPrice)
              : null,
            unit: data.unit ?? null,
            weight: data.weight ? parseFloat(data.weight) : null,
            color: data.color ?? null,
            length: data.length ? parseFloat(data.length) : null,
            width: data.width ? parseFloat(data.width) : null,
            height: data.height ? parseFloat(data.height) : null,
            material: data.material ?? null,
            volume: data.volume ?? null,
            shape: data.shape ?? null,
            productTemplate: createdProductTemplate?.id
              ? {
                  connect: { id: createdProductTemplate.id },
                }
              : undefined,
            features: data.features?.map((item) => item.feature),
            primaryCategory: data.primaryCategoryId
              ? {
                  connect: { id: data.primaryCategoryId },
                }
              : undefined,
            secondaryCategory: data.secondaryCategoryId
              ? {
                  connect: { id: data.secondaryCategoryId },
                }
              : undefined,
            tertiaryCategory: data.tertiaryCategoryId
              ? {
                  connect: { id: data.tertiaryCategoryId },
                }
              : undefined,
            quaternaryCategory: data.quaternaryCategoryId
              ? {
                  connect: { id: data.quaternaryCategoryId },
                }
              : undefined,
            brand: data.brand
              ? {
                  connect: { id: data.brand },
                }
              : undefined,
            status: data.status || "DRAFT",
            manuals: data.manuals,
            images: [], // We'll update this after confirming uploads
          },
        });

        await tx.inventory.create({
          data: {
            productId: createdProduct.id,
            deliveryEligibility: false,
            collectionEligibility: false,
            stockCount: 0,
            collectionPoints: [],
            deliveryAreas: [],
          },
        });

        // Confirm image uploads
        const confirmedImages = [];
        for (const imageData of data.images || []) {
          try {
            const result = await backendClient.publicImages.confirmUpload({
              url: imageData.image,
            });
            if (result.success) {
              confirmedImages.push(imageData.image);
            } else {
              throw new Error(
                `Failed to confirm upload for ${imageData.image}`
              );
            }
          } catch (error) {
            console.error(
              `Failed to confirm upload for ${imageData.image}:`,
              error
            );
            throw new Error(`Failed to upload ${imageData.image}`);
          }
        }

        // Update product with confirmed images
        await tx.product.update({
          where: { id: createdProduct.id },
          data: { images: confirmedImages },
        });
        return createdProduct;
      },
      {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      }
    );

    revalidatePath("/", "layout");

    return {
      message: "Product created successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error in createProduct:", error);
    return {
      message:
        "An error occurred while creating the product. Please try again later.",
      success: false,
    };
  }
}

export async function updateProduct(
  productId: string,
  data: ProductFormInputType
) {
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const existingProduct = await tx.product.findUnique({
          where: { id: productId },
          include: { productTemplate: true },
        });

        if (!existingProduct) {
          throw new Error("Product not found");
        }

        // Handle product template
        let productTemplateId = null;
        if (data.templateId && data.productTemplateFields) {
          if (existingProduct.productTemplate?.id) {
            // Update existing product template
            const updatedProductTemplate = await tx.productTemplate.update({
              where: { id: existingProduct.productTemplate.id },
              data: {
                templateId: data.templateId,
                fields: {
                  deleteMany: {},
                  create: data.productTemplateFields.map((field) => ({
                    templateFieldId: field.fieldId,
                    fieldValue: field.fieldValue,
                  })),
                },
              },
            });
            productTemplateId = updatedProductTemplate.id;
          } else {
            // Create new product template
            const newProductTemplate = await tx.productTemplate.create({
              data: {
                templateId: data.templateId,
                fields: {
                  create: data.productTemplateFields.map((field) => ({
                    templateFieldId: field.fieldId,
                    fieldValue: field.fieldValue,
                  })),
                },
              },
            });
            productTemplateId = newProductTemplate.id;
          }
        } else if (existingProduct.productTemplate) {
          // Delete existing product template if it's no longer needed
          await tx.productTemplate.delete({
            where: { id: existingProduct.productTemplate.id },
          });
        }

        // Handle image deletions
        const imagesToDelete = existingProduct.images.filter(
          (image) => !data.images?.some((img) => img.image === image)
        );

        for (const image of imagesToDelete) {
          try {
            await backendClient.publicImages.deleteFile({
              url: image,
            });
          } catch (error) {
            console.error(`Failed to delete image ${image}:`, error);
            throw new Error(`Failed to delete image ${image}`);
          }
        }

        // Handle new image confirmations
        const confirmedImages = [];
        for (const imageData of data.images || []) {
          if (!existingProduct.images.includes(imageData.image)) {
            try {
              const result = await backendClient.publicImages.confirmUpload({
                url: imageData.image,
              });
              if (result.success) {
                confirmedImages.push(imageData.image);
              } else {
                throw new Error(
                  `Failed to confirm upload for ${imageData.image}`
                );
              }
            } catch (error) {
              console.error(
                `Failed to confirm upload for ${imageData.image}:`,
                error
              );
              throw new Error(`Failed to upload ${imageData.image}`);
            }
          } else {
            confirmedImages.push(imageData.image);
          }
        }

        // Update the product
        const updatedProduct = await tx.product.update({
          where: { id: productId },
          data: {
            name: data.name,
            description: data.description,
            model: data.model ?? null,
            type: data.type ?? null,
            warranty: data.warranty ?? null,
            guarantee: data.guarantee ?? null,
            tradePrice: data.tradePrice ? parseFloat(data.tradePrice) : null,
            contractPrice: data.contractPrice
              ? parseFloat(data.contractPrice)
              : null,
            promotionalPrice: data.promotionalPrice
              ? parseFloat(data.promotionalPrice)
              : null,
            unit: data.unit ?? null,
            weight: data.weight ? parseFloat(data.weight) : null,
            color: data.color ?? null,
            length: data.length ? parseFloat(data.length) : null,
            width: data.width ? parseFloat(data.width) : null,
            height: data.height ? parseFloat(data.height) : null,
            material: data.material,
            volume: data.volume ?? null,
            shape: data.shape ?? null,
            status: data.status ?? "DRAFT",
            productTemplate: productTemplateId
              ? { connect: { id: productTemplateId } }
              : { disconnect: true },
            features: data.features?.map((item) => item.feature),
            brand: data.brand
              ? { connect: { id: data.brand } }
              : { disconnect: true },
            manuals: data.manuals ?? [],
            primaryCategory: data.primaryCategoryId
              ? { connect: { id: data.primaryCategoryId } }
              : { disconnect: true },
            secondaryCategory: data.secondaryCategoryId
              ? { connect: { id: data.secondaryCategoryId } }
              : { disconnect: true },
            tertiaryCategory: data.tertiaryCategoryId
              ? { connect: { id: data.tertiaryCategoryId } }
              : { disconnect: true },
            quaternaryCategory: data.quaternaryCategoryId
              ? { connect: { id: data.quaternaryCategoryId } }
              : { disconnect: true },
            images: confirmedImages,
            updatedAt: new Date(),
          },
        });

        return updatedProduct;
      },
      {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      }
    );

    revalidatePath("/", "layout");

    return {
      message: "Product updated successfully!",
      data: result,
      success: true,
    };
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return {
      message:
        "An error occurred while updating the product. Please try again later.",
      success: false,
    };
  }
}
export async function deleteProduct(productId: string) {
  if (!productId) {
    return {
      message: "Product ID is required",
      success: false,
    };
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // Fetch the product to be deleted
        const productToDelete = await tx.product.findUnique({
          where: { id: productId },
          include: { productTemplate: true },
        });

        if (!productToDelete) {
          throw new Error("Product not found");
        }

        // Delete associated images
        if (productToDelete.images && productToDelete.images.length > 0) {
          for (const image of productToDelete.images) {
            try {
              await backendClient.publicImages.deleteFile({
                url: image,
              });
            } catch (error) {
              console.error(`Failed to delete image ${image}:`, error);
              throw new Error(`Failed to delete image ${image}`);
            }
          }
        }

        // Delete associated product template if it exists
        if (productToDelete.productTemplateId) {
          await tx.productTemplate.delete({
            where: { id: productToDelete.productTemplateId },
          });
        }

        // Delete the inventory associated with the product
        await tx.inventory.deleteMany({
          where: { productId: productId },
        });

        // Finally, delete the product
        const deletedProduct = await tx.product.delete({
          where: { id: productId },
        });

        return deletedProduct;
      },
      {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      }
    );

    revalidatePath("/", "layout");

    return {
      message: "Product deleted successfully!",
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return {
      message:
        "An error occurred while deleting the product. Please try again later.",
      success: false,
    };
  }
}

export async function exportProductsToJSON() {
  try {
    const products = await prisma.product.findMany({
      include: {
        primaryCategory: true,
        secondaryCategory: true,
        tertiaryCategory: true,
        quaternaryCategory: true,
        brand: true,
        inventory: true,
      },
    });

    const formattedProducts = products.map((product) => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    const jsonData = JSON.stringify(formattedProducts, null, 2);

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Products successfully exported to JSON",
      data: jsonData,
    };
  } catch (error) {
    console.error("Failed to export products to JSON:", error);
    return {
      success: false,
      message: "Failed to export products to JSON",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function exportProductsToExcel() {
  try {
    const products = await prisma.product.findMany({
      include: {
        primaryCategory: true,
        secondaryCategory: true,
        tertiaryCategory: true,
        quaternaryCategory: true,
        brand: true,
        inventory: true,
      },
    });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    worksheet.columns = [
      { header: "ID", key: "id", width: 30 },
      { header: "Name", key: "name", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Model", key: "model", width: 20 },
      { header: "Type", key: "type", width: 20 },
      { header: "Trade Price", key: "tradePrice", width: 15 },
      { header: "Contract Price", key: "contractPrice", width: 15 },
      { header: "Promotional Price", key: "promotionalPrice", width: 15 },
      { header: "Primary Category", key: "primaryCategory", width: 20 },
      { header: "Secondary Category", key: "secondaryCategory", width: 20 },
      { header: "Tertiary Category", key: "tertiaryCategory", width: 20 },
      { header: "Quaternary Category", key: "quaternaryCategory", width: 20 },
      { header: "Brand", key: "brand", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Updated At", key: "updatedAt", width: 20 },
      { header: "Inventory Count", key: "inventoryCount", width: 15 },
    ];

    products.forEach((product) => {
      worksheet.addRow({
        id: product.id,
        name: product.name,
        description: product.description,
        model: product.model,
        type: product.type,
        tradePrice: product.tradePrice,
        contractPrice: product.contractPrice,
        promotionalPrice: product.promotionalPrice,
        primaryCategory: product.primaryCategory?.name,
        secondaryCategory: product.secondaryCategory?.name,
        tertiaryCategory: product.tertiaryCategory?.name,
        quaternaryCategory: product.quaternaryCategory?.name,
        brand: product.brand?.name,
        status: product.status,
        createdAt: dayjs(product.createdAt).format("DD MMMM YYYY HH:mm:ss"),
        updatedAt: dayjs(product.updatedAt).format("DD MMMM YYYY HH:mm:ss"),
        inventoryCount: product.inventory?.stockCount,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const excelData = Buffer.from(buffer).toString("base64");

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Products successfully exported to Excel",
      data: excelData,
    };
  } catch (error) {
    console.error("Failed to export products to Excel:", error);
    return {
      success: false,
      message: "Failed to export products to Excel",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
