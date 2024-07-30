import { z } from "zod";

// Image schema with detailed error messages and trimmed text fields
export const imageSchema = z.object({
  url: z.string().trim(),
  thumbnailUrl: z.string().trim().optional(),
  description: z.string().trim().optional(),
  name: z.string().trim().optional(),
  size: z
    .number({
      invalid_type_error: "Size must be a number.",
    })
    .int("Size must be an integer.")
    .optional(),
  lastModified: z.string().trim().optional(),
  lastModifiedDate: z
    .date({
      invalid_type_error: "Last modified date must be a valid date.",
    })
    .optional(),
  type: z.string().trim().optional(),
});

// Product schema with detailed error messages and trimmed text fields
export const productSchema = z.object({
  name: z
    .string({
      required_error: "Product name is required.",
      invalid_type_error: "Product name must be a string.",
    })
    .trim()
    .min(1, "Product name is required and can't be left blank."),
  description: z
    .string({
      required_error: "Product description is required.",
      invalid_type_error: "Product description must be a string.",
    })
    .trim()
    .min(1, "Product description is required and can't be left blank."),
  brand: z.string().trim().optional(),
  model: z.string().trim().optional(),
  type: z.string().trim().optional(),
  warranty: z.string().trim().optional(),
  guarantee: z.string().trim().optional(),
  tradePrice: z
    .number({
      invalid_type_error: "Trade price must be a number.",
    })
    .optional(),
  contractPrice: z
    .number({
      invalid_type_error: "Contract price must be a number.",
    })
    .optional(),
  promotionalPrice: z
    .number({
      invalid_type_error: "Promotional price must be a number.",
    })
    .optional(),
  unit: z.string().trim().optional(),
  weight: z
    .number({
      invalid_type_error: "Weight must be a number.",
    })
    .optional(),
  color: z.string().trim().optional(),
  length: z
    .number({
      invalid_type_error: "Length must be a number.",
    })
    .optional(),
  width: z
    .number({
      invalid_type_error: "Width must be a number.",
    })
    .optional(),
  height: z
    .number({
      invalid_type_error: "Height must be a number.",
    })
    .optional(),
  material: z.string().trim().optional(),
  template: z
    .string({
      invalid_type_error: "Template must be a string.",
    })
    .trim()
    .optional(),
  templateFields: z
    .array(
      z.object({
        fieldName: z
          .string({
            required_error: "Field name is required.",
            invalid_type_error: "Field name must be a string.",
          })
          .trim()
          .min(1, "Field name is required and can't be left blank."),
        fieldType: z.enum(["TEXT", "SELECT"], {
          invalid_type_error: "Field type must be either 'TEXT' or 'SELECT'.",
        }),
        fieldOptions: z.string().trim().optional(),
        fieldValue: z.string().trim().optional(),
      })
    )
    .optional(),
  shape: z.string().trim().optional(),
  volume: z.string().trim().optional(),
  features: z
    .array(
      z.object({
        feature: z
          .string({
            invalid_type_error: "Feature must be a string.",
          })
          .trim(),
      })
    )
    .optional(),
  category: z.string().trim().optional(),
  status: z
    .enum(["DRAFT", "ACTIVE", "ARCHIVED"], {
      invalid_type_error:
        "Status must be one of 'DRAFT', 'ACTIVE', or 'ARCHIVED'.",
    })
    .optional(),
  images: z
    .array(
      z.object({
        image: z.string().trim(),
      })
    )
    .optional(),
  manuals: z
    .array(z.string().trim(), {
      invalid_type_error: "Manuals must be an array of strings.",
    })
    .optional(),
  primaryCategory: z.string().trim().optional(),
  secondaryCategory: z.string().trim().optional(),
  tertiaryCategory: z.string().trim().optional(),
  quaternaryCategory: z.string().trim().optional(),
});

export type ProductFormInputType = z.infer<typeof productSchema>;
export type ImageFormInputType = z.infer<typeof imageSchema>;
