"use client";

import { Star, Truck, Store, Clock } from "lucide-react";
import Image from "next/image";
import PlaceholderImage from "@/images/placeholder-image.jpg";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { addToCart } from "../products/actions";
import { useToast } from "@/components/ui/use-toast";
import { useTransition, useState, useEffect } from "react";
import Link from "next/link";
import { customSlugify } from "@/lib/functions";

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

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${
          rating >= star ? "text-primary fill-primary" : "text-gray-200"
        }`}
      />
    ))}
    <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}/5</span>
  </div>
);

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const validImages = images.filter(Boolean);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isHovered && validImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isHovered, validImages.length]);

  return (
    <div
      className="relative h-48 md:h-56 lg:h-64 bg-white p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      <Image
        src={validImages[currentImageIndex] || PlaceholderImage}
        fill
        alt="Product Image"
        className="object-contain transition-all duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {validImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {validImages.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "w-4 bg-primary"
                  : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DeliveryInfo = ({
  inventoryItem,
  quantity,
}: {
  inventoryItem: InventoryItemWithRelation;
  quantity: number;
}) => {
  const {
    stockCount,
    heldCount,
    maxDeliveryTime,
    maxDeliveryTimeExceedingStock,
  } = inventoryItem;
  const availableStock = stockCount - heldCount;
  const exceedsStock = quantity > availableStock;

  console.log(maxDeliveryTimeExceedingStock);

  return (
    <div className="flex items-center text-xs text-gray-600 min-h-[16px]">
      {(maxDeliveryTime || maxDeliveryTimeExceedingStock) && (
        <>
          <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
          {!exceedsStock
            ? maxDeliveryTime && (
                <span>
                  Delivery in{" "}
                  {maxDeliveryTime === "1"
                    ? "1 day"
                    : `${maxDeliveryTime} days`}
                </span>
              )
            : maxDeliveryTimeExceedingStock && (
                <span className="text-amber-600">
                  Delivery in{" "}
                  {maxDeliveryTimeExceedingStock === "1"
                    ? "1 day"
                    : `${maxDeliveryTimeExceedingStock} days`}
                </span>
              )}
        </>
      )}
    </div>
  );
};

const CollectionInfo = ({
  inventoryItem,
  quantity,
}: {
  inventoryItem: InventoryItemWithRelation;
  quantity: number;
}) => {
  const {
    stockCount,
    heldCount,
    collectionAvailabilityTime,
    maxCollectionTimeExceedingStock,
  } = inventoryItem;
  const availableStock = stockCount - heldCount;
  const exceedsStock = quantity > availableStock;

  return (
    <div className="flex items-center text-xs text-gray-600 min-h-[16px]">
      {(collectionAvailabilityTime || maxCollectionTimeExceedingStock) && (
        <>
          <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
          {!exceedsStock
            ? collectionAvailabilityTime && (
                <span>
                  Ready in{" "}
                  {collectionAvailabilityTime === "1"
                    ? "1 day"
                    : `${collectionAvailabilityTime} days`}
                </span>
              )
            : maxCollectionTimeExceedingStock && (
                <span className="text-amber-600">
                  Available in{" "}
                  {maxCollectionTimeExceedingStock === "1"
                    ? "1 day"
                    : `${maxCollectionTimeExceedingStock} days`}
                </span>
              )}
        </>
      )}
    </div>
  );
};

const QuantitySelector = ({
  quantity,
  onQuantityChange,
  disabled,
}: {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  disabled: boolean;
}) => (
  <div className="flex bg-gray-100 rounded-lg overflow-hidden h-8 w-full mb-2">
    <button
      onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
      disabled={disabled || quantity <= 1}
      className="w-12 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
    >
      -
    </button>
    <input
      type="number"
      value={quantity}
      onChange={(e) =>
        onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))
      }
      className="flex-1 text-center bg-transparent border-none spinner-none focus:outline-none text-sm"
      min="1"
      disabled={disabled}
    />
    <button
      onClick={() => onQuantityChange(quantity + 1)}
      disabled={disabled}
      className="w-12 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
    >
      +
    </button>
  </div>
);

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
  const availableStock = inventoryItem.stockCount - inventoryItem.heldCount;

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
    <Card className="group h-full flex flex-col bg-white border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={productUrl} className="contents">
        <ImageCarousel images={product.images || []} />
        {product.promotionalPrice &&
          product.tradePrice &&
          product.promotionalPrice < product.tradePrice && (
            <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              Save{" "}
              {Math.round(
                ((product.tradePrice - product.promotionalPrice) /
                  product.tradePrice) *
                  100
              )}
              %
            </div>
          )}

        <div className="flex flex-col p-4">
          <div className="space-y-2 mb-4">
            <div className="text-sm font-medium text-primary">
              {product.brand?.name ||
                product.primaryCategory?.name ||
                "Category"}
            </div>
            <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            <StarRating rating={rating} />
          </div>

          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              £{product.promotionalPrice?.toFixed(2)}
            </span>
            {product.tradePrice &&
              product.tradePrice > product.promotionalPrice! && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  £{product.tradePrice.toFixed(2)}
                </span>
              )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 mt-auto">
        <div className="space-y-4">
          <div className="space-y-2">
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={(newQuantity) => {
                setQuantity(Math.min(newQuantity, availableStock * 2)); // Limit to 2x available stock
              }}
              disabled={isPending}
            />
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-white hover:bg-gray-50"
                  onClick={(e) => handleAddToCart(e, "FOR_COLLECTION")}
                  disabled={isPending || !inventoryItem.collectionEligibility}
                >
                  <Store className="mr-2 h-4 w-4" />
                  Collect
                </Button>
                {inventoryItem.collectionEligibility && (
                  <CollectionInfo
                    inventoryItem={inventoryItem}
                    quantity={quantity}
                  />
                )}
              </div>
              <div className="space-y-1">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={(e) => handleAddToCart(e, "FOR_DELIVERY")}
                  disabled={isPending || !inventoryItem.deliveryEligibility}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  Deliver
                </Button>
                {inventoryItem.deliveryEligibility && (
                  <DeliveryInfo
                    inventoryItem={inventoryItem}
                    quantity={quantity}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-emerald-600">
              {availableStock > 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-600 mr-2" />
                  In Stock
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-gray-300 mr-2" />
                  Out of Stock
                </>
              )}
            </div>
            <div className="text-gray-600 text-xs">
              {availableStock} available
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
