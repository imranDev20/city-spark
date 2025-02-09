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
import { FaStore, FaTruck, FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  if (!optimisticItems?.length) {
    return null;
  }

  return (
    <>
      <section className="mb-16">
        <div className="flex items-center justify-between mb-3">
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

          {/* {type === FulFillmentType.FOR_DELIVERY && (
            <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="h-4 w-4 text-primary" />
                  <span className="text-gray-500">Delivery to:</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  IG11 7YA
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
                  className="text-primary hover:text-primary/90 font-medium ml-2"
                >
                  Change
                </Button>
              </div>
            </div>
          )} */}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Delivery Postcode</DialogTitle>
            <DialogDescription>
              Enter your postcode to check delivery availability and options.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {/* Postcode change functionality will go here */}
            <p className="text-sm text-gray-500">
              Postcode change functionality will be implemented here.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BasketList;
