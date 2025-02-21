"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Check, CreditCard, Package2, User } from "lucide-react";
import { CartWithItems } from "@/services/storefront-cart";
import { ContactDetailsForm } from "./contact-details-form";
import { FulfillmentForm } from "./fulfillment-form";
import CheckoutHeader from "./checkout-header";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentStep from "./payment-step";
import { CheckoutStep } from "../page";
import OrderSummaryCard from "../../basket/_components/order-summary-card";
import MobileStepper from "./mobile-stepper";
import CheckoutBottomBar from "./checkout-bottom-bar";
import Link from "next/link";
import DesktopStepper from "./desktop-stepper";

export default function CheckoutComponent({ cart }: { cart: CartWithItems }) {
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

  // Get current step index and next step label
  const currentStepIndex =
    steps.findIndex((step) => step.id === currentStep) + 1;
  const nextStepLabel =
    currentStepIndex < steps.length
      ? steps[currentStepIndex].label
      : "Complete Order";

  return (
    <div className="min-h-screen bg-gray-50/50">
      <CheckoutHeader />

      {/* Mobile Stepper */}
      <MobileStepper
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        nextStep={nextStepLabel}
      />

      {/* Desktop Stepper */}
      <DesktopStepper currentStep={currentStepIndex} steps={steps.length} />

      <main className="container max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-8">
            <Card className="bg-white">
              {currentStep === "contact" && (
                <ContactDetailsForm onNext={() => goToStep("fulfillment")} />
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
            <div className="lg:sticky lg:top-28">
              <OrderSummaryCard isCheckout cart={cart} />
            </div>
          </div>
        </div>
      </main>

      <CheckoutBottomBar cart={cart} />
    </div>
  );
}
