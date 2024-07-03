import { z } from "zod";

export const templateSchema = z.object({
  name: z.string().min(1, "Name is required and can't be left blank"),
  description: z.string().optional(),
  fields: z
    .array(
      z.object({
        fieldName: z.string().min(1,'Field Name is required'),
        fieldType: z.enum(["text", "select"]),
        fieldValue: z.string().min(1,'Field value is required').max(255),
      })
    )
    .min(1, "Minimum one Fields & Values are required"),
    status: z.enum(['draft','active','archive']).optional() // At least one field must be submitted
});
