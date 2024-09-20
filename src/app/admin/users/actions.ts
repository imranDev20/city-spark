"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FromInputType } from "./schema";
export type FormState = {
  message: string;
};

export async function createUser(data: FromInputType) {
  try {
    const createUser = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        avatar: data.avatar,
        addresses: {
          create: data.address.map((item) => ({
            city: item.city,
            postalCode: item.postalCode,
            state: item.state,
            addressLine1: item.addressLine1,
            addressLine2: item.addressLine2,
            country: item.country,
          })),
        },
      },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin/users/[user_id]", "page");
    revalidatePath("/admin/users/new");

    return {
      message: "User created successfully!",
      data: createUser,
      success: true,
    };
  } catch (error) {
    return {
      message: "An error occurred while creating the user.",
      success: false,
    };
  }
}
export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        addresses: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(
      "An error occurred while fetching users. Please try again later."
    );
  }
};

export async function deleteUser(userId: string) {
  try {
    if (!userId) {
      return {
        message: "User ID is required",
        success: false,
      };
    }

    // Delete the user
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    revalidatePath("/admin/users");
    return {
      message: "User deleted successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      message: "An error occurred while deleting the user.",
      success: false,
    };
  }
}
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        addresses: true,
      },
    });

    if (!user) {
      throw new Error("Brand not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}
export async function updateUser(userId: string, data: FromInputType) {
  try {
    // First, fetch the existing user and their addresses to ensure they exist
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Prepare the data for updating the user
    const updateData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      avatar: data.avatar,
    };

    // Prepare arrays for update, create, and delete operations for addresses
    const addressesToUpdate = [];
    const addressesToCreate = [];
    const addressIdsToKeep = new Set();

    // Categorize addresses
    for (const address of data.address) {
      if (address.addressId) {
        addressesToUpdate.push(address);
        addressIdsToKeep.add(address.addressId);
      } else {
        addressesToCreate.push(address);
      }
    }

    // Identify addresses to delete
    const addressIdsToDelete = existingUser.addresses
      .filter((address) => !addressIdsToKeep.has(address.id))
      .map((address) => address.id);

    // Perform the update
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        addresses: {
          update: addressesToUpdate.map((address) => ({
            where: { id: address.addressId },
            data: {
              addressLine1: address.addressLine1,
              addressLine2: address.addressLine2,
              city: address.city,
              state: address.state,
              postalCode: address.postalCode,
              country: address.country,
            },
          })),
          create: addressesToCreate,
          deleteMany: { id: { in: addressIdsToDelete } },
        },
      },
    });

    // Revalidate the necessary paths
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${updatedUser.id}`);
    revalidatePath("/admin/users/[user_id]", "page");
    revalidatePath("/admin/users/new");

    return {
      message: "User updated successfully!",
      data: updatedUser,
      success: true,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      message: "An error occurred while updating the user.",
      success: false,
    };
  }
}
