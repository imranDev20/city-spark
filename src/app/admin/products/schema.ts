import { z } from "zod";

// Image schema with detailed error messages
export const imageSchema = z.object({
  url: z.string(),
  thumbnailUrl: z.string().optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  size: z
    .number({
      invalid_type_error: "Size must be a number.",
    })
    .int("Size must be an integer.")
    .optional(),

  lastModified: z.string().optional(),
  lastModifiedDate: z
    .date({
      invalid_type_error: "Last modified date must be a valid date.",
    })
    .optional(),
  type: z.string().optional(),
});

// Product schema with detailed error messages
export const productSchema = z.object({
  name: z
    .string({
      required_error: "Product name is required.",
      invalid_type_error: "Product name must be a string.",
    })
    .min(1, "Product name is required and can't be left blank."),
  description: z
    .string({
      required_error: "Product description is required.",
      invalid_type_error: "Product description must be a string.",
    })
    .min(1, "Product description is required and can't be left blank."),
  brand: z.string().optional(),
  model: z.string().optional(),
  type: z.string().optional(),
  warranty: z.string().optional(),
  guarantee: z.string().optional(),
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
  unit: z.string().optional(),
  weight: z
    .number({
      invalid_type_error: "Weight must be a number.",
    })
    .optional(),
  color: z.string().optional(),
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
  material: z.string().optional(),
  template: z
    .string({
      required_error: "Template is required.",
      invalid_type_error: "Template must be a string.",
    })
    .min(1, "Template is required and can't be left blank.")
    .optional(),

  templateFields: z
    .array(
      z.object({
        fieldName: z
          .string({
            required_error: "Field name is required.",
            invalid_type_error: "Field name must be a string.",
          })
          .min(1, "Field name is required and can't be left blank."),
        fieldType: z.enum(["TEXT", "SELECT"], {
          invalid_type_error: "Field type must be either 'TEXT' or 'SELECT'.",
        }),
        fieldOptions: z.string().optional(),
        fieldValues: z.string().optional(),
      })
    )
    .optional(),
  shape: z.string().optional(),
  volume: z.string().optional(),
  features: z
    .array(
      z.object({
        feature: z
          .string({
            required_error: "Feature is required.",
            invalid_type_error: "Feature must be a string.",
          })
          .min(1, "Feature is required and can't be left blank."),
      })
    )
    .optional(),
  category: z.string().optional(),
  status: z
    .enum(["DRAFT", "ACTIVE", "ARCHIVED"], {
      invalid_type_error:
        "Status must be one of 'DRAFT', 'ACTIVE', or 'ARCHIVED'.",
    })
    .optional(),
  images: z
    .array(
      z.object(
        {
          image: imageSchema,
        },
        {
          invalid_type_error: "Images must be an array of image objects.",
        }
      )
    )
    .optional(),
  manuals: z
    .array(z.string(), {
      invalid_type_error: "Manuals must be an array of strings.",
    })
    .optional(),
  primaryCategory: z.string().optional(),
  secondaryCategory: z.string().optional(),
  tertiaryCategory: z.string().optional(),
  quaternaryCategory: z.string().optional(),
});

export type ProductFormInputType = z.infer<typeof productSchema>;
export type ImageFormInputType = z.infer<typeof imageSchema>;
