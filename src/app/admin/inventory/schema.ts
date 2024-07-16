import { z } from "zod";

export const inventorySchema = z.object({
  stock: z.number().min(1, "stock value is required"),
  deliveryEligibility: z.boolean(),
  collectionEligibility: z.boolean(),
  maxDeliveryTime: z.string().optional(),
  collectionAvailabilityTime: z.string().optional(),
  deliveryAreas: z
  .array(
    z.object({
        deliveryArea: z.string(),
    })
  )
  .optional(),

  collectionPoints: z
  .array(
    z.object({
        collectionPoint: z.string(),
    })
  )
  .optional(),
  countAvailableForDelivery: z.number().optional(),
  countAvailableForCollection: z.number().optional(),
  minDeliveryCount: z.number().optional(),
  minCollectionCount: z.number().optional(),
  maxDeliveryCount: z.number().optional(),
  maxCollectionCount: z.number().optional(),
  productId: z.string().min(1, "Select product is required"),
}).refine(data => {
    if (data.countAvailableForDelivery && data.stock) {
      return data.countAvailableForDelivery <= data.stock;
    }
    return true;
  }, {
    message: "Count available for delivery cannot be greater than stock",
    path: ["countAvailableForDelivery"],
  });;

// Export the TypeScript type for the schema
export type InventoryFormInputType = z.infer<typeof inventorySchema>;
