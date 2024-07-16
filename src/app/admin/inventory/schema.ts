import { z } from "zod";

export const inventorySchema = z.object({
  stock: z.string().min(1, "stock value is required"),
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
  countAvailableForDelivery: z.string().optional(),
  countAvailableForCollection: z.string().optional(),
  minDeliveryCount: z.string().optional(),
  minCollectionCount: z.string().optional(),
  maxDeliveryCount: z.string().optional(),
  maxCollectionCount: z.string().optional(),
  productId: z.string().min(1, "Select product is required"),
}).refine(data => {
    if (data.countAvailableForDelivery && data.stock) {
      return Number(data.countAvailableForDelivery) <= Number(data.stock);
    }
    return true;
  }, {
    message: "Count available for delivery cannot be greater than stock",
    path: ["countAvailableForDelivery"],
  });;

// Export the TypeScript type for the schema
export type InventoryFormInputType = z.infer<typeof inventorySchema>;
