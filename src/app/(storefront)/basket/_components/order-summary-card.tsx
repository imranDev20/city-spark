"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Cart } from "@prisma/client";
import CheckoutButton from "./checkout-button";
import AcceptedPayments from "../../_components/accepted-payments";

interface OrderSummaryCardProps {
  cart: Cart;
  isCheckout?: boolean;
  hasDeliveryItems?: boolean;
}

export default function OrderSummaryCard({
  cart,
  isCheckout = false,
  hasDeliveryItems = false,
}: OrderSummaryCardProps) {
  return (
    <Card className="shadow-none bg-offWhite border-gray-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-base">Add Promo Code</h3>
          <p className="text-sm text-gray-600">
            Promotions and coupon codes can not be used in conjunction or with
            any other offer.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Gift card or promo code"
              className="border-gray-300"
            />
            <Button className="bg-secondary hover:bg-secondary/90 transition-colors">
              Apply
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-[15px]">
            <span className="font-normal text-gray-700">
              Subtotal (exc. VAT)
            </span>
            <span className="tabular-nums font-semibold">
              £{cart.subTotalWithoutVat?.toFixed(2)}
            </span>
          </div>
          {hasDeliveryItems && (
            <div className="flex items-center justify-between text-[15px]">
              <span className="font-normal text-gray-700">Delivery</span>
              <span className="tabular-nums font-semibold">£5.00</span>
            </div>
          )}
          <div className="flex items-center justify-between text-[15px]">
            <span className="font-normal text-gray-700">VAT</span>
            <span className="tabular-nums font-semibold">
              £{cart.vat?.toFixed(2)}
            </span>
          </div>
          <Separator className="my-2 bg-gray-300" />
          <div className="flex items-baseline justify-between">
            <span className="text-base font-medium text-gray-900">Total</span>
            <span className="text-xl tabular-nums font-bold">
              £{cart.totalPriceWithVat?.toFixed(2)}
            </span>
          </div>
        </div>

        {!isCheckout && <CheckoutButton />}

        <div className="pt-2">
          <h3 className="font-semibold text-sm mb-4">
            Accepted Payment Methods
          </h3>
          <AcceptedPayments />
        </div>
      </CardContent>
    </Card>
  );
}
