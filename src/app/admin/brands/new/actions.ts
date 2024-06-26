"use server";
import { brandSchema } from "./schema";

export type FormState = {
  message: string;
};

export async function createBrandAction(
  previousState: FormState,
  data: FormData
) {
  console.log(previousState);
  const formData = Object.fromEntries(data);
  const parsed = brandSchema.safeParse(formData);

  console.log(parsed);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
    };
  }

  return { message: "Brand created successfully" };
}