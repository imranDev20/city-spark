import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required and can't be left blank"),
  description: z
    .string()
    .min(1, "Product description is required and can't be left blank"),

  brand: z.string().optional(),
  model: z.string().optional(),
  type: z.string().optional(),
  warranty: z.string().optional(),
  guarantee: z.string().optional(),
  tradePrice: z.number().optional(),
  contractPrice: z.number().optional(),
  promotionalPrice: z.number().optional(),
  unit: z.string().optional(),
  weight: z.number().optional(),
  color: z.string().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  material: z.string().optional(),
  template: z.string(),

  templateFields: z
    .array(
      z.object({
        fieldName: z.string(),
        fieldType: z.enum(["TEXT", "SELECT"]),
        fieldOptions: z.string().optional(),
        fieldValues: z.string().optional(),
      })
    )
    .optional(),

  shape: z.string().optional(),
  volume: z.string().optional(),

  // changed it to an object
  features: z
    .array(
      z.object({
        feature: z.string(),
      })
    )
    .optional(),

  primaryCategory: z.string().optional(),
  secondaryCategory: z.string().optional(),
  tertiaryCategory: z.string().optional(),
  quaternaryCategory: z.string().optional(),

  category: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
  images: z.array(z.string()).optional(),
  manuals: z.array(z.string()).optional(),
});
