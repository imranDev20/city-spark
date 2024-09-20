import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";
import AcceptedPayments from "../_components/accepted-payments";
import { getCart } from "../products/actions";
import { FulFillmentType } from "@prisma/client";
import { ShoppingCart } from "lucide-react";
import BasketList from "./_components/basket-list";

export const dynamic = "force-dynamic";

export default async function StorefrontBasketPage() {
  const cart = await getCart();

  const collectionItems = cart?.cartItems.filter(
    (item) => item.type === FulFillmentType.FOR_COLLECTION
  );
  const deliveryItems = cart?.cartItems.filter(
    (item) => item.type === FulFillmentType.FOR_DELIVERY
  );

  const subtotal = cart?.totalPrice || 0;
  const vat = subtotal * 0.2; // Assuming 20% VAT
  const total = subtotal + vat;

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-screen-xl">
        <h1 className="text-4xl font-bold mb-8">My Basket</h1>
        <Card className="p-8 shadow-none border-gray-350 text-center">
          <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h2 className="text-2xl font-semibold mb-4">Your basket is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven&apos;t added any items to your basket yet.
          </p>
          <Link href="/products">
            <Button variant="default">Continue Shopping</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-8">My Basket</h1>

          <div className="bg-blue-50 p-4 rounded-lg mb-8">
            <div className="flex items-center">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
                i
              </div>
              <div>
                <h2 className="font-semibold">Account options</h2>
                <p className="text-sm">
                  To receive a range of exclusive benefits{" "}
                  <Link
                    href="/create-account"
                    className="text-blue-600 underline"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {collectionItems && collectionItems.length > 0 && (
            <BasketList items={collectionItems} title="Items for Collection" />
          )}

          <div className="mt-10">
            {deliveryItems && deliveryItems.length > 0 && (
              <BasketList items={deliveryItems} title="Items for Delivery" />
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card className="shadow-none bg-offWhite border-gray-350">
              <CardHeader>
                <CardTitle className="text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2 text-base">Add Promo Code</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Promotions and coupon codes can not be used in conjunction or
                  with any other offer.
                </p>
                <div className="flex mb-6">
                  <Input
                    placeholder="Gift card or promo code "
                    className="mr-2 border border-gray-350"
                  />
                  <Button className="bg-secondary hover:bg-secondary/80">
                    Apply
                  </Button>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between mb-4">
                    <span>Subtotal (Ex.VAT)</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span>VAT</span>
                    <span>£{vat.toFixed(2)}</span>
                  </div>
                  <Separator className="my-4 bg-gray-350" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button variant="default" className="w-full ">
                    Checkout
                  </Button>
                </Link>

                <div className="mt-5">
                  <h3 className="font-semibold text-sm text-black mb-3">
                    Accepted Payment
                  </h3>
                  <AcceptedPayments />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
