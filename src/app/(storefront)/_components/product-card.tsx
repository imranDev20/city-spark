"use client";

import { Star, Truck, Store } from "lucide-react";
import Image from "next/image";
import PlaceholderImage from "@/images/placeholder-image.png";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { addToCart } from "../products/actions";
import { useToast } from "@/components/ui/use-toast";
import { useTransition, useState } from "react";
import Link from "next/link";
import { customSlugify } from "@/lib/functions";
import { useQueryClient } from "@tanstack/react-query";
import { BLUR_DATA_URL } from "@/lib/constants";
import QuantitySelector from "../quantity-selector";
import { FaStore, FaTruck } from "react-icons/fa";

// Types remain the same...
type InventoryItemWithRelation = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        brand: true;
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
      };
    };
  };
}>;

export default function ProductCard({
  inventoryItem,
}: {
  inventoryItem: InventoryItemWithRelation;
}) {
  const { id, product } = inventoryItem;
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);
  const rating = 4.5;
  const queryClient = useQueryClient();

  const handleAddToCart = async (
    e: React.MouseEvent,
    type: "FOR_DELIVERY" | "FOR_COLLECTION"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await addToCart(id, quantity, type);

      if (result?.success) {
        await queryClient.invalidateQueries({ queryKey: ["cart"] });

        toast({
          title: "Added to Cart",
          description: result.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: result?.message,
          variant: "destructive",
        });
      }
    });
    setQuantity(1);
  };

  const productUrl = `/products/p/${customSlugify(product.name)}/p/${id}`;

  return (
    <Card className="shadow-none group h-full flex flex-col bg-white border-gray-300 rounded-xl overflow-hidden lg:hover:shadow-lg transition-all duration-300 relative">
      <Link href={productUrl} className="contents">
        <div className="relative bg-white">
          <div className="sm:hidden relative h-48 p-4">
            <Image
              src={product.images[0] || PlaceholderImage}
              alt="Product Image"
              className="object-contain"
              sizes="100vw"
              loading="lazy"
              placeholder="blur"
              fill
              blurDataURL={BLUR_DATA_URL}
            />
          </div>

          <div className="hidden sm:block relative h-56 lg:h-64 p-6">
            <Image
              src={product.images[0] || PlaceholderImage}
              fill
              alt="Product Image"
              className="object-contain transition-all duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, 50vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              loading="lazy"
            />
          </div>
        </div>

        {product.promotionalPrice &&
        product.retailPrice &&
        product.promotionalPrice < product.retailPrice ? (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
            <div className="bg-red-600 text-white px-3 py-1 rounded-t-md font-bold text-base">
              SALE
            </div>
            <div className="bg-black text-white px-2 py-0.5 rounded-b-md text-xs font-medium">
              {Math.round(
                ((product.retailPrice - product.promotionalPrice) /
                  product.retailPrice) *
                  100
              )}
              % OFF
            </div>
          </div>
        ) : null}

        <div className="flex flex-col p-2 sm:p-4">
          <div className="mb-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 sm:w-4 h-3 sm:h-4 ${
                    rating >= star
                      ? "text-secondary fill-secondary"
                      : "text-gray-200"
                  }`}
                />
              ))}
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium">
                {rating.toFixed(1)}/5
              </span>
            </div>

            <h3 className="font-normal text-gray-900 text-sm sm:text-base line-clamp-3 min-h-[2.5rem] mt-3 !leading-[1.3rem]">
              {product.name}
            </h3>
          </div>
        </div>
      </Link>

      <div className="px-2 sm:px-4 pb-2 sm:pb-4 mt-auto">
        <div className="flex items-baseline gap-2 mb-5">
          {product.promotionalPrice ? (
            <>
              <span className="sm:text-2xl font-bold text-gray-900">
                £{product.promotionalPrice.toFixed(2)}
              </span>
              <div className="text-[10px] text-gray-500 leading-none font-semibold">
                inc. VAT
              </div>
              {product.retailPrice &&
                product.retailPrice > product.promotionalPrice && (
                  <span className="text-xs sm:text-sm text-red-500 line-through">
                    £{product.retailPrice.toFixed(2)}
                  </span>
                )}
            </>
          ) : (
            <>
              <span className="sm:text-2xl font-bold text-gray-900">
                £{(product.retailPrice || 0)?.toFixed(2)}
              </span>
              <div className="text-[10px] text-gray-500 leading-none font-semibold">
                inc. VAT
              </div>
            </>
          )}
        </div>

        <div className="space-y-2 sm:space-y-4">
          <div className="space-y-2">
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={(newQuantity) => {
                setQuantity(Math.min(newQuantity));
              }}
              disabled={isPending}
            />
            <div className="grid grid-cols-2 gap-1 sm:gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full px-2 h-7 sm:h-10 text-xs sm:text-sm"
                onClick={(e) => handleAddToCart(e, "FOR_COLLECTION")}
                disabled={isPending || !inventoryItem.collectionEligibility}
              >
                <FaStore className="mr-1" />
                Collect
              </Button>
              <Button
                size="sm"
                className="w-full px-2 h-7 sm:h-10 text-xs sm:text-sm"
                onClick={(e) => handleAddToCart(e, "FOR_DELIVERY")}
                disabled={isPending || !inventoryItem.deliveryEligibility}
              >
                <FaTruck className="mr-1" />
                Deliver
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
