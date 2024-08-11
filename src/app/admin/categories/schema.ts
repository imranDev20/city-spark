import { z } from "zod";

const CategoryTypeEnum = z.enum([
  "PRIMARY",
  "SECONDARY",
  "TERTIARY",
  "QUATERNARY",
]);

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required and must be unique"),
  image: z.string().optional(),
  parentPrimaryCategory: z.string().optional(),
  parentSecondaryCategory: z.string().optional(),
  parentTertiaryCategory: z.string().optional(),

  type: CategoryTypeEnum.refine(
    (val) => CategoryTypeEnum.options.includes(val as any),
    {
      message:
        "Category type must be PRIMARY, SECONDARY, TERTIARY, or QUATERNARY",
    }
  ).superRefine((val, ctx) => {
    if (!val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category type is required",
      });
    }
  }),
});

// Export the TypeScript type for the schema
export type CategoryFormInputType = z.infer<typeof categorySchema>;

// Export the TypeScript type for CategoryType
export type CategoryType = z.infer<typeof CategoryTypeEnum>;
