"use client";

import React, { JSX, useState } from "react";
import { FaMapMarkerAlt, FaTruck } from "react-icons/fa";
import { Search, X } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { useDeliveryStore } from "@/hooks/use-delivery-store";
import { fetchPostcodes, WoosmapResponse } from "@/services/woosmap";

interface DeliveryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DeliveryDialog({ open, setOpen }: DeliveryDialogProps) {
  const { setPostcode } = useDeliveryStore();
  const [search, setSearch] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const debouncedSearch = useDebounce(search, 300);

  const { data: postcodeResults } = useQuery<WoosmapResponse, Error>({
    queryKey: ["postcodes", debouncedSearch],
    queryFn: () => fetchPostcodes(debouncedSearch),
    enabled: debouncedSearch.length > 2,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove the trim() to allow spaces while typing
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
          selectPostcode(suggestions[selectedIndex].description.split(",")[0]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  const selectPostcode = (selectedPostcode: string) => {
    setSearch(selectedPostcode);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleApply = (): void => {
    setPostcode(search);
    setOpen(false);
  };

  const handleClear = (): void => {
    setSearch("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl" style={{ zIndex: 100 }}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2.5">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FaTruck className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1.5">
              <DialogTitle>Set Delivery Postcode</DialogTitle>
              <DialogDescription>
                Enter your postcode to check delivery availability in your area.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="relative">
            <div
              className={cn(
                "flex h-12 items-center bg-white rounded-md border shadow-sm transition-all duration-200",
                "hover:border-secondary hover:shadow-md",
                isFocused &&
                  "border-secondary shadow-md ring-1 ring-secondary/20"
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
                  "placeholder:normal-case", // Make placeholder normal case
                  "uppercase" // Only text typed will be uppercase
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
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {showSuggestions &&
              search &&
              (postcodeResults?.localities ?? []).length > 0 && (
                <Card
                  style={{ zIndex: 101 }}
                  className="absolute w-full mt-1 shadow-lg overflow-hidden rounded-md"
                >
                  <CardContent className="p-0 max-h-[300px] overflow-y-auto">
                    <div className="py-2" role="listbox">
                      {(postcodeResults?.localities ?? []).map(
                        (item, index) => (
                          <div
                            key={item.public_id}
                            onClick={() =>
                              selectPostcode(item.description.split(",")[0])
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

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={!search}>
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
