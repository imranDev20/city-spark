"use client";

import React, { useState } from "react";
import { useOptimistic, useTransition } from "react";
import BasketItem from "./basket-item";
import { Separator } from "@/components/ui/separator";
import { removeFromCart } from "../../products/actions";
import { FulFillmentType, Prisma } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { FaStore, FaTruck, FaPen, FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useDeliveryStore } from "@/hooks/use-delivery-store";
import DeliveryDialog from "../../_components/delivery-dialog";

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
  type: FulFillmentType;
}

const BasketList: React.FC<BasketListProps> = ({ items, type }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState<boolean>(false);

  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state: CartItemWithRelations[], removedItemId: string) =>
      state.filter((item) => item.id !== removedItemId)
  );

  const { postcode } = useDeliveryStore();

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

  if (!optimisticItems?.length) {
    return null;
  }

  return (
    <>
      <section className="mb-16">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {type === FulFillmentType.FOR_DELIVERY ? (
              <FaTruck className="h-5 w-5 text-secondary" />
            ) : (
              <FaStore className="h-5 w-5 text-secondary" />
            )}
            <h2 className="text-2xl font-semibold">
              {type === FulFillmentType.FOR_DELIVERY
                ? "Delivery"
                : "Collection"}{" "}
              <span className="text-muted-foreground text-lg font-normal">
                ({optimisticItems.length}{" "}
                {optimisticItems.length === 1 ? "item" : "items"})
              </span>
            </h2>
          </div>

          {type === FulFillmentType.FOR_DELIVERY && (
            <div className="flex items-center justify-between rounded-lg py-4 transition-colors duration-200 gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {postcode ? (
                    <span className="text-sm text-gray-600">Delivery to:</span>
                  ) : null}
                  {postcode ? (
                    <span className="text-lg font-semibold text-gray-900">
                      {postcode}
                    </span>
                  ) : null}
                </div>
              </div>
              <Button
                variant="ghost"
                size="default"
                onClick={() => setOpenDeliveryDialog(true)}
                className="hover:bg-blue-100/50"
              >
                {postcode ? <FaPen /> : <FaPlus />}
                {postcode ? "Change" : "Add Delivery Address"}
              </Button>
            </div>
          )}
        </div>

        <Card className={cn("p-5 bg-white", isPending && "opacity-50")}>
          {optimisticItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <BasketItem cartItem={item} onRemove={handleRemoveItem} />
              {index < optimisticItems.length - 1 && (
                <Separator className="my-4 bg-gray-300" />
              )}
            </React.Fragment>
          ))}
        </Card>
      </section>

      <DeliveryDialog
        open={openDeliveryDialog}
        setOpen={setOpenDeliveryDialog}
      />
    </>
  );
};

export default BasketList;
