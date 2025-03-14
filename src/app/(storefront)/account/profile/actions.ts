"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import {
  passwordFormSchema,
  PasswordFormValues,
  ProfileFormValues,
  profileSchema,
} from "./schema";
import prisma from "@/lib/prisma";
import { hash, compare } from "bcrypt";

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

export async function verifyCurrentPassword(currentPassword: string) {
  try {
    // Get current user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return {
        success: false,
        error: "You must be logged in to verify your password",
      };
    }

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.password) {
      return {
        success: false,
        error: "User not found or has no password set",
      };
    }

    // Verify current password
    const passwordMatch = await compare(currentPassword, user.password);

    if (!passwordMatch) {
      return {
        success: false,
        error: "Current password is incorrect",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error verifying password:", error);
    return {
      success: false,
      error: "An unexpected error occurred while verifying your password",
    };
  }
}
export async function changePassword(
  formData:
    | FormData
    | {
        action: string;
        newPassword: string;
        currentPassword?: string;
      }
) {
  try {
    // Get data from either FormData or direct object
    let action, newPassword, currentPassword;

    if (formData instanceof FormData) {
      action = formData.get("action") as string;
      newPassword = formData.get("newPassword") as string;
      currentPassword =
        action === "change"
          ? (formData.get("currentPassword") as string)
          : undefined;
    } else {
      action = formData.action;
      newPassword = formData.newPassword;
      currentPassword = formData.currentPassword;
    }

    // Validate input data
    const validationResult = passwordFormSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword: newPassword, // We assume frontend validated this
    });

    if (!validationResult.success) {
      return {
        success: false,
        error: "Invalid password data",
      };
    }

    // Get current user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return {
        success: false,
        error: "You must be logged in to change your password",
      };
    }

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // For users that have a password and are changing it, verify current password
    if (action === "change" && user.password) {
      if (!currentPassword) {
        return {
          success: false,
          error: "Current password is required",
        };
      }

      const passwordMatch = await compare(currentPassword, user.password);
      if (!passwordMatch) {
        return {
          success: false,
          error: "Current password is incorrect",
        };
      }
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10);

    // Update password in database
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message:
        action === "change"
          ? "Password changed successfully"
          : "Password added successfully",
    };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating your password",
    };
  }
}
