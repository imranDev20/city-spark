"use server";
import { productSchema } from "./schema";

export type FormState = {
  message: string;
};

export async function createProductAction(
  previousState: FormState,
  data: FormData
) {
  console.log(previousState);
  const formData = Object.fromEntries(data);
  const parsed = productSchema.safeParse(formData);

  console.log(parsed);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
    };
  }

  return { message: "User registered" };
}
