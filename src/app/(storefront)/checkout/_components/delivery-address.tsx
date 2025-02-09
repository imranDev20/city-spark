"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaPen, FaTruck } from "react-icons/fa";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { fetchPostcodeDetails, fetchPostcodes } from "@/services/woosmap";

interface Address {
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
}

export default function DeliveryAddress() {
  const [postcode, setPostcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Default address - replace with actual data from props or context
  const defaultAddress: Address = {
    line1: "123 High Street",
    line2: "Flat A",
    city: "London",
    county: "Greater London",
    postcode: "SW1A 1AA",
  };

  const handlePostcodeSearch = async (value: string) => {
    setPostcode(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchPostcodes(value);
      setSuggestions(response.localities);
    } catch (error) {
      console.error("Failed to fetch postcodes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPostcode = async (publicId: string) => {
    setIsLoadingDetails(true);
    try {
      const details = await fetchPostcodeDetails(publicId);
      const addressComponents = details.result.address_components;

      // Extract address components
      const postcode =
        addressComponents.find((comp) => comp.types.includes("postal_code"))
          ?.long_name || "";
      const city =
        addressComponents.find((comp) => comp.types.includes("postal_town"))
          ?.long_name || "";
      const county = addressComponents.find((comp) =>
        comp.types.includes("administrative_area_level_2")
      )?.long_name;

      setSelectedAddress({
        line1: "",
        city,
        county,
        postcode,
      });

      setSuggestions([]); // Clear suggestions after selection
    } catch (error) {
      console.error("Failed to fetch postcode details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const formatAddress = (address: Address) => {
    return [
      address.line1,
      address.line2,
      address.city,
      address.county,
      address.postcode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <button
      type="button"
      onClick={() => setIsDialogOpen(true)}
      className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg border hover:border-gray-400 p-4 w-full transition-all duration-200 group"
    >
      <div>
        <div className="flex items-center gap-3 mb-1">
          <FaTruck className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-gray-900 text-lg">
            Delivery Address
          </h3>
        </div>
        <p className="text-gray-600 text-sm pl-7">
          {formatAddress(defaultAddress)}
        </p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <FaPen className="h-5 w-5" />
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Delivery Address</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="relative">
              <Input
                placeholder="Enter Postcode"
                value={postcode}
                onChange={(e) => handlePostcodeSearch(e.target.value)}
                className="w-full"
              />

              {isLoading && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />
              )}

              {suggestions.length > 0 && (
                <Command className="absolute top-full left-0 right-0 z-50 mt-1">
                  <CommandGroup>
                    {suggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion.public_id}
                        onSelect={() =>
                          handleSelectPostcode(suggestion.public_id)
                        }
                        className="cursor-pointer"
                      >
                        {suggestion.description}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              )}
            </div>

            {selectedAddress && !isLoadingDetails && (
              <div className="space-y-4">
                <Input placeholder="Address Line 1" />
                <Input placeholder="Address Line 2 (Optional)" />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="City" value={selectedAddress.city} />
                  <Input
                    placeholder="County (Optional)"
                    value={selectedAddress.county || ""}
                  />
                </div>
                <Input
                  placeholder="Postcode"
                  value={selectedAddress.postcode}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </button>
  );
}
