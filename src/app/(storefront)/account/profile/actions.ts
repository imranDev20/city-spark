"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { ProfileFormValues, profileSchema } from "./schema";
import prisma from "@/lib/prisma";

export async function updateProfile(formData: ProfileFormValues) {
  try {
    // Validate with Zod
    const validatedFields = profileSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        error: "Invalid form data",
        details: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    // Get authenticated user
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return {
        error: "You must be signed in to update your profile",
        success: false,
      };
    }

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        firstName: validatedFields.data.firstName,
        lastName: validatedFields.data.lastName,
        phone: validatedFields.data.phone,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
      },
    });

    // Revalidate the profile page to show updated data
    revalidatePath("/profile");

    return {
      data: updatedUser,
      success: true,
    };
  } catch (error) {
    console.error("Error updating profile:", error);

    return {
      error: "Failed to update profile. Please try again.",
      success: false,
    };
  }
}
