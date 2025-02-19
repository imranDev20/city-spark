import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";
import CheckoutHeader from "../_components/checkout-header";

export default function CheckoutResultPage() {
  return (
    <div className="bg-gray-50/50">
      <CheckoutHeader />

      <main className="container max-w-screen-xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Order Confirmed
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Thank you for your order! We&apos;ve sent a confirmation email to
              your inbox with all the details.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 max-w-sm mx-auto">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">SPR-12345</span>
              </div>
              {/* <div className="flex justify-between">
            <span className="text-gray-600">Amount Paid:</span>
            <span className="font-medium">£{total.toFixed(2)}</span>
          </div> */}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link href="/account/orders">
              <Button variant="outline" className="border-border">
                View Order
              </Button>
            </Link>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
