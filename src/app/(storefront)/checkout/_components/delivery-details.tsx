"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CircleArrowDown,
  Package,
  Truck,
  Plus,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useEmblaCarousel from "embla-carousel-react";
import { Address } from "@prisma/client";
import { AddressFormData, addressSchema } from "../schema";

// Dummy data for addresses based on Prisma schema
const dummyAddresses: Address[] = [
  {
    id: "1",
    userId: "user1",
    addressLine1: "123 High Street",
    addressLine2: "Flat 4B",
    city: "London",
    county: "Greater London",
    postcode: "SW1A 1AA",
    country: "United Kingdom",
    isBilling: true,
    isShipping: false,
    isDefaultBilling: true,
    isDefaultShipping: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "user1",
    addressLine1: "456 Queen's Road",
    addressLine2: null,
    city: "Birmingham",
    county: "West Midlands",
    postcode: "B1 1BB",
    country: "United Kingdom",
    isBilling: false,
    isShipping: true,
    isDefaultBilling: false,
    isDefaultShipping: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    userId: "user1",
    addressLine1: "789 King's Avenue",
    addressLine2: "Suite 3",
    city: "Manchester",
    county: "Greater Manchester",
    postcode: "M1 1AA",
    country: "United Kingdom",
    isBilling: false,
    isShipping: false,
    isDefaultBilling: false,
    isDefaultShipping: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    userId: "user1",
    addressLine1: "321 Prince Street",
    addressLine2: null,
    city: "Edinburgh",
    county: "Midlothian",
    postcode: "EH1 1BB",
    country: "United Kingdom",
    isBilling: true,
    isShipping: true,
    isDefaultBilling: false,
    isDefaultShipping: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    userId: "user1",
    addressLine1: "654 Castle Road",
    addressLine2: "Flat 2C",
    city: "Cardiff",
    county: "South Glamorgan",
    postcode: "CF10 1DD",
    country: "United Kingdom",
    isBilling: false,
    isShipping: true,
    isDefaultBilling: false,
    isDefaultShipping: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    userId: "user1",
    addressLine1: "987 Royal Avenue",
    addressLine2: null,
    city: "Belfast",
    county: "Antrim",
    postcode: "BT1 1AA",
    country: "United Kingdom",
    isBilling: true,
    isShipping: false,
    isDefaultBilling: false,
    isDefaultShipping: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    userId: "user1",
    addressLine1: "135 Victoria Street",
    addressLine2: "Flat 7D",
    city: "Liverpool",
    county: "Merseyside",
    postcode: "L1 1AA",
    country: "United Kingdom",
    isBilling: false,
    isShipping: true,
    isDefaultBilling: false,
    isDefaultShipping: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function DeliveryDetails() {
  const [addresses, setAddresses] = useState<Address[]>(dummyAddresses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      country: "",
      postcode: "",
      city: "",
    },
  });

  const onSubmit = (data: AddressFormData) => {
    const newAddress: Address = {
      id: (addresses.length + 1).toString(),
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || null,
      postcode: data.postcode,
      city: data.city, // Make sure city is included, defaulting to null if not provided
      county: data.county || null, // Make sure county is included, defaulting to null if not provided
      isBilling: false,
      isShipping: true,
      country: data.country || "United Kingdom", // Default to UK if not specified
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user1",
      isDefaultBilling: null,
      isDefaultShipping: null,
    };

    setAddresses([...addresses, newAddress]);
    setIsDialogOpen(false);
    form.reset();
  };

  return (
    <Card className="shadow-none border-gray-350 mb-8">
      <CardHeader>
        <CardTitle className="text-[30px] font-semibold">
          Delivery details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {addresses.length > 0 && (
          <div className="mb-6">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="flex-[0_0_33.33%] min-w-0 px-2"
                  >
                    <Card className="bg-white border-[#BFBFBF] shadow-sm hover:shadow-md transition-shadow h-full">
                      <CardContent className="p-4 flex items-start">
                        <Home className="w-6 h-6 text-gray-500 mr-4 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{address.addressLine1}</p>
                          {address.addressLine2 && (
                            <p>{address.addressLine2}</p>
                          )}
                          <p>
                            {address.city}, {address.postcode}
                          </p>
                          <p>{address.country}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add New Address
          </Button>
          <div className="flex space-x-2">
            <Button
              onClick={scrollPrev}
              variant="outline"
              size="icon"
              disabled={!prevBtnEnabled}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={scrollNext}
              variant="outline"
              size="icon"
              disabled={!nextBtnEnabled}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="House number and street name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Apartment, suite, unit, etc."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City/Town</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="City or town" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="county"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>County (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="County" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="postcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Postcode" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            defaultValue="United Kingdom"
                            placeholder="Country"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  Add Address
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

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

        <p className="w-[80%] text-justify leading-5 font-normal text-[14px] mt-6">
          All our deliveries are kerbside, meaning your order is guaranteed to
          be left at the nearest access point to the provided address. You will
          be responsible for your delivery from there.
          <span className="underline cursor-pointer"> More details</span>
        </p>

        <div className="mt-6">
          <Button>Continue</Button>
        </div>
      </CardContent>
    </Card>
  );
}
