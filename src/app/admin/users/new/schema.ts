import { z } from "zod";

export const userSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    postcode: z.string().min(1, "Postcode is required"),
    city: z.string().min(1, "City is required"),
  }),
 
});