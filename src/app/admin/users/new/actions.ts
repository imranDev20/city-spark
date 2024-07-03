"use server";
import { userSchema } from "./schema";

export type FormState = {
  message: string;
};

export async function createUserAction(
  previousState: FormState,
  data: FormData
) {
  console.log(previousState);
  const formData = Object.fromEntries(data);
  const parsed = userSchema.safeParse(formData);

  console.log(parsed);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
    };
  }

  return { message: "User created successfully" };
}