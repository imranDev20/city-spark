"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Banknote,
  Check,
  CreditCard,
  Package2,
  Shield,
  Store,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DeliveryAddress from "./_components/delivery-address";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PaypalIcon from "@/components/icons/paypal";

type CheckoutStep = "contact" | "fulfillment" | "payment" | "review";

interface Address {
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("contact");
  const subtotal = 180.0;
  const vat = subtotal * 0.2;
  const shipping = 5.0;
  const total = subtotal + vat + shipping;

  const deliveryItems = [
    {
      id: 1,
      name: "Worcester Bosch Greenstar 4000 30kW Combi Gas Boiler",
      price: 100,
      quantity: 2,
    },
    {
      id: 2,
      name: "Ideal Logic Plus 24kW System Boiler with Horizontal Flue",
      price: 50,
      quantity: 1,
    },
  ];

  const collectionItems = [
    {
      id: 3,
      name: "Vaillant ecoTEC Plus 825 Combi Gas Boiler with Built-in Clock",
      price: 30,
      quantity: 1,
    },
  ];

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

  const branchAddress: Address = {
    line1: "123 High Street",
    city: "London",
    county: "Greater London",
    postcode: "SW1A 1AA",
  };

  const formatAddress = (address: Address) => {
    return [
      address.line1,
      address.line2,
      address.city,
      address.county,
      address.postcode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/basket"
            className="flex items-center text-sm font-medium hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to basket
          </Link>
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Secure Checkout</span>
          </div>
        </div>
      </header>

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
            <Card className="border-gray-200/75 shadow-sm overflow-hidden bg-white">
              {currentStep === "contact" && (
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                      <User className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Contact Details
                    </h2>
                  </div>
                  <Separator className="bg-gray-100" />
                  <div className="grid gap-6 max-w-2xl">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          className="bg-gray-50/50 border-gray-200"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          className="bg-gray-50/50 border-gray-200"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className="bg-gray-50/50 border-gray-200"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        className="bg-gray-50/50 border-gray-200"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "fulfillment" && (
                <div className="divide-y divide-gray-100">
                  {deliveryItems.length > 0 && (
                    <div className="p-8 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                          <Truck className="w-4 h-4" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Delivery Items
                        </h2>
                      </div>
                      <Separator className="bg-gray-100" />
                      <div className="space-y-6">
                        <div className="bg-gray-50/50 rounded-lg p-4 divide-y divide-gray-200">
                          {deliveryItems.map((item) => (
                            <div
                              className="flex justify-between py-3 text-sm first:pt-1 last:pb-1 gap-4"
                              key={item.id}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-900 font-medium line-clamp-2">
                                  {item.name}
                                </p>
                                <p className="text-gray-500 mt-1">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <span className="font-medium text-right whitespace-nowrap">
                                £{item.price.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <DeliveryAddress />
                      </div>
                    </div>
                  )}

                  {collectionItems.length > 0 && (
                    <div className="p-8 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                          <Store className="w-4 h-4" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Collection Items
                        </h2>
                      </div>
                      <Separator className="bg-gray-100" />
                      <div className="space-y-6">
                        <div className="bg-gray-50/50 rounded-lg p-4">
                          {collectionItems.map((item) => (
                            <div
                              className="flex justify-between py-3 text-sm first:pt-1 last:pb-1 gap-4"
                              key={item.id}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-900 font-medium line-clamp-2">
                                  {item.name}
                                </p>
                                <p className="text-gray-500 mt-1">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <span className="font-medium text-right whitespace-nowrap">
                                £{item.price.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-start bg-gray-50 rounded-lg border p-4">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <Store className="h-4 w-4 text-gray-500" />
                                <h3 className="font-medium text-gray-900">
                                  Collection Point
                                </h3>
                              </div>
                              <p className="text-gray-600 text-sm">
                                {formatAddress(branchAddress)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === "payment" && (
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
                        {/* Card payment form would go here */}
                        <p className="text-sm text-gray-500">
                          Card payment form implementation needed
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              <div className="px-8 py-6 bg-gray-50/50 border-t flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    const currentIndex = steps.findIndex(
                      (step) => step.id === currentStep
                    );
                    const prevStep = steps[currentIndex - 1]
                      ?.id as CheckoutStep;
                    if (prevStep) setCurrentStep(prevStep);
                  }}
                  disabled={currentStep === "contact"}
                  className="border-gray-200"
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    const currentIndex = steps.findIndex(
                      (step) => step.id === currentStep
                    );
                    const nextStep = steps[currentIndex + 1]
                      ?.id as CheckoutStep;
                    if (nextStep) setCurrentStep(nextStep);
                  }}
                  className="min-w-[100px]"
                >
                  Continue
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-6">
              <Card className="border-gray-200/75 shadow-sm bg-white">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Items</span>
                      <span className="font-medium">£150.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Collection Items</span>
                      <span className="font-medium">£30.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">£5.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">VAT</span>
                      <span className="font-medium">£{vat.toFixed(2)}</span>
                    </div>
                    <Separator className="bg-gray-100" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-lg">£{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex gap-3 text-sm text-emerald-700">
                  <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Secure Checkout</p>
                    <p className="text-emerald-600 mt-1">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
