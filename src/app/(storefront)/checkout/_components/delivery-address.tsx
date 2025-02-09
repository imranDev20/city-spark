"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FaPen, FaTruck } from "react-icons/fa";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDeliveryStore } from "@/hooks/use-delivery-store";
import { fetchPostcodes, fetchPostcodeDetails } from "@/services/woosmap";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";

export default function DeliveryAddress() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [addressDetails, setAddressDetails] = useState({
    address1: "",
    address2: "",
    city: "",
    county: "",
  });

  const debouncedSearch = useDebounce(search, 300);

  const { data: postcodeResults } = useQuery({
    queryKey: ["postcodes", debouncedSearch],
    queryFn: () => fetchPostcodes(debouncedSearch),
    enabled: debouncedSearch.length > 2,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setSearch(value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const suggestions = postcodeResults?.localities ?? [];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handlePostcodeSelect(
            suggestions[selectedIndex].public_id,
            suggestions[selectedIndex].description.split(",")[0]
          );
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  const handlePostcodeSelect = async (publicId: string, postcode: string) => {
    try {
      setSearch(postcode);
      setShowSuggestions(false);

      const details = await fetchPostcodeDetails(publicId);

      // Extract address components
      const addressComponents = details.result.address_components;

      // Get City of London for address line 2
      const cityOfLondon =
        addressComponents.find((comp) =>
          comp.types.includes("administrative_area_level_1")
        )?.long_name || "";

      // Get specific area (Barking and Dagenham) for city
      const area =
        addressComponents.find((comp) =>
          comp.types.includes("division_level_3")
        )?.long_name || "";

      // Get county (England)
      const county =
        addressComponents.find((comp) =>
          comp.types.includes("division_level_1")
        )?.long_name || "";

      setAddressDetails({
        address1: "", // Street address not provided by API
        address2: cityOfLondon, // "City of London"
        city: area || "", // "Barking and Dagenham"
        county, // "England"
      });
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  const handleClear = () => {
    setSearch("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(false);
  };

  return (
    <>
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
              <div className="relative">
                <div
                  className={cn(
                    "flex h-12 items-center bg-muted rounded-sm border border-transparent",
                    "transition-colors duration-200",
                    "hover:border-border",
                    isFocused && "border-border"
                  )}
                >
                  <div className="px-4 text-muted-foreground">
                    <Search className="h-5 w-5" />
                  </div>

                  <input
                    className={cn(
                      "flex-1 h-full border-0 bg-transparent px-0",
                      "focus-visible:ring-0 focus-visible:ring-offset-0",
                      "w-full py-2 outline-none",
                      "placeholder:normal-case",
                      "uppercase"
                    )}
                    placeholder="Enter your postcode..."
                    value={search}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoComplete="postal-code"
                    type="text"
                    aria-label="Postcode search"
                    aria-expanded={showSuggestions}
                    role="combobox"
                  />

                  {search && (
                    <button
                      onClick={handleClear}
                      className="px-4 text-muted-foreground hover:text-foreground"
                      aria-label="Clear search"
                      type="button"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {showSuggestions &&
                  search &&
                  (postcodeResults?.localities ?? []).length > 0 && (
                    <Card
                      className="absolute w-full mt-1 shadow-lg overflow-hidden rounded-md"
                      style={{ zIndex: 101 }}
                    >
                      <CardContent className="p-0 max-h-[300px] overflow-y-auto">
                        <div className="py-2" role="listbox">
                          {(postcodeResults?.localities ?? []).map(
                            (item, index) => (
                              <div
                                key={item.public_id}
                                onClick={() =>
                                  handlePostcodeSelect(
                                    item.public_id,
                                    item.description.split(",")[0]
                                  )
                                }
                                className={cn(
                                  "px-4 py-3 transition-colors duration-150 cursor-pointer",
                                  "hover:bg-secondary/10",
                                  "focus:bg-secondary/10 focus:outline-none",
                                  "active:bg-secondary/20",
                                  index === selectedIndex && "bg-secondary/10"
                                )}
                                role="option"
                                aria-selected={index === selectedIndex}
                                tabIndex={0}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {item.description.split(",")[0]}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {item.description
                                      .split(",")
                                      .slice(1)
                                      .join(",")
                                      .trim()}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
              </div>

              <Input
                placeholder="Address Line 1"
                required
                value={addressDetails.address1}
                onChange={(e) =>
                  setAddressDetails((prev) => ({
                    ...prev,
                    address1: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Address Line 2 (Optional)"
                value={addressDetails.address2}
                onChange={(e) =>
                  setAddressDetails((prev) => ({
                    ...prev,
                    address2: e.target.value,
                  }))
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="City"
                  required
                  value={addressDetails.city}
                  onChange={(e) =>
                    setAddressDetails((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="County (Optional)"
                  value={addressDetails.county}
                  onChange={(e) =>
                    setAddressDetails((prev) => ({
                      ...prev,
                      county: e.target.value,
                    }))
                  }
                />
              </div>
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
