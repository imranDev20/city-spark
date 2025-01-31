import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { FulFillmentType } from "@prisma/client";
import { ArrowLeft, CircleAlert, ShoppingCart } from "lucide-react";
import BasketList from "./_components/basket-list";
import { getCart } from "@/services/storefront-cart";
import OrderSummaryCard from "./_components/order-summary-card";
import BasketHeader from "./_components/basket-header";
import MobileOrderSummary from "./_components/mobile-order-summary";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function StorefrontBasketPage() {
  const cart = await getCart();

  const collectionItems = cart?.cartItems.filter(
    (item) => item.type === FulFillmentType.FOR_COLLECTION
  );
  const deliveryItems = cart?.cartItems.filter(
    (item) => item.type === FulFillmentType.FOR_DELIVERY
  );

  if (!cart || cart.cartItems.length === 0) {
    return (
      <>
        <BasketHeader />

        {/* Main Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12 max-w-screen-xl">
          {/* Desktop Title */}
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 hidden lg:block">
            My Basket
          </h1>

          {/* Empty State Card */}
          <Card className="shadow-none border-gray-300 p-6 lg:p-12 text-center">
            <ShoppingCart className="mx-auto mb-4 lg:mb-6 h-12 w-12 lg:h-16 lg:w-16 text-gray-400" />
            <h2 className="text-xl lg:text-2xl font-semibold mb-3 lg:mb-4">
              Your basket is empty
            </h2>
            <p className="text-gray-600 mb-6 lg:mb-8 max-w-md mx-auto text-sm lg:text-base">
              Looks like you haven&apos;t added any items to your basket yet.
            </p>
            <Link href="/products">
              <Button variant="default" className="w-full lg:w-auto" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <BasketHeader />
      <MobileOrderSummary cart={cart} />

      <div className="lg:hidden container mx-auto max-w-screen-xl px-4 sm:px-6 mb-4">
        <Card className="shadow-none bg-muted mt-10">
          <div className="p-4">
            <h3 className="font-semibold mb-2 text-base">Add Promo Code</h3>
            <p className="text-sm text-gray-600 mb-4">
              Promotions and coupon codes can not be used in conjunction or with
              any other offer.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Gift card or promo code"
                className="flex-1 border-gray-300 bg-white"
              />
              <Button className="bg-secondary hover:bg-secondary/90">
                Apply
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-12 max-w-screen-xl">
        <Link
          href="/products"
          className="items-center text-gray-600 hover:text-gray-900 mb-10 transition-colors hidden lg:inline-flex"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to shopping
        </Link>

        <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 hidden lg:block">
          My Basket
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="bg-blue-50 p-5 rounded-lg mb-10">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <CircleAlert className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-lg mb-1">
                    Sign in to your account
                  </h2>
                  <p className="text-sm text-gray-700">
                    <Link
                      href="/login"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      Sign in
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="/register"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      create an account
                    </Link>{" "}
                    to access exclusive benefits and faster checkout.
                  </p>
                </div>
              </div>
            </div>

            {collectionItems && collectionItems.length > 0 && (
              <BasketList
                items={collectionItems}
                type={FulFillmentType.FOR_COLLECTION}
              />
            )}

            {deliveryItems && deliveryItems.length > 0 && (
              <BasketList
                items={deliveryItems}
                type={FulFillmentType.FOR_DELIVERY}
              />
            )}
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <OrderSummaryCard cart={cart} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
