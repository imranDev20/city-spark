"use server";

import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { ContactDetailsFormInput, contactDetailsSchema } from "./schema";
import { z } from "zod";
import { generateOrderNumber } from "@/lib/order-number";
import { revalidatePath } from "next/cache";

// Utility function for generating encoded guest email
function generateGuestEmail(contactEmail: string): string {
  // Create a unique guest email that includes their actual email
  // Format: original+guestXXXXX@domain.com
  const [localPart, domain] = contactEmail.split("@");
  const uniqueId = Math.random().toString(36).substring(2, 7); // Generate 5 random chars
  return `${localPart}+guest${uniqueId}@${domain}`;
}

export async function createGuestUser(data: ContactDetailsFormInput): Promise<{
  success: boolean;
  data?: User;
  message?: string;
  errors?: any;
}> {
  try {
    // Server-side validation
    const validatedData = contactDetailsSchema.parse(data);

    const guestEmail = generateGuestEmail(validatedData.email);

    // Create or update user with contact details
    const user = await prisma.user.create({
      data: {
        email: guestEmail,
        contactEmail: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        role: "GUEST",
      },
    });

    return {
      success: true,
      data: user,
      message: "Contact details saved successfully",
    };
  } catch (error) {
    console.error("Error saving contact details:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.errors,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to save contact details",
    };
  }
}

interface UpdateContactDetailsParams extends ContactDetailsFormInput {
  userId: string;
}

export async function updateContactDetails(
  params: UpdateContactDetailsParams
): Promise<{
  success: boolean;
  data?: User;
  message?: string;
  errors?: any;
}> {
  try {
    const validatedData = contactDetailsSchema.parse(params);
    const guestEmail = generateGuestEmail(validatedData.email);

    const updatedUser = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: guestEmail,
        contactEmail: validatedData.email,
        phone: validatedData.phone,
        role: "GUEST",
      },
    });

    return {
      success: true,
      data: updatedUser,
      message: "Contact details saved successfully",
    };
  } catch (error) {
    console.error("Error saving contact details:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.errors,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to save contact details",
    };
  }
}

type CreatePreOrderParams = {
  userId: string;
  cartId: string;
  shippingAddress: string;
};

export async function createPreOrder({
  userId,
  cartId,
  shippingAddress,
}: CreatePreOrderParams) {
  try {
    // Verify cart exists and belongs to user
    const cart = await prisma.cart.findFirst({
      where: {
        id: cartId,
      },
      include: {
        cartItems: {
          include: {
            inventory: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return {
        success: false,
        message: "Cart not found",
      };
    }

    if (!cart.cartItems.length) {
      return {
        success: false,
        message: "Cart is empty",
      };
    }

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Begin transaction
    const order = await prisma.$transaction(async (tx) => {
      // Check for order number collision
      const existingOrder = await tx.order.findUnique({
        where: { orderNumber },
      });

      if (existingOrder) {
        throw new Error("Order number already exists - please try again");
      }

      // Map cart items to order items
      const orderItems = cart.cartItems.map((item) => ({
        productId: item.inventory.product.id,
        type: item.type,
        quantity: item.quantity,
        price:
          item.inventory.product.promotionalPrice ||
          item.inventory.product.retailPrice ||
          0,
      }));

      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderNumber,
          orderStatus: "AWAITING_PAYMENT",
          status: "DRAFT",
          totalPrice: cart.totalPriceWithVat || 0,
          shippingAddress,
          paymentStatus: "PENDING",
          orderItems: {
            create: orderItems,
          },
        },
        include: {
          orderItems: true,
        },
      });

      // Update inventory held counts
      for (const item of cart.cartItems) {
        await tx.inventory.update({
          where: { id: item.inventory.id },
          data: {
            heldCount: {
              increment: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Pre-order created successfully",
      data: order,
    };
  } catch (error) {
    console.error("Error creating pre-order:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create pre-order",
    };
  }
}

interface UpdateOrderPaymentParams {
  orderId: string;
  cartId: string;
  paymentMethod: string;
  paymentStatus: "PAID" | "PENDING";
  orderStatus: "PENDING";
}

export async function updateOrderPayment({
  orderId,
  cartId,
  paymentMethod,
  paymentStatus,
  orderStatus,
}: UpdateOrderPaymentParams) {
  try {
    // Update the order with payment information
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentMethod,
        paymentStatus,
        orderStatus,
        // Set payment date if status is PAID
        paymentDate: paymentStatus === "PAID" ? new Date() : null,
      },
    });

    await prisma.cart.delete({
      where: {
        id: cartId,
      },
    }); // Revalidate the orders page

    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Order payment information updated successfully",
    };
  } catch (error) {
    console.error("Failed to update order payment:", error);
    return {
      success: false,
      message: "Failed to update order payment information",
    };
  }
}
