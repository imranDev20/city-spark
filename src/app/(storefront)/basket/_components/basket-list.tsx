"use client";

import React from "react";
import { useOptimistic, useTransition } from "react";
import BasketItem from "./basket-item";
import { Separator } from "@/components/ui/separator";
import { removeFromCart } from "../../products/actions";
import { Prisma } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type CartItemWithRelations = Prisma.CartItemGetPayload<{
  include: {
    inventory: {
      include: {
        product: true;
      };
    };
  };
}>;

interface BasketListProps {
  items: CartItemWithRelations[];
  title: string;
}

const BasketList: React.FC<BasketListProps> = ({ items, title }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state: CartItemWithRelations[], removedItemId: string) =>
      state.filter((item) => item.id !== removedItemId)
  );

  const handleRemoveItem = async (itemId: string) => {
    addOptimisticItem(itemId);

    startTransition(async () => {
      try {
        const result = await removeFromCart(itemId);
        await queryClient.invalidateQueries({ queryKey: ["cart"] });

        if (!result.success) {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error("Failed to remove item:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to remove item",
          variant: "destructive",
        });
        // Note: In a real-world scenario, you might want to revert the optimistic update here
      }
    });
  };

  return (
    <>
      {optimisticItems && optimisticItems.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-3">{title}</h2>
          <Card
            className={`p-5 shadow-none mb-5 border-gray-350 ${
              isPending ? "opacity-50" : ""
            }`}
          >
            {optimisticItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <BasketItem
                  id={item.id}
                  image={item.inventory.product.images[0] || ""}
                  name={item.inventory.product.name}
                  price={item.inventory.product.tradePrice}
                  initialQuantity={item.quantity}
                  onRemove={handleRemoveItem}
                />
                {index < optimisticItems.length - 1 && (
                  <Separator className="my-4 bg-gray-350" />
                )}
              </React.Fragment>
            ))}
          </Card>
        </>
      )}
    </>
  );
};

export default BasketList;
