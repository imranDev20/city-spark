"use client";

import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import PaypalIcon from "@/components/icons/paypal";
import { CartWithItems } from "@/services/storefront-cart";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

import PayoneerImage from "@/images/payoneer.png";
import VisaImage from "@/images/visa.png";
import MasterCardImage from "@/images/mastercard.png";
import KlarnaImage from "@/images/klarna.png";
import { updateOrderPayment } from "../actions";

const initialPayPalOptions = {
  clientId:
    "AXL51fanO-rNFcZfBwAvI9YztmDmGt6QNPeJrr2pxJrCqUFM-dQ0cXzmp9CxxjGI3lUDFldbG-CLEpuJ",
  currency: "GBP",
  intent: "capture",
};

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
  cart: CartWithItems;
}

export default function PaymentStep({
  onNext,
  onBack,
  cart,
}: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePaypalApprove = async (data: any, actions: any) => {
    try {
      const order = await actions.order.capture();

      // Get the pre-order ID from session storage
      const orderId = sessionStorage.getItem("pre_order_id");

      if (!orderId) {
        throw new Error("Order information not found");
      }

      // Update order payment details
      const result = await updateOrderPayment({
        orderId,
        cartId: cart.id,
        paymentMethod: "paypal",
        paymentStatus: "PAID",
        orderStatus: "PENDING",
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      onNext();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Payment failed",
        variant: "destructive",
      });
    }
  };
  const createPaypalOrder = async (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "GBP",
            value: cart.totalPriceWithVat.toString(),
          },
        },
      ],
    });
  };

  return (
    <PayPalScriptProvider options={initialPayPalOptions}>
      <div>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-1">
            <CardTitle className="text-2xl">Payment Details</CardTitle>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Choose your preferred payment method
          </p>
        </CardHeader>

        <Separator className="mb-6" />

        <CardContent>
          <div className="space-y-6">
            <RadioGroup
              defaultValue="paypal"
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="grid gap-4"
            >
              <Label
                className={`relative flex flex-col p-6 border rounded-lg cursor-pointer transition-all duration-200 ${
                  paymentMethod === "paypal"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="paypal" />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                    <div className="flex-shrink-0">
                      <PaypalIcon width={120} height={32} />
                    </div>

                    <Separator
                      orientation="vertical"
                      className="hidden sm:block h-8"
                    />

                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-gray-600">
                        Fast, secure checkout with
                      </p>
                      <div className="flex items-center gap-3">
                        {[
                          { image: VisaImage, alt: "Visa Card" },
                          { image: MasterCardImage, alt: "MasterCard" },
                          { image: PayoneerImage, alt: "Payoneer" },
                          { image: KlarnaImage, alt: "Klarna" },
                        ].map((payment) => (
                          <div
                            key={payment.alt}
                            className="bg-white rounded-md p-1.5 border border-gray-100 shadow-sm"
                          >
                            <Image
                              src={payment.image}
                              alt={payment.alt}
                              width={28}
                              height={28}
                              className="object-contain"
                              loading="lazy"
                              placeholder="blur"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Label>
            </RadioGroup>

            {paymentMethod === "paypal" && (
              <div className="mt-6 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isLoading}
                  className="border-border"
                >
                  Back
                </Button>
                <PayPalButtons
                  style={{
                    layout: "horizontal",
                    color: "blue",
                    shape: "rect",
                    label: "pay",
                    tagline: false,
                    height: 36,
                  }}
                  createOrder={createPaypalOrder}
                  onApprove={handlePaypalApprove}
                  onError={(err) => {
                    toast({
                      title: "Payment Error",
                      description: "There was an error processing your payment",
                      variant: "destructive",
                    });
                  }}
                />
              </div>
            )}

            {paymentMethod === "cash" && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isLoading}
                  className="border-border"
                >
                  Back
                </Button>
                <Button
                  onClick={() => onNext()}
                  className="min-w-[100px]"
                  disabled={isLoading}
                >
                  Continue with Cash
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </PayPalScriptProvider>
  );
}
