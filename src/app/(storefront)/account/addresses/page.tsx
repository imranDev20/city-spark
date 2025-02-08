"use client";

import React from "react";
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

// Types
type AddressType = "BILLING" | "SHIPPING";

interface Address {
  id: string;
  type: AddressType[];
  isDefault: boolean;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
}

// Dummy data
const dummyAddresses: Address[] = [
  {
    id: "1",
    type: ["SHIPPING", "BILLING"],
    isDefault: true,
    addressLine1: "123 Main Street",
    addressLine2: "Flat 4B",
    city: "London",
    county: "Greater London",
    postcode: "SW1A 1AA",
    country: "United Kingdom",
  },
  {
    id: "2",
    type: ["SHIPPING"],
    isDefault: false,
    addressLine1: "456 High Street",
    city: "Manchester",
    county: "Greater Manchester",
    postcode: "M1 1AA",
    country: "United Kingdom",
  },
];

export default function AccountAddressesPage() {
  return (
    <div className="space-y-8">
      {/* Header Card */}
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

      {/* Add New Address Button */}
      <div>
        <Button size="lg" className="w-full sm:w-auto">
          <FaPlus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {/* Addresses Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {dummyAddresses.map((address) => (
          <Card key={address.id} className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                {address.type.includes("SHIPPING") &&
                address.type.includes("BILLING") ? (
                  <FaBuilding className="h-5 w-5 text-gray-500 mt-1" />
                ) : address.type.includes("SHIPPING") ? (
                  <FaHome className="h-5 w-5 text-gray-500 mt-1" />
                ) : (
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-500 mt-1" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {address.type.includes("SHIPPING") &&
                      address.type.includes("BILLING")
                        ? "Shipping & Billing Address"
                        : address.type.includes("SHIPPING")
                        ? "Shipping Address"
                        : "Billing Address"}
                    </h3>
                    {address.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                        <FaStar className="h-3 w-3" />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.city}</p>
                    {address.county && <p>{address.county}</p>}
                    <p>{address.postcode}</p>
                    <p>{address.country}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FaPencilAlt className="h-4 w-4 text-gray-500 hover:text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FaTrashAlt className="h-4 w-4 text-gray-500 hover:text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {dummyAddresses.length === 0 && (
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
    </div>
  );
}
