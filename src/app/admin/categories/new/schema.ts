import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required and must be unique"),
  images: z.string().optional(),
  parentCategory: z.string().optional(),
  type: z.string().min(1,'select type is required')
});