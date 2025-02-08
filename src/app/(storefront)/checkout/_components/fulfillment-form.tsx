"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeliveryAddress from "./delivery-address";
import { CartWithItems } from "@/services/storefront-cart";
import Image from "next/image";
import PlaceholderImage from "@/images/placeholder-image.png";
import { BLUR_DATA_URL } from "@/lib/constants";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createPreOrder } from "../actions";
import { LoadingButton } from "@/components/ui/loading-button";
import { useSession } from "next-auth/react";

interface FulfillmentFormProps {
  onNext: () => void;
  onBack: () => void;
  cart: CartWithItems;
}

type CartItemProps = {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
};

// Transform cart item to simplified props
const transformCartItem = (
  cartItem: CartWithItems["cartItems"][0]
): CartItemProps => {
  const { product } = cartItem.inventory;

  return {
    id: cartItem.id,
    productName: product.name,
    productImage: product.images[0] || "",
    quantity: cartItem.quantity,
    price: product.promotionalPrice || product.retailPrice || 0,
  };
};

const ItemList = ({ items }: { items: CartItemProps[] }) => (
  <div className="divide-y divide-gray-100">
    {items.map(({ id, productName, productImage, quantity, price }) => (
      <div className="py-4 flex items-center gap-4" key={id}>
        <div className="w-16 h-16 rounded bg-gray-100 shrink-0 relative overflow-hidden">
          <Image
            src={productImage || PlaceholderImage}
            alt={productName}
            fill
            className="object-contain"
            sizes="64px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 line-clamp-2">
            {productName}
          </h4>
          <div className="mt-1 flex items-center gap-4 text-sm">
            <span className="text-gray-500">Qty: {quantity}</span>
            <span className="text-gray-900">£{price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const DeliverySection = ({ items }: { items: CartItemProps[] }) => (
  <div className="mb-8">
    <CardHeader className="pb-4">
      <div className="flex items-center gap-3 mb-1">
        <CardTitle className="text-2xl">Delivery Items</CardTitle>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Estimated delivery:{" "}
        <span className="font-medium text-primary">
          Wednesday, 27th December 2024
        </span>
      </p>
    </CardHeader>

    <Separator className="mb-6" />

    <CardContent className="space-y-6">
      <div className="bg-gray-50/50 rounded-lg p-4">
        <ItemList items={items} />
      </div>
      <DeliveryAddress />
    </CardContent>
  </div>
);

const CollectionSection = ({ items }: { items: CartItemProps[] }) => (
  <div>
    <CardHeader className="pb-4">
      <div className="flex items-center gap-3 mb-1">
        <CardTitle className="text-2xl">Collection Items</CardTitle>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Items you&apos;ll collect from our store
      </p>
    </CardHeader>

    <Separator className="mb-6" />

    <CardContent className="space-y-6">
      <div className="bg-gray-50/50 rounded-lg p-4">
        <ItemList items={items} />
      </div>

      <div className="bg-gray-50 rounded-lg border-border border p-4">
        <div className="flex items-center gap-3 mb-1">
          <Store className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">Collection Point</h3>
        </div>
        <p className="text-sm text-gray-600 pl-7">
          123 High Street, London, SW1A 1AA
        </p>
      </div>
    </CardContent>
  </div>
);

export function FulfillmentForm({
  onNext,
  onBack,
  cart,
}: FulfillmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const deliveryItems = cart.cartItems
    .filter((item) => item.type === "FOR_DELIVERY")
    .map(transformCartItem);

  const collectionItems = cart.cartItems
    .filter((item) => item.type === "FOR_COLLECTION")
    .map(transformCartItem);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First check session storage for guest user
      let userId = sessionStorage.getItem("guest_user_id");

      // If no guest user ID, check for authenticated user
      if (!userId && session?.user?.id) {
        userId = session.user.id;
      }

      // If still no user ID, throw error
      if (!userId) {
        throw new Error("User information not found");
      }

      const shippingAddress = "IG11 7YA";
      if (!shippingAddress && deliveryItems.length > 0) {
        throw new Error("Delivery address is required for delivery items");
      }

      const result = await createPreOrder({
        userId,
        cartId: cart.id,
        shippingAddress: shippingAddress || undefined,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      // Store the pre-order ID in session storage for the payment step
      if (result.data?.id) {
        sessionStorage.setItem("pre_order_id", result.data.id);
      }

      toast({
        title: "Order Created",
        description: "Your order has been created successfully",
        variant: "success",
      });

      onNext();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {deliveryItems.length > 0 && <DeliverySection items={deliveryItems} />}
      {collectionItems.length > 0 && (
        <CollectionSection items={collectionItems} />
      )}

      <div className="mt-6 px-6 py-4 border-t border-border flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-border"
        >
          Back
        </Button>
        <LoadingButton
          type="submit"
          className="min-w-[100px]"
          loading={isLoading}
        >
          Continue
        </LoadingButton>
      </div>
    </form>
  );
}

export default FulfillmentForm;
