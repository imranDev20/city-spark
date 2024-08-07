"use server";
import prisma from "@/lib/prisma";
import { FromInputType} from "./schema";
import { revalidatePath } from "next/cache";
import { unstable_cache as cache } from "next/cache";
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
    console.log(error);
    return {
      message: "An error occurred while creating the user.",
      success: false,
    };
  }
}
export const getUsers = cache(async () => {
 
  try {    
    const users = await prisma.user.findMany({
      include:{
        addresses: true,
      }
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(
      "An error occurred while fetching users. Please try again later."
    );
  }
});

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