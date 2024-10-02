"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ChevronLeft,
  CircleArrowDown,
  Package,
  Truck,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { CheckboxWithText } from "./_components/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import AddDeliveryAddress from "./_components/add-delivery-address";
import AddPromoCode from "./_components/add-promo-code";
import PaypalIcon from "@/components/icons/paypal";
import CreditOrDebitIcon from "@/components/icons/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AcceptedPayments from "../_components/accepted-payments";
import DeliveryDetails from "./_components/delivery-details";
import PaymentMethod from "./_components/payment-method";

export default function CheckoutPage() {
  const subtotal = 180.0;
  const vat = subtotal * 0.2; // Assuming 20% VAT
  const total = subtotal + vat;

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/basket" className="flex items-center group">
          <Button variant="ghost" size="icon" className="h-9 w-9 mr-2">
            <ArrowLeft className="h-5 w-5 group-hover:text-primary transition-colors" />
            <span className="sr-only">Back</span>
          </Button>
          <span className="group-hover:text-primary transition-colors">
            Back to basket
          </span>
        </Link>
      </div>

      <h1 className="text-5xl font-extrabold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DeliveryDetails />
          <PaymentMethod />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card className="shadow-none bg-offWhite border-gray-350">
              <CardHeader>
                <CardTitle className="text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between mb-4">
                    <span>Subtotal (Ex.VAT)</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span>VAT</span>
                    <span>£{vat.toFixed(2)}</span>
                  </div>
                  <Separator className="my-4 bg-gray-350" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
                <Button variant="default" className="w-full">
                  Place Order
                </Button>

                <div className="mt-5">
                  <h3 className="font-semibold text-sm text-black mb-3">
                    Accepted Payment
                  </h3>
                  <AcceptedPayments />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
