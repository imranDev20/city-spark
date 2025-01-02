"use client";

import { Banknote, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import PaypalIcon from "@/components/icons/paypal";
import { useState } from "react";
import { updateOrderPayment } from "../actions"; // Create this action
import { CartWithItems } from "@/services/storefront-cart";
import { useRouter } from "next/navigation";

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
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get the pre-order ID from session storage
      const orderId = sessionStorage.getItem("pre_order_id");

      if (!orderId) {
        throw new Error("Order information not found");
      }

      // Update order payment details
      const result = await updateOrderPayment({
        orderId,
        cartId: cart.id,
        paymentMethod,
        paymentStatus: "PAID", // Or "PENDING" depending on the payment method
        orderStatus: "PENDING", // Update from AWAITING_PAYMENT to PENDING
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      // Proceed to next step if successful
      onNext();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Payment update failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
            <CreditCard className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Payment Method
          </h2>
        </div>

        <RadioGroup
          defaultValue="card"
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="grid gap-4"
        >
          <Label
            className={`flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors ${
              paymentMethod === "card"
                ? "border-primary bg-primary/5"
                : "border-gray-200"
            }`}
          >
            <RadioGroupItem value="card" className="mr-4" />
            <CreditCard className="w-5 h-5 mr-3" />
            <div>
              <p className="font-medium">Credit/Debit Card</p>
              <p className="text-sm text-gray-500">
                Pay securely with your card
              </p>
            </div>
          </Label>

          <Label
            className={`flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors ${
              paymentMethod === "paypal"
                ? "border-primary bg-primary/5"
                : "border-gray-200"
            }`}
          >
            <RadioGroupItem value="paypal" className="mr-4" />
            <div className="w-5 h-5 mr-3 text-[#00457C]">
              <PaypalIcon width={30} height={30} />
            </div>
            <div>
              <p className="font-medium">PayPal</p>
              <p className="text-sm text-gray-500">
                Pay with your PayPal account
              </p>
            </div>
          </Label>

          <Label
            className={`flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors ${
              paymentMethod === "cash"
                ? "border-primary bg-primary/5"
                : "border-gray-200"
            }`}
          >
            <RadioGroupItem value="cash" className="mr-4" />
            <Banknote className="w-5 h-5 mr-3" />
            <div>
              <p className="font-medium">Cash on Delivery</p>
              <p className="text-sm text-gray-500">
                Pay when you receive your order
              </p>
            </div>
          </Label>
        </RadioGroup>

        {paymentMethod === "card" && (
          <Card className="p-4 mt-4 border-gray-200">
            <div className="grid gap-4">
              <p className="text-sm text-gray-500">
                Card payment form implementation needed
              </p>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-6 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="border-gray-200"
        >
          Back
        </Button>
        <Button type="submit" className="min-w-[100px]" disabled={isLoading}>
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}
