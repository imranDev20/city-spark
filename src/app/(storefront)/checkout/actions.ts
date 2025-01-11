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

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function updateContactDetails(
  params: UpdateContactDetailsParams
): Promise<{
  success: boolean;
  data?: User;
  message?: string;
  errors?: any;
}> {
  try {
    // Get the session using getServerSession
    const session = await getServerSession(authOptions);

    // If there's a session, verify the user is updating their own account
    if (session?.user) {
      if (session.user.id !== params.userId) {
        return {
          success: false,
          message: "Unauthorized: You can only update your own account",
        };
      }
    }

    const validatedData = contactDetailsSchema.parse(params);

    // If there's a session, use the actual email, otherwise generate guest email
    const email = session?.user
      ? validatedData.email
      : generateGuestEmail(validatedData.email);

    // If there's a session, keep existing role, otherwise set as GUEST
    const role = session?.user ? undefined : ("GUEST" as const);

    const updatedUser = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: email,
        contactEmail: validatedData.email,
        phone: validatedData.phone,
        ...(role && { role }), // Only include role if it's defined (for guests)
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
    // First check if an order already exists for this cart
    const existingOrder = await prisma.order.findFirst({
      where: {
        cartId,
        userId,
      },
      include: {
        orderItems: true,
      },
    });

    // If order exists, just update the shipping address
    if (existingOrder) {
      const updatedOrder = await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          shippingAddress,
        },
        include: {
          orderItems: true,
        },
      });

      return {
        success: true,
        message: "Order shipping address updated successfully",
        data: updatedOrder,
      };
    }

    // If no existing order, verify cart exists and belongs to user
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
      const orderNumberExists = await tx.order.findUnique({
        where: { orderNumber },
      });

      if (orderNumberExists) {
        throw new Error("Order number already exists - please try again");
      }

      // Map cart items to order items
      const orderItems = cart.cartItems.map((item) => ({
        productId: item.inventory.product.id,
        type: item.type,
        quantity: item.quantity,
        price: item.price || 0,
        totalPrice: item.totalPrice || 0,
      }));

      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          cartId: cart.id,
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
    // Use transaction to ensure all updates happen together
    await prisma.$transaction(async (tx) => {
      // Get the current order to compare status changes
      const currentOrder = await tx.order.findUniqueOrThrow({
        where: { id: orderId },
      });

      // Update the order with payment information
      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentMethod,
          paymentStatus,
          orderStatus,
          paymentDate: paymentStatus === "PAID" ? new Date() : null,
        },
      });

      // Update cart status
      await tx.cart.update({
        where: { id: cartId },
        data: {
          status: "ORDERED",
        },
      });

      // Add timeline entry for payment status change
      if (paymentStatus === "PAID") {
        await tx.orderTimeline.create({
          data: {
            orderId,
            eventType: "PAYMENT_RECEIVED",
            message: `Payment received via ${paymentMethod.toLowerCase()}`,
            metadata: {
              previousPaymentStatus: currentOrder.paymentStatus,
              newPaymentStatus: paymentStatus,
              paymentMethod,
            },
          },
        });
      }

      // Add timeline entry if order status has changed
      if (currentOrder.orderStatus !== orderStatus) {
        await tx.orderTimeline.create({
          data: {
            orderId,
            eventType: "STATUS_CHANGED",
            message: `Order status changed from ${currentOrder.orderStatus.replaceAll(
              "_",
              " "
            )} to ${orderStatus.replaceAll("_", " ")}`,
            metadata: {
              previousStatus: currentOrder.orderStatus,
              newStatus: orderStatus,
            },
          },
        });
      }
    });

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
