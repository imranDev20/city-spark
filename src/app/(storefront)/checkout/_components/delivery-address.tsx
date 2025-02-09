"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FaPen, FaTruck } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeliveryStore } from "@/hooks/use-delivery-store";

export default function DeliveryAddress() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { postcode } = useDeliveryStore();

  const getAddressDetails = async () => {
    try {
      const response = await fetch(
        "https://api.woosmap.com/localities/details?public_id=biZ0JwHbgGydZAtwe1/s0dgz4MM=&key=woos-86debf53-3ace-3484-927d-9434918c93a9&page=1"
      );

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setIsDialogOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsDialogOpen(true);
          getAddressDetails();
        }}
        className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg border hover:border-gray-400 p-4 w-full transition-all duration-200 group"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <FaTruck className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900 text-lg">
              Delivery Address
            </h3>
          </div>
        </div>
        <FaPen className="h-5 w-5" />
      </button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Delivery Address</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 pt-4">
              <Input placeholder="Address Line 1" required />
              <Input placeholder="Address Line 2 (Optional)" />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="City" required />
                <Input placeholder="County (Optional)" />
              </div>
              <Input placeholder="Postcode" required />
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Address</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
