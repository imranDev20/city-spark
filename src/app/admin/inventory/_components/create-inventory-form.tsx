"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Prisma } from "@prisma/client";
import { LoadingButton } from "@/components/ui/loading-button";
import { inventorySchema } from "../schema";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";


// const defaultValues = {
//   name: "",
//   description: "",
//   features: [],
// };
export type RelationsWithProducts = Prisma.ProductGetPayload<{
  include: {
    images: true;
    category: true;
  };
}>;
export default function CreateInventoryForm({
  products,
}: {
  products: RelationsWithProducts[];
}) {
  const [isPending, startTransition] = useTransition();
  const [openParentComboBox, setOpenParentComboBox] = useState<boolean>(false);
  const form = useForm<z.infer<typeof inventorySchema>>({
    resolver: zodResolver(inventorySchema),
    // defaultValues,
    // mode: "all",
  });
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Form {...form}>
      <form>
        <div className="flex items-center gap-4 mb-5 mt-7">
          <Link href="/admin/inventories">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>

          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Add New Inventory
          </h1>

          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <LoadingButton
              type="submit"
              disabled={isPending}
              size="sm"
              loading={isPending}
              className="text-xs font-semibold h-8"
            >
              Add New Inventory
            </LoadingButton>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>
                  Please provide the product name and description.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="productId"
                      render={({ field }) => (
                        <FormItem className="w-full flex flex-col gap-1">
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Popover
                              open={openParentComboBox}
                              onOpenChange={setOpenParentComboBox}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="justify-between"
                                >
                                  {field.value ? (
                                    products.find(
                                      (product) => product.id === field.value
                                    )?.name
                                  ) : (
                                    <p className="text-muted-foreground">
                                      Select product
                                    </p>
                                  )}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0 popover-content-width-same-as-its-trigger">
                                <Command>
                                  <CommandInput placeholder="Search product..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No product found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {products.map((product) => (
                                        <CommandItem
                                          key={product.id}
                                          value={product.id}
                                          onSelect={() => {
                                            field.onChange(product.id);
                                            setOpenParentComboBox(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value === product.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {product.name}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Delivery Eligibility
                  <Switch />
                </CardTitle>
                <CardDescription>
                  Please provide the product name and description.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 grid-cols-3">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="deliveryMinimumCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Count</FormLabel>
                          <FormControl>
                            <Input placeholder="Minimum count" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="deliveryMaximumCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Count</FormLabel>
                          <FormControl>
                            <Input placeholder="Maximum count" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="estimatedDeliveryTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Delivery Time</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Estimated delivery time"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Card>
              <CardHeader>
                <CardTitle>Features & Benefits</CardTitle>
                <CardDescription>
                  Please list the features and benefits.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 space-y-1">
                  {featureFields.map((featureField, index) => (
                    <div
                      key={featureField.id}
                      className="grid gap-3 sm:grid-cols-8"
                    >
                      <div className="grid gap-3 col-span-7">
                        <FormField
                          name={`features.${index}.feature`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Enter features and benefits"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-3 col-span-1">
                        <Button
                          variant="ghost"
                          type="button"
                        //   onClick={() => removeFeature(index)} // Remove the feature at the specified index
                        >
                          <Trash className="w-4 h-4 text-primary" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div>
                    <Button
                      type="button"
                    //   onClick={() => appendFeature({ feature: "" })} // Append a new feature with empty string
                    >
                      Add new
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
              </CardContent>
            </Card>

            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Collection Eligibility
                  <Switch />
                </CardTitle>
                <CardDescription>
                  Please provide the product name and description.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 grid-cols-3">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="collectionMinimumCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Count</FormLabel>
                          <FormControl>
                            <Input placeholder="Minimum count" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="collectionMaximumCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Count</FormLabel>
                          <FormControl>
                            <Input placeholder="Select product" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="estimatedcollectionTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Collection Time</FormLabel>
                          <FormControl>
                            <Input placeholder="Select product" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>Stock Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Count</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter stock value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
