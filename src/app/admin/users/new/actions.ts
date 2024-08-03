"use server";
import prisma from "@/lib/prisma";
import { FromInputType, userSchema } from "./schema";
import { revalidatePath } from "next/cache";

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