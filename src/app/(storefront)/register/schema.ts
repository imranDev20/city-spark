import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const nonEmptyString = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`);

const phoneNumberValidator = (phoneNumber: string) => {
  const parsed = parsePhoneNumberFromString(phoneNumber, "GB");
  return parsed?.isValid() || "Please enter a valid UK phone number";
};

export const registerSchema = z
  .object({
    firstName: nonEmptyString("First name").min(2),
    surname: nonEmptyString("Surname").min(2),
    email: nonEmptyString("Email").email(),
    phone: nonEmptyString("Phone number").superRefine((val, ctx) => {
      const isValid = phoneNumberValidator(val);
      if (isValid !== true) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: isValid,
        });
      }
    }),
    password: nonEmptyString("Password")
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
    confirmPassword: nonEmptyString("Confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
