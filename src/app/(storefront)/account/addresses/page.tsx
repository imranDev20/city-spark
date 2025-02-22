"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Address } from "@prisma/client";
import { fetchUserAddresses } from "@/services/account-addresses";
import DeliveryAddress from "../../checkout/_components/delivery-address";
import AddressCard from "./_components/address-card";

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

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card
          className="bg-white hover:bg-gray-100 border-2 border-dashed cursor-pointer transition-colors duration-200 flex items-center justify-center"
          onClick={() => setIsDialogOpen(true)}
        >
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
              <FaPlus className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="font-medium text-gray-900">Add New Address</h3>
          </CardContent>
        </Card>
        {addresses.map((address) => (
          <AddressCard address={address} key={address.id} />
        ))}
      </div>
      <DeliveryAddress open={isDialogOpen} setOpen={setIsDialogOpen} />
    </div>
  );
}
