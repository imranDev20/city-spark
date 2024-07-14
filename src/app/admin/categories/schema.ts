import { z } from 'zod';

const CategoryTypeEnum = z.enum(['PRIMARY', 'SECONDARY', 'TERTIARY', 'QUATERNARY']);

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required and must be unique"),
  image: z.string().optional(),
  parentCategory: z.string().optional(),
  type: CategoryTypeEnum,
});

// Export the TypeScript type for the schema
export type Category = z.infer<typeof categorySchema>;
