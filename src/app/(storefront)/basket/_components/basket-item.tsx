"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCartItemQuantity } from "../../products/actions";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import PlaceholderImage from "@/images/placeholder-image.png";
import { BLUR_DATA_URL } from "@/lib/constants";

type CartItemWithRelations = Prisma.CartItemGetPayload<{
  include: {
    inventory: {
      include: {
        product: true;
      };
    };
  };
}>;

interface BasketItemProps {
  cartItem: CartItemWithRelations;
  onRemove: (id: string) => Promise<void>;
}

const BasketItem: React.FC<BasketItemProps> = ({ cartItem, onRemove }) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(cartItem.quantity ?? 1);
  const [debouncedQuantity, setDebouncedQuantity] = useState(quantity);
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedQuantity(quantity);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [quantity]);

  useEffect(() => {
    if (debouncedQuantity !== cartItem.quantity) {
      startTransition(async () => {
        try {
          const result = await updateCartItemQuantity(
            cartItem.id,
            debouncedQuantity
          );
          if (!result.success) {
            throw new Error(result.message);
          }
        } catch (error) {
          toast({
            title: "Error",
            description:
              error instanceof Error ? error.message : "An error occurred",
            variant: "destructive",
          });
          setQuantity(cartItem.quantity ?? 1);
        }
      });
    }
  }, [debouncedQuantity, cartItem.id, cartItem.quantity, toast]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const displayPrice =
    cartItem.inventory.product.promotionalPrice ||
    cartItem.inventory.product.retailPrice;

  return (
    <div
      className={cn(
        "flex items-center justify-between py-4 last:border-b-0 transition-opacity duration-200",
        isPending && "opacity-30 pointer-events-none"
      )}
    >
      <div className="flex items-start space-x-6 flex-1">
        <div className="relative w-24 h-24 rounded-md bg-gray-50">
          <Image
            src={cartItem.inventory.product.images[0] || PlaceholderImage}
            alt={cartItem.inventory.product.name}
            fill
            style={{ objectFit: "contain" }}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </div>
        <div className="flex flex-col space-y-5">
          <h3 className="font-semibold text-lg text-gray-800">
            {cartItem.inventory.product.name}
          </h3>
          <div className="flex justify-between bg-gray-100 rounded-md text-lg relative overflow-hidden w-32 h-9">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="absolute top-0 left-0 h-full w-10 flex items-center justify-center transition-colors duration-200 ease-in-out hover:bg-gray-200 active:bg-gray-400"
            >
              <span className="text-gray-600 font-medium select-none">-</span>
            </button>
            <input
              className="w-full h-full appearance-none border-none text-center bg-transparent focus:outline-none font-medium [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(parseInt(e.target.value, 10) || 1)
              }
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="absolute top-0 right-0 h-full w-10 flex items-center justify-center transition-colors duration-200 ease-in-out hover:bg-gray-300 active:bg-gray-400"
            >
              <span className="text-gray-600 font-medium select-none">+</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-5">
        <div className="text-right">
          <p className="text-xl font-semibold text-gray-800">
            £{displayPrice?.toFixed(2) ?? "0.00"}
          </p>
          <p className="text-xs text-gray-500">inc. VAT</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(cartItem.id)}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BasketItem;
