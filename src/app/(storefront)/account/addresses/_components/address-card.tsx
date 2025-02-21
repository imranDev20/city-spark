"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaTrash } from "react-icons/fa";
import { Address } from "@prisma/client";

interface AddressCardProps {
  address: Address;
  onDelete?: (id: string) => void;
}

export default function AddressCard({ address, onDelete }: AddressCardProps) {
  return (
    <Card className="bg-white hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="space-y-2">
              <p className="font-medium text-base">{address.addressLine1}</p>
              {address.addressLine2 && (
                <p className="text-gray-600 text-base">
                  {address.addressLine2}
                </p>
              )}
              <p className="text-base">
                {address.city}
                {address.county && `, ${address.county}`}
              </p>
              <p className="font-medium text-base">{address.postcode}</p>
              <p className="text-base">{address.country}</p>
            </div>
          </div>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-600 hover:bg-red-50 -mt-1"
            onClick={() => onDelete?.(address.id)}
          >
            <FaTrash className="h-4 w-4" />
            <span className="sr-only">Delete address</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
