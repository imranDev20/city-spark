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
        product: {
          select: {
            id: true;
            name: true;
            images: true;
            tradePrice: true;
            promotionalPrice: true;
            retailPrice: true;
          };
        };
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
    startTransition(async () => {
      try {
        addOptimisticItem(itemId);

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
      }
    });
  };

  return (
    <>
      {optimisticItems && optimisticItems.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-3">{title}</h2>
          <Card
            className={`p-5 shadow-none mb-5 border-gray-300 ${
              isPending ? "opacity-50" : ""
            }`}
          >
            {optimisticItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <BasketItem cartItem={item} onRemove={handleRemoveItem} />
                {index < optimisticItems.length - 1 && (
                  <Separator className="my-4 bg-gray-300" />
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
