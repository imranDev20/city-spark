"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FaPen, FaTruck } from "react-icons/fa";
import { Loader2, Search, X } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  address1: z.string().min(1, "Address line 1 is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  county: z.string().optional(),
  postcode: z.string().min(1, "Postcode is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function DeliveryAddress() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { postcode, setPostcode, deliveryDescription, setDeliveryDescription } =
    useDeliveryStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address1: "",
      address2: "",
      city: "",
      county: "",
      postcode: "",
    },
  });

  const debouncedSearch = useDebounce(search, 300);

  const { data: postcodeResults, isFetching } = useQuery({
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
            suggestions[selectedIndex].description
          );
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  const handlePostcodeSelect = async (
    publicId: string,
    description: string
  ) => {
    try {
      const postcode = description.split(",")[0];
      setSearch(postcode);
      setPostcode(postcode);
      setDeliveryDescription(description);
      form.setValue("postcode", postcode);
      setShowSuggestions(false);

      const details = await fetchPostcodeDetails(publicId);
      const addressComponents = details.result.address_components;

      const cityOfLondon =
        addressComponents.find((comp) =>
          comp.types.includes("administrative_area_level_1")
        )?.long_name || "";

      const area =
        addressComponents.find((comp) =>
          comp.types.includes("division_level_3")
        )?.long_name || "";

      const county =
        addressComponents.find((comp) =>
          comp.types.includes("division_level_1")
        )?.long_name || "";

      form.setValue("address2", cityOfLondon);
      form.setValue("city", area || "");
      form.setValue("county", county);
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  const handleClear = () => {
    setSearch("");
    form.setValue("postcode", "");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleSave = () => {
    const values = form.getValues();
    console.log(values);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setIsDialogOpen(true)}
        className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg border hover:border-gray-400 p-4 w-full transition-all duration-200 group text-left cursor-pointer"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <FaTruck className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900 text-lg">
              Delivery Address
            </h3>
          </div>

          <p className="text-sm text-gray-600 pl-7">
            {deliveryDescription ? (
              <>{deliveryDescription}</>
            ) : (
              <>Please enter your delivery address</>
            )}
          </p>
        </div>
        <FaPen className="h-5 w-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Delivery Address</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <div className="mt-2 space-y-6">
              {/* Postcode Search */}
              <div className="space-y-2">
                <FormLabel>
                  Find Address
                  <span className="text-destructive ml-1">*</span>
                </FormLabel>

                <div className="relative">
                  <div
                    className={cn(
                      "flex h-10 items-center bg-background rounded-md",
                      "border border-input",
                      "transition-colors",
                      "hover:border-muted-foreground",
                      isFocused && "ring-2 ring-ring ring-offset-2"
                    )}
                  >
                    <div className="px-3 text-muted-foreground">
                      <Search className="h-4 w-4" />
                    </div>

                    <input
                      className="flex-1 h-full border-0 bg-transparent px-0 focus:outline-none focus:ring-0"
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

                    <div className="px-3 text-muted-foreground">
                      {isFetching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : search ? (
                        <button
                          onClick={handleClear}
                          className="text-muted-foreground hover:text-foreground"
                          aria-label="Clear search"
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                  {showSuggestions &&
                    search &&
                    (postcodeResults?.localities ?? []).length > 0 && (
                      <Card className="absolute w-full mt-1 shadow-lg overflow-hidden z-50">
                        <CardContent className="p-0 max-h-[300px] overflow-y-auto">
                          <div className="py-1" role="listbox">
                            {(postcodeResults?.localities ?? []).map(
                              (item, index) => (
                                <div
                                  key={item.public_id}
                                  onClick={() =>
                                    handlePostcodeSelect(
                                      item.public_id,
                                      item.description
                                    )
                                  }
                                  className={cn(
                                    "px-3 py-2 transition-colors cursor-pointer",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    index === selectedIndex &&
                                      "bg-accent text-accent-foreground"
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
              </div>

              <FormField
                control={form.control}
                name="address1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Building number and street"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apartment, suite, unit, etc. (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>County</FormLabel>
                      <FormControl>
                        <Input placeholder="County (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  className="w-full sm:w-auto"
                >
                  Save Address
                </Button>
              </DialogFooter>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
