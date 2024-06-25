import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required and can't be left blank"),
  description: z
    .string()
    .min(1, "Product description is required and can't be left blank"),

  brandName: z.string().optional(),
  model: z.string().optional(),
  type: z.string().optional(),
  warranty: z.string().optional(),
  guarantee: z.string().optional(),
  tradePrice: z.string().optional(),
  contractPrice: z.string().optional(),
  promotionalPrice: z.string().optional(),
  unit: z.string().optional(),
  weight: z.string().optional(),
  color: z.string().optional(),
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  material: z.string().optional(),
  template: z.string().optional(),
  features: z.array(z.string()).optional(),
  primaryCategory: z.string().optional(),
  secondaryCategory: z.string().optional(),
  tertiaryCategory: z.string().optional(),
  quaternaryCategory: z.string().optional(),
  status: z.string().optional(),
  images: z.array(z.string()).optional(),
  manuals: z.array(z.string()).optional(),
});
