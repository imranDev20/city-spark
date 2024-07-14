// this is a catch all route
"use client";

import { cartData } from "@/app/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  CircleMinus,
  CirclePlus,
  LockKeyhole,
  Plus,
  SquareMinus,
  SquarePlus,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function CartPage() {
  const [isAddPromo, setIsAddPromo] = useState<boolean>(false);
  return (
    <div className="container mx-auto mt-6 mb-4">
      <div className="grid sm:grid-cols-[70%_30%] gap-5">
        <div className="flex gap-4 flex-col">
          {cartData.map((data) => {
            return (
              <Card key={data.id}>
                <div className="grid grid-cols-[25%_60%_10%] gap-2">
                  <div className="">
                    <img
                      src={data?.src}
                      alt={data?.name}
                      className="w-full h-40 "
                    />
                  </div>
                  <div className="flex flex-col gap-4 ps-3 ">
                    <div className="mt-2">
                      <h3 className="font-bold text-2xl">{data?.name}</h3>
                    </div>
                    <div className="flex items-center">
                      <small className="flex gap-2">
                        <span className="text-gray">${data?.price}</span> X{" "}
                        <span className="text-gray">1</span>
                      </small>
                      <p className="text-secondary font-bold ms-2">
                        ${data?.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button">
                        <SquarePlus className="text-primary" />
                      </button>
                      <span className="">1</span>
                      <button type="button">
                        <SquareMinus className="text-primary" />
                      </button>
                    </div>
                  </div>
                  <div className="flex  justify-end mt-2">
                    <X />
                  </div>
                </div>
              </Card>
            );
          })}
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
              <div className="mt-4 mb-4">
                {!isAddPromo && (
                  <button
                    onClick={() => setIsAddPromo((prev) => !prev)}
                    className="flex gap-1"
                  >
                    <Plus />
                    Add promo code
                  </button>
                )}
                {isAddPromo && (
                  <div>
                    <p className="text-md font-bold">Add Promo Code</p>
                    <p className="text-gray-500 text-sm">
                      Promotions and coupon codes can not be used in conjunction
                      or with any other offer.
                    </p>
                    {/* <FormField
                        // control={control}
                        name="promo code"
                        render={({ field }) => (
                          <FormItem>
                          
                            <FormControl>
                              <Input
                                placeholder="Enter product name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}
                    <Input
                      className="bg-white mt-2"
                      placeholder="Enter promo code"
                    />
                    <div className="flex gap-3 mt-4">
                      <Button variant="secondary">Save</Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddPromo(false)}
                      >
                        Cancle
                      </Button>
                    </div>
                  </div>
                )}
              </div>
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
              <div className="mt-2">
                <Button className="w-full h-10 flex items-center gap-2">
                  <LockKeyhole /> <span> Checkout Securely</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
