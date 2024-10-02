"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import PaypalIcon from "@/components/icons/paypal";
import CreditOrDebitIcon from "@/components/icons/card";

export default function PaymentMethod() {
  const [selectedPayment, setSelectedPayment] = useState("paypal");
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <Card className="shadow-none border-gray-350">
      <CardHeader>
        <CardTitle className="text-[30px] font-semibold">
          Payment details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedPayment}
          onValueChange={setSelectedPayment}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paypal" id="paypal" />
            <Card className="w-full bg-white border-[#BFBFBF] shadow-sm">
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full">
                  <PaypalIcon />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">PayPal</p>
                  <p className="text-sm text-gray-500">
                    Pay in 3 interest-free payments on purchases
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="credit-debit" id="credit-debit" />
            <Card className="w-full bg-white border-[#BFBFBF] shadow-sm">
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full">
                  <CreditOrDebitIcon />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Credit Card/Debit Card
                  </p>
                  <p className="text-sm text-gray-500">
                    We accept Visa, Mastercard
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </RadioGroup>

        <div className="mt-6 pl-[27px]">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) =>
                setTermsAccepted(checked as boolean)
              }
            />
            <Label htmlFor="terms" className="text-sm text-gray-500">
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
                console.log("Continuing with payment...");
                // Add your payment processing logic here
              } else {
                console.log("Please accept the Terms and Conditions");
              }
            }}
            disabled={!termsAccepted}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
