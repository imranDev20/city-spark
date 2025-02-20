"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FaMapMarkerAlt,
  FaPlus,
  FaHome,
  FaBuilding,
  FaStar,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Address } from "@prisma/client";
import { fetchUserAddresses } from "@/services/account-addresses";
import DeliveryAddress from "../../checkout/_components/delivery-address";

export default function AccountAddressesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchUserAddresses,
  });

  if (isLoading) {
    return <p>Loading addresses...</p>;
  }

  if (error || !data?.success) {
    return <p>Error loading addresses: {data?.message || "Unknown error"}</p>;
  }

  const addresses: Address[] = data.data || [];

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
              <FaMapMarkerAlt className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Addresses</h1>
              <p className="text-primary-foreground/90 mt-1">
                Manage your delivery and billing addresses
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <Button
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => setIsDialogOpen(true)}
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {addresses.map((address) => (
          <Card
            key={address.id}
            className="group transition-all duration-200 bg-white"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Left Icon Column */}
                <div className="flex-shrink-0">
                  {address.isDefaultShipping || address.isDefaultBilling ? (
                    <FaBuilding className="h-6 w-6 text-primary" />
                  ) : (
                    <FaHome className="h-6 w-6 text-gray-400" />
                  )}
                </div>

                {/* Main Content Column */}
                <div className="flex-1 min-w-0">
                  {/* Header Section */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-gray-900">
                      {address.isDefaultShipping && address.isDefaultBilling
                        ? "Default Shipping & Billing"
                        : address.isDefaultShipping
                        ? "Default Shipping"
                        : address.isDefaultBilling
                        ? "Default Billing"
                        : "Delivery Address"}
                    </h3>
                    {(address.isDefaultShipping ||
                      address.isDefaultBilling) && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <FaStar className="h-3 w-3" />
                        Default
                      </span>
                    )}
                  </div>

                  {/* Address Details */}
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <p className="font-medium text-gray-900">
                      {address.addressLine1}
                    </p>
                    {address.addressLine2 && (
                      <p className="text-gray-600">{address.addressLine2}</p>
                    )}
                    <p>
                      {address.city}
                      {address.county && `, ${address.county}`}
                    </p>
                    <p className="font-medium">{address.postcode}</p>
                    <p>{address.country}</p>
                  </div>
                </div>

                {/* Actions Column - Appears on hover on desktop */}
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:translate-x-4 group-hover:translate-x-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-primary hover:bg-primary/10"
                  >
                    <FaPencilAlt className="h-4 w-4" />
                    <span className="sr-only">Edit address</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
                  >
                    <FaTrashAlt className="h-4 w-4" />
                    <span className="sr-only">Delete address</span>
                  </Button>
                </div>

                {/* Mobile Actions - Always visible on mobile */}
                <div className="absolute bottom-4 right-4 flex gap-2 sm:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-gray-50 text-gray-500 hover:text-primary hover:bg-primary/10"
                  >
                    <FaPencilAlt className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-gray-50 text-gray-500 hover:text-red-500 hover:bg-red-50"
                  >
                    <FaTrashAlt className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaMapMarkerAlt className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">
            No addresses found
          </h3>
          <p className="text-gray-500 mt-1 max-w-sm mx-auto">
            Add a new address to manage your shipping and billing preferences
          </p>
        </div>
      )}

      <DeliveryAddress open={isDialogOpen} setOpen={setIsDialogOpen} />
    </div>
  );
}
