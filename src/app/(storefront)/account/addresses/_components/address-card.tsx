"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { Address } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteAddress } from "../actions";

interface AddressCardProps {
  address: Address;
}

export default function AddressCard({ address }: AddressCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAddress(address.id);

      if (result.success) {
        toast({
          title: "Address deleted",
          description: result.message,
          variant: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
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

                {/* Address Type Badges */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {address.isDefaultShipping && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
                      Default Shipping
                    </span>
                  )}
                  {address.isDefaultBilling && (
                    <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-md">
                      Default Billing
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-600 hover:bg-red-50"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <FaTrash className="h-4 w-4" />
              <span className="sr-only">Delete address</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
