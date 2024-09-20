"use client";

import { Star, Truck, Store } from "lucide-react";
import Image from "next/image";
import PlaceholderImage from "@/images/placeholder-image.jpg";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { addToCart } from "../products/actions";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";
import { useState } from "react";
import Link from "next/link";
import { customSlugify } from "@/lib/functions";

type InventoryItemWithRelation = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
      };
    };
  };
}>;

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            rating >= star
              ? "text-green-450 fill-green-450"
              : rating > star - 1
              ? "text-green-450 fill-green-450 half-filled"
              : "text-green-450"
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

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

  const handleAddToCart = async (
    e: React.MouseEvent,
    type: "FOR_DELIVERY" | "FOR_COLLECTION"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const result = await addToCart(id, quantity, type);

      if (result?.success) {
        toast({
          title: "Cart Updated",
          description: result.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Cart Update failed",
          description: result?.message,
          variant: "destructive",
        });
      }
    });

    setQuantity(1);
  };

  const handleQuantityChange = (newValue: number) => {
    setQuantity(newValue);
  };

  const getCollectionAvailabilityMessage = () => {
    if (!inventoryItem.collectionEligibility) {
      return "Not available for collection";
    } else if (
      inventoryItem.collectionAvailabilityTime?.toLowerCase() === "today"
    ) {
      return "Available for collection today";
    } else if (
      inventoryItem.collectionAvailabilityTime?.toLowerCase() === "tomorrow"
    ) {
      return "Available for collection tomorrow";
    } else {
      return `Available for collection in ${inventoryItem.collectionAvailabilityTime}`;
    }
  };

  const getDeliveryAvailabilityMessage = () => {
    if (!inventoryItem.deliveryEligibility) {
      return "Not available for delivery";
    } else {
      return `${inventoryItem.stockCount} available for delivery in ${inventoryItem.maxDeliveryTime}`;
    }
  };

  const productUrl = `/products/p/${customSlugify(product.name)}/p/${id}`;

  return (
    <Card className="border-gray-350 transition-shadow duration-300 h-full flex flex-col shadow-none">
      <Link href={productUrl} className="flex-grow cursor-pointer">
        <CardHeader className="pb-0">
          <div className="relative h-48 mb-2">
            <Image
              src={product.images?.[0] || PlaceholderImage}
              fill
              alt={product.name}
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-t-lg"
            />
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5 flex-1 flex flex-col justify-between">
          <div className="flex-1">
            <StarRating rating={rating} />
            <h3 className="font-medium leading-snug mt-2 mb-1 text-gray-800 h-20">
              {product.name}
            </h3>
          </div>

          <div className="text-2xl text-primary font-bold my-3">
            £{product.promotionalPrice?.toFixed(2) || "0.00"}
            <span className="text-sm text-gray-500 font-normal ml-1">
              inc. VAT
            </span>
          </div>
        </CardContent>
      </Link>

      <div className="px-5 pb-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between bg-gray-200 my-2 rounded-md text-lg relative overflow-hidden">
          <button
            onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
            disabled={isPending || quantity <= 1}
            className="absolute top-0 left-0 h-full px-4 flex items-center justify-center transition-colors duration-200 ease-in-out hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
          >
            <span className="text-gray-600 font-medium select-none">-</span>
          </button>
          <input
            className="appearance-none border-none text-center bg-transparent focus:outline-none py-1 spinner-none flex-1 font-medium"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            style={{
              appearance: "textfield",
            }}
          />
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isPending}
            className="absolute top-0 right-0 h-full px-4 flex items-center justify-center transition-colors duration-200 ease-in-out hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
          >
            <span className="text-gray-600 font-medium select-none">+</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="flex flex-col">
            <Button
              variant="secondary"
              className="flex items-center justify-center"
              onClick={(e) => handleAddToCart(e, "FOR_COLLECTION")}
              disabled={isPending || !inventoryItem.collectionEligibility}
            >
              <Store className="mr-2 h-4 w-4" /> Collection
            </Button>
            <p className="text-xs mt-1 text-gray-600 text-center">
              {getCollectionAvailabilityMessage()}
            </p>
          </div>
          <div className="flex flex-col">
            <Button
              variant="default"
              className="flex items-center justify-center"
              onClick={(e) => handleAddToCart(e, "FOR_DELIVERY")}
              disabled={isPending || !inventoryItem.deliveryEligibility}
            >
              <Truck className="mr-2 h-4 w-4" /> Delivery
            </Button>
            <p className="text-xs mt-1 text-gray-600 text-center">
              {getDeliveryAvailabilityMessage()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
