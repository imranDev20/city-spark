"use client";

import { Separator } from "@/components/ui/separator";
import { Prisma, FulFillmentType } from "@prisma/client";
import { NumericFormat } from "react-number-format";
import CheckoutButton from "./checkout-button";

type CartWithItems = Prisma.CartGetPayload<{
  include: {
    cartItems: true;
  };
}>;

interface MobileOrderSummaryProps {
  cart: CartWithItems;
}

export default function MobileOrderSummary({ cart }: MobileOrderSummaryProps) {
  const itemCount = cart.cartItems.length;
  const hasDeliveryItems = cart.cartItems.some(
    (item) => item.type === FulFillmentType.FOR_DELIVERY
  );

  return (
    <>
      <div className="lg:hidden sticky bottom-[116px] bg-white shadow-lg">
        <div className="bg-primary/5 p-3">
          <div className="flex items-center gap-2">
            <div className="font-semibold whitespace-nowrap">
              <span className="text-secondary">{itemCount}</span> total items
            </div>
            {hasDeliveryItems && (
              <>
                <div className="h-3 w-3 flex-shrink-0 rounded-full bg-gray-400" />
                <span className="truncate">
                  Delivery: 94 Hamlets Way, Bow, London E3 4SY
                </span>
              </>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Subtotal (exc. VAT)</span>
            <NumericFormat
              value={cart.subTotalWithoutVat}
              displayType="text"
              prefix="£"
              fixedDecimalScale
              decimalScale={2}
              thousandSeparator
              className="tabular-nums font-semibold"
            />
          </div>

          {hasDeliveryItems && cart.deliveryCharge > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Delivery</span>
              <NumericFormat
                value={cart.deliveryCharge}
                displayType="text"
                prefix="£"
                fixedDecimalScale
                decimalScale={2}
                thousandSeparator
                className="tabular-nums font-semibold"
              />
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">VAT</span>
            <NumericFormat
              value={cart.vat}
              displayType="text"
              prefix="£"
              fixedDecimalScale
              decimalScale={2}
              thousandSeparator
              className="tabular-nums font-semibold"
            />
          </div>

          <Separator />

          <div className="flex items-baseline justify-between">
            <span className="font-medium">Total</span>
            <NumericFormat
              value={cart.totalPriceWithVat}
              displayType="text"
              prefix="£"
              fixedDecimalScale
              decimalScale={2}
              thousandSeparator
              className="text-lg tabular-nums font-bold"
            />
          </div>
        </div>
      </div>

      {/* Separated fixed button */}
      <div className="lg:hidden fixed bottom-[63px] left-0 right-0 p-4 bg-white border-t shadow-lg z-50">
        <CheckoutButton />
      </div>
    </>
  );
}
