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
import { NumericFormat } from "react-number-format";
import { FaStore, FaTrash, FaTruck } from "react-icons/fa";

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

interface BasketItemProps {
  cartItem: CartItemWithRelations;
  onRemove: (id: string) => Promise<void>;
}

const BasketItem: React.FC<BasketItemProps> = ({ cartItem, onRemove }) => {
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState(
    (cartItem.quantity ?? 1).toString()
  );
  const [debouncedQuantity, setDebouncedQuantity] = useState(
    cartItem.quantity ?? 1
  );
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue((cartItem.quantity ?? 1).toString());
  }, [cartItem.quantity]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const parsedQuantity = parseInt(inputValue) || 1;
      setDebouncedQuantity(parsedQuantity);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue]);

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
          setInputValue((cartItem.quantity ?? 1).toString());
        }
      });
    }
  }, [debouncedQuantity, cartItem.id, cartItem.quantity, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const parsedValue = parseInt(inputValue) || 1;
    setInputValue(parsedValue.toString());
  };

  const handleButtonClick = (increment: boolean) => {
    const currentValue = parseInt(inputValue) || 1;
    const newValue = increment
      ? currentValue + 1
      : Math.max(1, currentValue - 1);
    setInputValue(newValue.toString());
  };

  const unitPrice =
    cartItem.inventory.product.promotionalPrice ||
    cartItem.inventory.product.retailPrice ||
    0;

  const quantity = parseInt(inputValue) || 1;
  const totalPrice = unitPrice * quantity;

  const PriceDisplay = ({ amount }: { amount: number }) => (
    <NumericFormat
      value={amount}
      displayType="text"
      prefix="£"
      decimalScale={2}
      fixedDecimalScale
      thousandSeparator=","
    />
  );

  return (
    <>
      <div className="hidden lg:block my-7">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-12 gap-3">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-md bg-gray-50 row-span-2 md:row-span-1 col-span-2 border">
              <Image
                src={cartItem.inventory.product.images[0] || PlaceholderImage}
                alt={cartItem.inventory.product.name}
                fill
                style={{ objectFit: "contain" }}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            </div>

            <div className="col-span-7">
              <h3 className="font-normal text-base md:text-lg text-gray-800 mb-5 md:mb-0">
                {cartItem.inventory.product.name}
              </h3>
            </div>

            {/* Price Information */}
            <div className="text-left md:text-right mb-4 md:mb-0 col-span-3">
              <div className="text-base md:text-xl font-semibold text-gray-800">
                <PriceDisplay amount={totalPrice} />
                <span className="text-xs text-gray-500 ml-1">inc. VAT</span>
              </div>
              <div className="text-sm text-gray-500">
                {quantity} × <PriceDisplay amount={unitPrice} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-2"></div>

            <div className="col-span-3 flex justify-between bg-gray-100 rounded-md text-lg relative overflow-hidden w-full md:w-32 h-10 md:h-9">
              <button
                onClick={() => handleButtonClick(false)}
                className="absolute top-0 left-0 h-full w-12 md:w-10 flex items-center justify-center transition-colors duration-200 ease-in-out hover:bg-gray-200 active:bg-gray-400"
              >
                <span className="text-gray-600 font-medium select-none">-</span>
              </button>
              <input
                className="w-full h-full appearance-none border-none text-center bg-transparent focus:outline-none font-medium [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              <button
                onClick={() => handleButtonClick(true)}
                className="absolute top-0 right-0 h-full w-12 md:w-10 flex items-center justify-center transition-colors duration-200 ease-in-out hover:bg-gray-200 active:bg-gray-400"
              >
                <span className="text-gray-600 font-medium select-none">+</span>
              </button>
            </div>

            <div className="col-span-3">
              <Button
                variant="ghost"
                size="default"
                className="flex items-center gap-2 h-10 md:h-9 hover:bg-transparent justify-start md:justify-center"
              >
                {cartItem.type === "FOR_DELIVERY" ? (
                  <>
                    <FaStore className="h-4 w-4" />
                    <span>Move to Collection</span>
                  </>
                ) : (
                  <>
                    <FaTruck className="h-4 w-4" />
                    <span>Move to Delivery</span>
                  </>
                )}
              </Button>
            </div>

            <div className="col-span-4 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(cartItem.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-10 w-10 md:h-10 md:w-10"
              >
                <FaTrash className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex lg:hidden flex-col space-y-3 my-7">
        <div className="grid grid-cols-12 gap-3">
          <div className="relative w-20 h-20 rounded-md bg-gray-50 row-span-2 md:row-span-1 col-span-4">
            <Image
              src={cartItem.inventory.product.images[0] || PlaceholderImage}
              alt={cartItem.inventory.product.name}
              fill
              style={{ objectFit: "contain" }}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>

          <div className="col-span-8">
            <h3 className="font-normal text-base md:text-lg text-gray-800">
              {cartItem.inventory.product.name}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-4"></div>

          <div className="text-left mb-4 md:mb-0 col-span-8">
            <div className="text-base md:text-xl font-semibold text-gray-800">
              <PriceDisplay amount={totalPrice} />
              <span className="text-xs text-gray-500 ml-1">inc. VAT</span>
            </div>
            <div className="text-sm text-gray-500">
              {quantity} × <PriceDisplay amount={unitPrice} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-4"></div>
          <div className="col-span-6 flex justify-between bg-gray-100 rounded-md text-lg relative overflow-hidden w-full md:w-32 h-10 md:h-9">
            <button
              onClick={() => handleButtonClick(false)}
              className="absolute top-0 left-0 h-full w-12 md:w-10 flex items-center justify-center transition-colors duration-200 ease-in-out hover:bg-gray-200 active:bg-gray-400"
            >
              <span className="text-gray-600 font-medium select-none">-</span>
            </button>
            <input
              className="w-full h-full appearance-none border-none text-center bg-transparent focus:outline-none font-medium [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            <button
              onClick={() => handleButtonClick(true)}
              className="absolute top-0 right-0 h-full w-12 md:w-10 flex items-center justify-center transition-colors duration-200 ease-in-out hover:bg-gray-200 active:bg-gray-400"
            >
              <span className="text-gray-600 font-medium select-none">+</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center w-full mt-3 md:mt-0 md:pl-[120px]">
          <Button
            variant="ghost"
            size="default"
            className="flex items-center gap-2 h-10 md:h-9 hover:bg-transparent justify-start md:justify-center"
          >
            {cartItem.type === "FOR_DELIVERY" ? (
              <>
                <FaStore className="h-4 w-4" />
                <span>Move to Collection</span>
              </>
            ) : (
              <>
                <FaTruck className="h-4 w-4" />
                <span>Move to Delivery</span>
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(cartItem.id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-10 w-10"
          >
            <FaTrash className="!size-5" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default BasketItem;
