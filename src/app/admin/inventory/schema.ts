import { z } from 'zod';



export const inventorySchema = z.object({
stock:z.number().min(1,"stock value is required"),
productId: z.string().min(1,'Select product is requied'),
deliveryMinimumCount: z.number().optional(),
deliveryMaximumCount: z.number().optional(),
estimatedDeliveryTime: z.number().optional(),
collectionMinimumCount: z.number().optional(),
collectionMaximumCount: z.number().optional(),
estimatedcollectionTime: z.number().optional(),


});

// Export the TypeScript type for the schema
export type inventorySchema = z.infer<typeof inventorySchema>;