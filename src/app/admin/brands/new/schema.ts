import { z } from "zod";

export const brandSchema = z.object({
  brandName: z.string().min(1, "Brand name is required and must be unique"),
  description: z.string().min(1, "Description is required").max(500, "Description cannot exceed 500 characters"),
  website: z.string().url("Invalid website URL"),
  image: z.string().optional(),
  status: z.string().optional(),
});