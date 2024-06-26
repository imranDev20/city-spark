import { z } from "zod";

export const brandSchema = z.object({
  brandName: z.string().min(1, "Brand name is required and must be unique"),
  description: z.string().min(1, "Description is required").max(500, "Description cannot exceed 500 characters"),
  website: z.string().url("Invalid website URL"),
 
  productCategories: z.array(z.string()).nonempty("Select at least one category"),
  brandStory: z.string().optional(),
  ambassador: z.string().optional(),
  tagline: z.string().max(100, "Tagline cannot exceed 100 characters").optional(),
  logo: z.string().optional(),
});