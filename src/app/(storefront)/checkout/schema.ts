import { z } from "zod";

export const contactDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
});

export type ContactDetailsFormInput = z.infer<typeof contactDetailsSchema>;
