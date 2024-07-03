import { z } from 'zod';

// Custom validation function for file
const fileValidation = z.custom((file) => {
  return file instanceof File;
}, {
  message: "Invalid file",
});

export const userSchema = z.object({
  avatar: fileValidation.optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    postcode: z.string().min(1, "Postcode is required"),
    city: z.string().min(1, "City is required"),
  }),
  status: z.enum(['draft','active','archive']).optional() 
});
