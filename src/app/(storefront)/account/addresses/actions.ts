"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function deleteAddress(addressId: string) {
  try {
    // Get the current session to verify the user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to delete an address",
      };
    }

    // Find the address to verify ownership
    const address = await prisma.address.findUnique({
      where: {
        id: addressId,
      },
    });

    if (!address) {
      return {
        success: false,
        message: "Address not found",
      };
    }

    // Verify the address belongs to the current user
    if (address.userId !== session.user.id) {
      return {
        success: false,
        message: "You do not have permission to delete this address",
      };
    }

    // Delete the address
    await prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    // Revalidate the account page to reflect the changes
    revalidatePath("/account/addresses");

    return {
      success: true,
      message: "Address successfully deleted",
    };
  } catch (error) {
    console.error("Error deleting address:", error);
    return {
      success: false,
      message: "An error occurred while deleting the address",
    };
  }
}
