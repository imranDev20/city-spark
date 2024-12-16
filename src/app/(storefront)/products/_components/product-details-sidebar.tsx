"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HomeIcon, StarIcon, TruckIcon } from "lucide-react";
import ChecklistAddIcon from "@/components/icons/checklist-add";
import BranchIcon from "@/components/icons/branch";
import DeliveryIcon from "@/components/icons/delivary";
import InStockIcon from "@/components/icons/in-stock";
import PriceIcon from "@/components/icons/price";
import Link from "next/link";
import AcceptedPayments from "../../_components/accepted-payments";
import { Prisma } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";
import { addToCart } from "@/app/(storefront)/products/actions";

type InventoryItemWithRelation = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        brand: true;
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
        productTemplate: {
          include: {
            fields: {
              include: {
                templateField: true;
              };
            };
            template: true;
          };
        };
      };
    };
  };
}>;

const locationSelectionOptions = [
  {
    Icon: BranchIcon,
    title: "Select Branch",
    description: "Select branch for local availability",
  },
  {
    Icon: DeliveryIcon,
    title: "Select Delivery Location",
    description: "Enter postcode for local availability",
  },
];

const productActionOptions = [
  {
    icon: ChecklistAddIcon,
    text: "Add product in quote list",
  },
  { icon: InStockIcon, text: "Check stock in your area" },
  {
    icon: PriceIcon,
    text: (
      <>
        <Link href="/login">
          <span className="text-blue-500 font-semibold">Login</span>
        </Link>{" "}
        to get your trade price
      </>
    ),
  },
];

export default function ProductDetailsSidebar({
  inventoryItem,
}: {
  inventoryItem: InventoryItemWithRelation; // Replace 'any' with the actual type of your inventory item
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);
  const { product, stockCount, heldCount } = inventoryItem;
  const availableStock = stockCount - heldCount;

  const handleQuantityChange = (newValue: number) => {
    setQuantity(Math.min(newValue, availableStock * 2));
  };

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>,
    type: "FOR_DELIVERY" | "FOR_COLLECTION"
  ) => {
    e.preventDefault();
    if (!product.tradePrice) {
      toast({
        title: "Error",
        description: "Product price is not available",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await addToCart(inventoryItem.id, quantity, type);
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

  return (
    <div className="hidden lg:block">
      <Card className="shadow-none border-gray-350">
        <CardContent className="p-6">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-5 h-5 text-green-450 fill-none" />
            ))}
            <span className="ml-2 text-sm text-gray-600">4.99</span>
          </div>

          <h1 className="text-2xl font-semibold text-gray-800 my-5">
            {product.name}
          </h1>

          <div className="mt-5">
            {product.contractPrice &&
              product.tradePrice &&
              product.contractPrice > product.tradePrice && (
                <span className="text-xl text-gray-500 line-through mr-4">
                  £{product.contractPrice.toFixed(2)}
                </span>
              )}
            {product.tradePrice ? (
              <>
                <span className="text-3xl font-semibold text-red-600">
                  £{product.tradePrice.toFixed(2)}
                </span>
                <span className="text-xl text-gray-500 ml-2">inc. VAT</span>
              </>
            ) : (
              <span className="text-xl text-gray-500">Price not available</span>
            )}
          </div>

          <div className="space-y-8 mt-6">
            <div className="space-y-3">
              <div className="flex justify-between bg-gray-200 rounded-md text-lg relative overflow-hidden h-12">
                <button
                  onClick={() =>
                    handleQuantityChange(Math.max(1, quantity - 1))
                  }
                  disabled={isPending || quantity <= 1 || !product.tradePrice}
                  className="absolute top-0 left-0 h-full px-4 flex items-center justify-center transition-colors hover:bg-gray-300 disabled:opacity-50"
                >
                  <span className="text-gray-600 font-medium">-</span>
                </button>
                <input
                  className="appearance-none border-none text-center bg-transparent focus:outline-none py-1 spinner-none flex-1 font-medium"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  disabled={!product.tradePrice}
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={isPending || !product.tradePrice}
                  className="absolute top-0 right-0 h-full px-4 flex items-center justify-center transition-colors hover:bg-gray-300 disabled:opacity-50"
                >
                  <span className="text-gray-600 font-medium">+</span>
                </button>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1 h-12"
                  onClick={(e) => handleAddToCart(e, "FOR_COLLECTION")}
                  disabled={
                    isPending ||
                    !inventoryItem.collectionEligibility ||
                    !product.tradePrice
                  }
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Collection
                </Button>
                <Button
                  variant="default"
                  className="flex-1 h-12"
                  onClick={(e) => handleAddToCart(e, "FOR_DELIVERY")}
                  disabled={
                    isPending ||
                    !inventoryItem.deliveryEligibility ||
                    !product.tradePrice
                  }
                >
                  <TruckIcon className="w-4 h-4 mr-2" />
                  Delivery
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm mt-2">
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

            <div className="grid grid-cols-3 gap-2">
              {productActionOptions.map(({ icon: Icon, text }, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-2 text-center flex flex-col items-center"
                >
                  <div className="rounded-full border flex justify-center items-center p-2 mb-2">
                    <Icon width={20} height={20} className="mx-auto" />
                  </div>
                  <p className="text-sm leading-tight">{text}</p>
                </div>
              ))}
            </div>

            <Separator className="bg-gray-350" />

            <div>
              <h3 className="font-semibold text-lg mb-3">Accepted Payment</h3>
              <AcceptedPayments />
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Where to get it</h3>
              <div className="space-y-3">
                {locationSelectionOptions.map(
                  ({ Icon, title, description }) => (
                    <div
                      key={title}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="bg-gray-150 rounded-full p-2">
                        <Icon height={20} width={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{title}</h4>
                        <p className="text-sm text-gray-600">{description}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
