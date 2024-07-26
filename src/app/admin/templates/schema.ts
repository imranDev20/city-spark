import { z } from "zod";

export const templateSchema = z.object({
  name: z.string().min(1, "Name is required and can't be left blank"),
  description: z.string().optional(),
  fields: z
    .array(
      z.object({
        fieldName: z.string().min(1, "Field Name is required"),
        fieldType: z.string().min(1, "Select value is required"),
        fieldValue: z.string().max(255).optional(),
      })
    )
    .min(1),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVE"]).optional(), // At least one field must be submitted
});
