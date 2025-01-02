"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Check, CreditCard, Package2, User } from "lucide-react";
import { useState } from "react";
import { CartWithItems } from "@/services/storefront-cart";
import AcceptedPayments from "../../_components/accepted-payments";
import { ContactDetailsForm } from "./contact-details-form";
import { FulfillmentForm } from "./fulfillment-form";
import CheckoutHeader from "./checkout-header";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentStep from "./payment-step";
import { CheckoutStep } from "../page";

export default function CheckoutComponent({ cart }: { cart: CartWithItems }) {
  const deliveryItems =
    cart?.cartItems.filter((item) => item.type === "FOR_DELIVERY") || [];

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") || "contact";

  // Replace useState with URL updates
  const goToStep = (step: CheckoutStep) => {
    router.push(`/checkout?step=${step}`);
  };

  const steps = [
    {
      id: "contact",
      label: "Contact Details",
      icon: User,
      description: "Your personal information",
    },
    {
      id: "fulfillment",
      label: "Delivery & Collection",
      icon: Package2,
      description: "Address and collection details",
    },
    {
      id: "payment",
      label: "Payment",
      icon: CreditCard,
      description: "Review and pay",
    },
    {
      id: "review",
      label: "Confirmation",
      icon: Check,
      description: "Confirm your order",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <CheckoutHeader />

      <main className="container max-w-screen-xl mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const isCompleted =
                index < steps.findIndex((s) => s.id === currentStep);
              const isCurrent = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`relative ${
                    isCompleted
                      ? "text-emerald-600"
                      : isCurrent
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div
                      className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                      ${
                        isCompleted
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : isCurrent
                          ? "border-primary bg-primary text-white"
                          : "border-gray-200 bg-white"
                      }
                    `}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 transition-colors ${
                          isCompleted ? "bg-emerald-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                  <h3
                    className={`text-sm font-semibold ${
                      isCurrent ? "text-gray-900" : ""
                    }`}
                  >
                    {step.label}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-8 space-y-6">
            <Card className="shadow-none bg-offWhite border-gray-300">
              {currentStep === "contact" && (
                <ContactDetailsForm
                  onNext={() => goToStep("fulfillment")}
                  onBack={() => goToStep("contact")}
                />
              )}

              {currentStep === "fulfillment" && (
                <FulfillmentForm
                  onNext={() => goToStep("payment")}
                  onBack={() => goToStep("contact")}
                  cart={cart}
                />
              )}

              {currentStep === "payment" && (
                <PaymentStep
                  onNext={() => router.push("/checkout/result")}
                  onBack={() => goToStep("fulfillment")}
                  cart={cart}
                />
              )}
            </Card>
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-6">
              <Card className="shadow-none bg-offWhite border-gray-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-base">Add Promo Code</h3>
                    <p className="text-sm text-gray-600">
                      Promotions and coupon codes can not be used in conjunction
                      or with any other offer.
                    </p>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg border border-primary/10">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">
                            {appliedPromo.code}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAppliedPromo(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Gift card or promo code"
                          className="border-gray-300"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button
                          className="bg-secondary hover:bg-secondary/90 transition-colors"
                          onClick={() => {
                            // Demo applied promo
                            setAppliedPromo({
                              code: promoCode,
                              discount: 10.0,
                            });
                            setPromoCode("");
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[15px]">
                      <span className="font-normal text-gray-700">
                        Subtotal (exc. VAT)
                      </span>
                      <span className="tabular-nums font-semibold">
                        £{cart?.subTotalWithoutVat?.toFixed(2)}
                      </span>
                    </div>
                    {deliveryItems && deliveryItems.length > 0 && (
                      <div className="flex items-center justify-between text-[15px]">
                        <span className="font-normal text-gray-700">
                          Delivery
                        </span>
                        <span className="tabular-nums font-semibold">
                          £5.00
                        </span>
                      </div>
                    )}

                    {appliedPromo && (
                      <div className="flex items-center justify-between text-[15px] text-emerald-600">
                        <span>Promo Discount</span>
                        <span className="tabular-nums font-semibold">
                          -£{appliedPromo.discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[15px]">
                      <span className="font-normal text-gray-700">VAT</span>
                      <span className="tabular-nums font-semibold">
                        £{cart?.vat?.toFixed(2)}
                      </span>
                    </div>
                    <Separator className="my-2 bg-gray-300" />
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-medium text-gray-900">
                        Total
                      </span>
                      <span className="text-xl tabular-nums font-bold">
                        £{cart?.totalPriceWithVat?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="font-semibold text-sm mb-4">
                      Accepted Payment Methods
                    </h3>
                    <AcceptedPayments />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
