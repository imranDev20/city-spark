import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required and must be unique"),
  images: z.string().min(1, "Category image is required"),
  parentCategory: z.string().optional(),
});