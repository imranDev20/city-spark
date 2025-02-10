"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Cart } from "@prisma/client";
import { NumericFormat } from "react-number-format";
import CheckoutButton from "./checkout-button";
import AcceptedPayments from "../../_components/accepted-payments";

interface OrderSummaryCardProps {
  cart: Cart;
  isCheckout?: boolean;
}

export default function OrderSummaryCard({
  cart,
  isCheckout = false,
}: OrderSummaryCardProps) {
  const hasDeliveryItems = cart.deliveryTotalWithVat > 0;

  return (
    <div className="hidden lg:block">
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isCheckout && (
            <>
              {" "}
              <div className="space-y-3">
                <h3 className="font-semibold text-base">Add Promo Code</h3>
                <p className="text-sm text-gray-600">
                  Promotions and coupon codes can not be used in conjunction or
                  with any other offer.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Gift card or promo code"
                    className="border-border"
                  />
                  <Button className="bg-secondary hover:bg-secondary/90 transition-colors">
                    Apply
                  </Button>
                </div>
              </div>
            </>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between text-[15px]">
              <span className="font-normal text-gray-700">
                Subtotal (exc. VAT)
              </span>
              <NumericFormat
                value={cart.subTotalWithoutVat}
                displayType="text"
                prefix="£"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator
                className="tabular-nums font-semibold"
              />
            </div>

            {hasDeliveryItems && (
              <div className="flex items-center justify-between text-[15px]">
                <span className="font-normal text-gray-700">Delivery</span>
                <NumericFormat
                  value={cart.deliveryCharge}
                  displayType="text"
                  prefix="£"
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator
                  className="tabular-nums font-semibold"
                />
              </div>
            )}

            <div className="flex items-center justify-between text-[15px]">
              <span className="font-normal text-gray-700">VAT</span>
              <NumericFormat
                value={cart.vat}
                displayType="text"
                prefix="£"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator
                className="tabular-nums font-semibold"
              />
            </div>

            <Separator className="my-2 bg-gray-300" />

            <div className="flex items-baseline justify-between">
              <span className="text-base font-medium text-gray-900">Total</span>
              <NumericFormat
                value={cart.totalPriceWithVat}
                displayType="text"
                prefix="£"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator
                className="text-xl tabular-nums font-bold"
              />
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
    </div>
  );
}
