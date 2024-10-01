"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, CircleArrowDown, Package, Truck } from "lucide-react";
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

export default function CheckoutPage() {
  const [isOpenDeliveryDetails, setIsOpenDeliveryDetails] =
    React.useState(false);
  const [hideDeliveryButton, setHideDeliveryButton] = React.useState(false);
  const [isOpenPaymentDetails, setIsOpenPaymentDetails] = React.useState(false);
  const [hidePaymentButton, setHidePaymentButton] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState("paypal");
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  return (
    <div className="container mx-auto mt-6 mb-4">
      <div className="flex items-center gap-4 mb-5 mt-7">
        <Link href="/basket">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-md text-gray-500 font-semibold tracking-tight sm:grow-0">
          Back to cart
        </h1>
      </div>

      <h1 className="font-extrabold text-5xl my-[41.5px]">Checkout</h1>

      <div className="grid sm:grid-cols-[70%_30%] gap-5">
        <div className="flex gap-4 flex-col">
          <Card>
            <CardHeader>
              <CardTitle className="text-[30px] font-semibold">
                Contact details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <label htmlFor="" className="text-gray-500 ">
                  Full name
                </label>{" "}
                <span className="text-red-600">*</span>
                <Input
                  type="text"
                  id="fullname"
                  name="fullName"
                  className="w-2/4 mt-2 bg-[#F0F3F6]"
                />
              </div>
              <div className="mt-2">
                <label htmlFor="" className="text-gray-500 ">
                  Email address
                </label>{" "}
                <span className="text-red-600">*</span>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  className="w-2/4 mt-2 bg-[#F0F3F6]"
                />
              </div>
              <div className="mt-2">
                <label htmlFor="" className="text-gray-500 ">
                  Mobile Number
                </label>{" "}
                <span className="text-red-600">*</span>
                <Input
                  type="text"
                  id="text"
                  name="mobile"
                  className="w-2/4 mt-2 bg-[#F0F3F6]"
                />
              </div>
              <div className="mt-4 mb-4">
                <CheckboxWithText />
              </div>
              <Separator />
              <div className="flex gap-8 mt-4">
                <Button
                  onClick={() => {
                    setIsOpenDeliveryDetails(true);
                    setHideDeliveryButton(true);
                  }}
                >
                  Continue
                </Button>
                <p className="w-60 text-gray-500">
                  By continuing you are agreeing to our{" "}
                  <span className="underline decoration-gray-500 decoration-1">
                    Privacy Policy
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-[30px] font-semibold">
                Delivery details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Collapsible
                open={isOpenDeliveryDetails}
                onOpenChange={setIsOpenDeliveryDetails}
                className="w-full space-y-2"
              >
                <div className="flex items-center justify-between">
                  {!hideDeliveryButton && (
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        className=" rounded-[8px] py-2 px-4 bg-[#5F5E5E] text-xs font-bold hover:bg-[#5F5E5E] "
                        onClick={() => setHideDeliveryButton(true)}
                      >
                        Add Details
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>

                <CollapsibleContent className="space-y-2">
                  <div className="mb-6">
                    <AddDeliveryAddress />
                  </div>

                  <div className="space-y-6">
                    <Card className="w-[80%] bg-white border-[#BFBFBF] shadow-sm">
                      <CardContent className="p-4 flex items-center space-x-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Truck className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            1 items from Supplier Delivery
                          </p>
                          <p className="text-sm text-gray-500">
                            Estimated delivery: 19 Sep
                          </p>
                        </div>
                        <CircleArrowDown className="w-6 h-6 text-gray-400" />
                      </CardContent>
                    </Card>

                    <Card className="w-[80%] border-[#BFBFBF] bg-white shadow-sm">
                      <CardContent className="p-4 flex items-center space-x-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Package className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            2 items from carrier delivery
                          </p>
                          <p className="text-sm text-gray-500">
                            Estimated delivery: 18 Sep
                          </p>
                        </div>
                        <CircleArrowDown className="w-6 h-6 text-gray-400" />
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-6">
                    <p className="w-[80%] text-justify leading-5 font-normal text-[14px] mt-6">
                      All our deliveries are kerbside, meaning your order is
                      guaranteed to be left at the nearest access point to the
                      provided address. You will be responsible for your
                      delivery from there. 
                      <span className="underline cursor-pointer">
                        More details
                      </span>
                    </p>
                    <div className="space-y-6">
                      <Button
                        onClick={() => {
                          setIsOpenPaymentDetails(true);
                          setHidePaymentButton(true);
                        }}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-[30px] font-semibold">
                Payment details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Collapsible
                open={isOpenPaymentDetails}
                onOpenChange={setIsOpenPaymentDetails}
                className="w-full space-y-2"
              >
                <div className="flex items-center justify-between">
                  {!hidePaymentButton && (
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        className=" rounded-[8px] py-2 px-4 bg-[#5F5E5E] text-xs font-bold hover:bg-[#5F5E5E] "
                        onClick={() => setHidePaymentButton(true)}
                      >
                        Add Details
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>

                <CollapsibleContent className="space-y-2">
                  <div className="mb-6">
                    <AddPromoCode />
                  </div>

                  <RadioGroup
                    value={selectedPayment}
                    onValueChange={setSelectedPayment}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Card className="w-[80%] bg-white border-[#BFBFBF] shadow-sm">
                        <CardContent className="p-4 flex items-center space-x-4">
                          <div className="p-2 rounded-full">
                            <PaypalIcon />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              PayPal
                            </p>
                            <p className="text-sm text-gray-500">
                              Pay in 3 interest-free payments on purchases
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                      <RadioGroupItem value="credit-debit" id="credit-debit" />
                      <Card className="w-[80%] bg-white border-[#BFBFBF] shadow-sm">
                        <CardContent className="p-4 flex items-center space-x-4">
                          <div className="p-2 rounded-full">
                            <CreditOrDebitIcon />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Credit Card/Debit Card
                            </p>
                            <p className="text-sm text-gray-500">
                              We accept visa, master cards
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="mt-4 pl-[27px]">
                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                          id="terms"
                          checked={termsAccepted}
                          onCheckedChange={(checked) =>
                            setTermsAccepted(checked as boolean)
                          }
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I have read and accept the{" "}
                          <a href="#" className="text-blue-600 underline">
                            Terms and Conditions
                          </a>
                        </Label>
                      </div>
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                        onClick={() => {
                          if (termsAccepted) {
                            // Handle continue action
                            console.log("Continuing...");
                          } else {
                            console.log(
                              "Please accept the Terms and Conditions"
                            );
                          }
                        }}
                        disabled={!termsAccepted}
                      >
                        Continue
                      </Button>
                    </div>
                  </RadioGroup>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="bg-[#F0F3F6]">
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 mb-1">
                <div className="flex justify-between">
                  <p className="text-gray-500">Price before offer applied</p>
                  <p>$200.00</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500">Savings</p>
                  <p className="text-green-500">-$20.00</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500">Subtotal (Ex. VAT)</p>
                  <p>$180.00</p>
                </div>
              </div>
              <Separator />

              <Separator />

              <div className="flex justify-between mt-4 mb-4">
                <p className="text-gray-500">VAT</p>
                <p>$36.00</p>
              </div>
              <Separator />
              <div className="flex flex-col gap-2 mb-1 mt-2">
                <div className="flex justify-between">
                  <p className="font-bold">Total</p>
                  <p>$216.00</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500">Total (Ex. VAT)</p>
                  <p className="">$180</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
