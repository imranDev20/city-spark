"use client";

import React, { useState } from "react";
import { FaTruck } from "react-icons/fa";
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
import { useToast } from "@/components/ui/use-toast";

interface WoosmapLocality {
  description: string;
  id: string;
  matched_substrings: { length: number; offset: number }[];
  postal_code: { main_text: string; secondary_text: string };
  types: string[];
}

async function fetchPostcodes(input: string) {
  if (!input) return { localities: [] };

  try {
    const { data } = await axios.get(
      `https://api.woosemap.com/localities/autocomplete`,
      {
        params: {
          input,
          components: "country:gb",
          no_deprecated_fields: true,
          key: "woos-86debf53-3ace-3484-927d-9434918c93a9",
        },
      }
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch postcodes"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

export default function DeliveryDialog() {
  const { postcode, setPostcode } = useDeliveryStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { toast } = useToast();

  const debouncedSearch = useDebounce(search, 300);

  const { data: postcodeResults, error } = useQuery({
    queryKey: ["postcodes", debouncedSearch],
    queryFn: () => fetchPostcodes(debouncedSearch),
    enabled: debouncedSearch.length > 2,
  });

  const handleApply = () => {
    setPostcode(search);
    setOpen(false);
  };

  const handleClear = () => {
    setSearch("");
    setShowSuggestions(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "flex flex-col items-center gap-1 px-3 py-2 text-white rounded-md transition-colors duration-200",
            "hover:bg-white/10",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          )}
        >
          <FaTruck className="h-8 w-8" />
          <span className="text-base font-semibold">Delivery</span>
          <span className="text-xs font-light -mt-1">
            {postcode || "Set Postcode"}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Set Delivery Postcode</DialogTitle>
          <DialogDescription>
            Enter your postcode to check delivery availability in your area.
          </DialogDescription>
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
                className="flex-1 h-full border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 w-full py-2 outline-none"
                placeholder="Enter your postcode..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setIsFocused(true)}
              />

              {search && (
                <button
                  onClick={handleClear}
                  className="px-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {showSuggestions &&
              search &&
              postcodeResults?.localities?.length > 0 && (
                <Card className="absolute z-20 w-full mt-1 shadow-lg overflow-hidden rounded-md">
                  <CardContent className="p-0 max-h-[300px] overflow-y-auto">
                    <div className="py-2">
                      {postcodeResults.localities.map(
                        (item: WoosmapLocality) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSearch(item.postal_code.main_text);
                              setShowSuggestions(false);
                            }}
                            className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {item.postal_code.main_text}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {item.postal_code.secondary_text}
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
