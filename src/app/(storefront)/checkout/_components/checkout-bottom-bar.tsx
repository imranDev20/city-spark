"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Cart } from "@prisma/client";
import { cn } from "@/lib/utils";
import { NumericFormat } from "react-number-format";

interface CheckoutBottomBarProps {
  cart: Cart;
}

export default function CheckoutBottomBar({ cart }: CheckoutBottomBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDeliveryItems = cart.deliveryTotalWithVat > 0;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <div
        className={cn(
          "bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]",
          "transition-all duration-300 ease-in-out",
          isExpanded ? "h-auto" : "h-16"
        )}
      >
        {/* Collapsible Header - Only shown when collapsed */}
        {!isExpanded && (
          <div
            className="flex items-center justify-between px-4 h-16"
            onClick={() => setIsExpanded(true)}
          >
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Total</span>
              <NumericFormat
                value={cart.totalPriceWithVat}
                displayType="text"
                prefix="£"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator
                className="text-lg font-bold"
              />
            </div>
            <ChevronUp className="h-5 w-5 text-gray-400 rotate-180" />
          </div>
        )}

        {/* Expandable Content */}
        <div
          className={cn(
            "px-4 overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-[400px] py-4" : "max-h-0"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <button onClick={() => setIsExpanded(false)}>
              <ChevronUp className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-[15px]">
              <span className="text-gray-700">Subtotal (exc. VAT)</span>
              <NumericFormat
                value={cart.subTotalWithoutVat}
                displayType="text"
                prefix="£"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator
                className="font-semibold"
              />
            </div>

            {hasDeliveryItems && (
              <div className="flex justify-between text-[15px]">
                <span className="text-gray-700">Delivery</span>
                <NumericFormat
                  value={cart.deliveryCharge}
                  displayType="text"
                  prefix="£"
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator
                  className="font-semibold"
                />
              </div>
            )}

            <div className="flex justify-between text-[15px]">
              <span className="text-gray-700">VAT</span>
              <NumericFormat
                value={cart.vat}
                displayType="text"
                prefix="£"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator
                className="font-semibold"
              />
            </div>

            <Separator className="bg-gray-200" />

            <div className="flex items-baseline justify-between">
              <span className="text-base font-medium text-gray-900">Total</span>
              <div className="text-right">
                <NumericFormat
                  value={cart.totalPriceWithVat}
                  displayType="text"
                  prefix="£"
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator
                  className="text-xl font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </div>
  );
}
