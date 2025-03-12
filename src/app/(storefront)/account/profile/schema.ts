import { z } from "zod";

// Profile schema
export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
