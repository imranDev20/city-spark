import { z } from "zod";

// Profile schema
export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// Define schema for password change/addition
export const passwordFormSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        "Password must include at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Use Partial<> to make currentPassword optional in the type
export type PasswordFormValues = z.infer<typeof passwordFormSchema>;
