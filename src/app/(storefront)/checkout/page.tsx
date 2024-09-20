import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { CheckboxWithText } from "./_components/checkbox";

export default function CheckoutPage() {
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

      <div className="grid sm:grid-cols-[70%_30%] gap-5">
        <div className="flex gap-4 flex-col">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">1. Contact details</CardTitle>
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
                <Button> Continue </Button>
                <p className="w-60 text-gray-500">
                  By continuing you are agreeing to our{" "}
                  <span className="underline decoration-gray-500 decoration-1">
                    Privacy Policy
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-500">
                2. Collection details
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-500">
                3. Payment
              </CardTitle>
            </CardHeader>
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
