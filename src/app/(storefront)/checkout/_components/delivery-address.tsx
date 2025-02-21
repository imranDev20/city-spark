"use client";

import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { saveDeliveryAddress } from "../actions";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  address1: z.string().min(1, "Address line 1 is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  county: z.string().optional(),
  postcode: z.string().min(1, "Postcode is required"),
});

type FormValues = z.infer<typeof formSchema>;

type DeliveryAddressProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeliveryAddress({
  open,
  setOpen,
}: DeliveryAddressProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const {
    postcode,
    setPostcode,
    setDeliveryDescription,
    deliveryDescription,
    setAddressComponents,
  } = useDeliveryStore();
  const [search, setSearch] = useState(postcode || "");
  const [selectedDescription, setSelectedDescription] = useState(
    deliveryDescription || ""
  );

  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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

  useEffect(() => {
    if (open && postcode) {
      // Get address components from store
      const { addressComponents } = useDeliveryStore.getState();

      // Set postcode in search and form
      setSearch(postcode);
      form.setValue("postcode", postcode);

      // Set selected description if available
      if (deliveryDescription) {
        setSelectedDescription(deliveryDescription);
      }

      // Use stored address components to populate form
      if (addressComponents) {
        form.setValue("city", addressComponents.district);
        form.setValue("county", addressComponents.county);
      }
    }
  }, [open, postcode, deliveryDescription, form]);

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
      // Set the initial postcode from description
      const postcode = description.split(",")[0].trim();
      setSearch(postcode);
      setSelectedDescription(description);
      setShowSuggestions(false);

      // Fetch detailed address info
      const details = await fetchPostcodeDetails(publicId);
      const addressComponents = details.result.address_components;

      // Extract address components
      const district =
        addressComponents.find((comp) =>
          comp.types.includes("division_level_3")
        )?.long_name || "";

      const county =
        addressComponents.find((comp) =>
          comp.types.includes("administrative_area_level_1")
        )?.long_name || "";

      // Save address components to store
      setAddressComponents({
        district,
        county,
      });

      // Update form with the detailed address info
      form.setValue("postcode", postcode);
      form.setValue("city", district); // Barking and Dagenham
      form.setValue("county", county); // City of London
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  const handleClear = () => {
    setSearch("");
    setSelectedDescription("");
    form.setValue("postcode", "");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleSave = async () => {
    // First validate the form
    const values = form.getValues();
    const isValid = await form.trigger();

    if (!isValid) {
      return;
    }

    startTransition(async () => {
      try {
        // Update the delivery store (session) with postcode and description
        setPostcode(values.postcode);
        setDeliveryDescription(selectedDescription);

        // Save the complete address to database via server action
        const result = await saveDeliveryAddress({
          address1: values.address1,
          address2: values.address2,
          city: values.city, // Will be the district (e.g. "Barking and Dagenham")
          county: values.county, // Will be "City of London"
          postcode: values.postcode, // The selected postcode
        });

        if (result.success) {
          // Invalidate addresses cache to trigger refetch
          await queryClient.invalidateQueries({ queryKey: ["addresses"] });
          form.reset();

          toast({
            title: "Success",
            description: result.message,
            variant: "success",
          });
          setOpen(false);
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
          description: "Failed to save address",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
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
                      "flex h-12 items-center bg-muted rounded-sm", // Changed height and background
                      "border transition-all duration-200",
                      "hover:border-gray-300",
                      isFocused ? "border-gray-300" : "border-transparent"
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
                        "placeholder:normal-case placeholder:text-placeholder",
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

                    <div className="px-4 text-muted-foreground">
                      {isFetching ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : search ? (
                        <button
                          onClick={handleClear}
                          className="text-muted-foreground hover:text-foreground"
                          aria-label="Clear search"
                          type="button"
                        >
                          <X className="h-5 w-5" />
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
                        className="bg-muted rounded-sm border border-transparent hover:border-gray-300 focus-visible:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-placeholder"
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
                        className="bg-muted rounded-sm border border-transparent hover:border-gray-300 focus-visible:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-placeholder"
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
                        <Input
                          placeholder="City"
                          {...field}
                          className="bg-muted rounded-sm border border-transparent hover:border-gray-300 focus-visible:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-placeholder"
                        />
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
                        <Input
                          placeholder="County (optional)"
                          {...field}
                          className="bg-muted rounded-sm border border-transparent hover:border-gray-300 focus-visible:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-placeholder"
                        />
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
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  className="w-full sm:w-auto"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    "Save Address"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
