"use server";
import { categorySchema } from "./schema";

export type FormState = {
  message: string;
};

export async function createCategoryAction(
  previousState: FormState,
  data: FormData
) {
  console.log(previousState);
  const formData = Object.fromEntries(data);
  const parsed = categorySchema.safeParse(formData);

  console.log(parsed);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
    };
  }

  return { message: "Category created successfully" };
}