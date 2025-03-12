"use client";

import { Star } from "lucide-react";
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
import { Loader2 } from "lucide-react";

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
  const [loadingType, setLoadingType] = useState<
    "FOR_DELIVERY" | "FOR_COLLECTION" | null
  >(null);
  const rating = 4.5;
  const queryClient = useQueryClient();

  const handleAddToCart = async (
    e: React.MouseEvent,
    type: "FOR_DELIVERY" | "FOR_COLLECTION"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Set loading state
    setLoadingType(type);

    // Execute server action
    startTransition(async () => {
      try {
        const result = await addToCart(id, quantity, type);

        if (result?.success) {
          await queryClient.invalidateQueries({ queryKey: ["cart"] });
          toast({
            title: "Added to Cart",
            description: result.message || `${product.name} added to your cart`,
            variant: "success",
          });
        } else {
          toast({
            title: "Error",
            description: result?.message || "Failed to add item to cart",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoadingType(null);
        setQuantity(1);
      }
    });
  };

  const productUrl = `/products/p/${customSlugify(product.name)}/p/${id}`;

  return (
    <Card className="shadow group h-full flex flex-col bg-white border rounded-xl overflow-hidden lg:hover:shadow-lg transition-all duration-300 relative">
      <Link href={productUrl} className="contents">
        <div className="relative bg-white">
          {/* Mobile image */}
          <div className="sm:hidden relative h-52 p-6">
            <Image
              src={product.images[0] || PlaceholderImage}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 120px"
              loading="lazy"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>

          {/* Desktop image */}
          <div className="hidden sm:block relative h-56 lg:h-64 p-6">
            <Image
              src={product.images[0] || PlaceholderImage}
              alt={product.name}
              fill
              className="object-contain transition-all duration-300 group-hover:scale-105"
              sizes="(min-width: 640px) 160px"
              loading="lazy"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>
        </div>

        {/* Sale badge */}
        {product.promotionalPrice &&
        product.retailPrice &&
        product.promotionalPrice < product.retailPrice ? (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
            <div className="bg-red-600 text-white px-4 py-1.5 rounded-t-md font-bold text-sm">
              SALE
            </div>
            <div className="bg-black text-white px-3 py-1 rounded-b-md text-xs font-medium">
              {Math.round(
                ((product.retailPrice - product.promotionalPrice) /
                  product.retailPrice) *
                  100
              )}
              % OFF
            </div>
          </div>
        ) : null}

        <div className="flex flex-col p-4 sm:p-4">
          <div className="mb-4">
            {/* Rating stars */}
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 sm:w-4 h-4 sm:h-4 ${
                    rating >= star
                      ? "text-secondary fill-secondary"
                      : "text-gray-200"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium">
                {rating.toFixed(1)}/5
              </span>
            </div>

            {/* Product name */}
            <h3 className="font-normal text-gray-900 text-base sm:text-base line-clamp-3 min-h-[3rem] mt-3 leading-[1.4]">
              {product.name}
            </h3>
          </div>
        </div>
      </Link>

      <div className="px-4 sm:px-4 pb-4 sm:pb-4 mt-auto">
        {/* Price section */}
        <div className="flex items-baseline gap-2 mb-6">
          {product.promotionalPrice ? (
            <>
              <span className="text-2xl sm:text-2xl font-bold text-gray-900">
                £{product.promotionalPrice.toFixed(2)}
              </span>
              <div className="text-xs text-gray-500 leading-none font-semibold">
                inc. VAT
              </div>
              {product.retailPrice &&
                product.retailPrice > product.promotionalPrice && (
                  <span className="text-sm text-red-500 line-through">
                    £{product.retailPrice.toFixed(2)}
                  </span>
                )}
            </>
          ) : (
            <>
              <span className="text-2xl sm:text-2xl font-bold text-gray-900">
                £{(product.retailPrice || 0)?.toFixed(2)}
              </span>
              <div className="text-xs text-gray-500 leading-none font-semibold">
                inc. VAT
              </div>
            </>
          )}
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Quantity selector and buttons */}
          <div className="space-y-3">
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={(newQuantity) => {
                setQuantity(Math.min(newQuantity));
              }}
              disabled={isPending}
            />
            <div className="grid grid-cols-2 gap-2 sm:gap-2">
              <Button
                variant="secondary"
                size="lg"
                className="w-full text-sm h-10"
                onClick={(e) => handleAddToCart(e, "FOR_COLLECTION")}
                disabled={isPending || !inventoryItem.collectionEligibility}
              >
                {loadingType === "FOR_COLLECTION" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FaStore className="mr-2 text-lg" />
                )}
                {loadingType === "FOR_COLLECTION" ? "Adding..." : "Collect"}
              </Button>
              <Button
                size="lg"
                className="w-full text-sm h-10"
                onClick={(e) => handleAddToCart(e, "FOR_DELIVERY")}
                disabled={isPending || !inventoryItem.deliveryEligibility}
              >
                {loadingType === "FOR_DELIVERY" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FaTruck className="mr-2 text-lg" />
                )}
                {loadingType === "FOR_DELIVERY" ? "Adding..." : "Deliver"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
