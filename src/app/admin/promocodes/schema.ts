import * as z from "zod";
import { Status, PromoDiscountType } from "@prisma/client";

// Schema definition
export const promoCodeSchema = z
  .object({
    code: z.string().min(3, "Code must be at least 3 characters"),
    description: z.string().optional(),
    discountType: z.nativeEnum(PromoDiscountType),
    discountValue: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Please enter a valid number greater than 0",
      }),
    minOrderValue: z.string().optional(),
    maxDiscount: z.string().optional(),
    startDate: z.date(),
    endDate: z.date(),
    usageLimit: z.string().optional(),
    status: z.nativeEnum(Status),
  })
  .refine(
    (data) => {
      if (data.endDate < data.startDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

// Export type for form values
export type PromoCodeFormValues = z.infer<typeof promoCodeSchema>;
