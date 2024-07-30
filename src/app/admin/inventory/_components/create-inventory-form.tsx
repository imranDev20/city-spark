"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronsUpDown, Trash } from "lucide-react";
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
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Prisma, Product } from "@prisma/client";
import { LoadingButton } from "@/components/ui/loading-button";
import { InventoryFormInputType, inventorySchema } from "../schema";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { createInventory } from "../actions";
import { useRouter } from "next/navigation";

export default function CreateInventoryForm({
  products,
}: {
  products: Product[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const [openParentComboBox, setOpenParentComboBox] = useState<boolean>(false);
  const form = useForm<InventoryFormInputType>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      stock: "0",
      deliveryAreas: [
        {
          deliveryArea: "",
        },
      ],
      collectionPoints: [
        {
          collectionPoint: "",
        },
      ],
      collectionAvailabilityTime: "",
      collectionEligibility: false,
      deliveryEligibility: false,
      countAvailableForCollection: "",
      countAvailableForDelivery: "",
      maxCollectionCount: "",
      maxDeliveryCount: "",
      minCollectionCount: "",
      minDeliveryCount: "",
      maxDeliveryTime: "",
      productId: "",
    },
  });
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;
  console.log(errors);
  const {
    fields: areasFields,
    append: appendDeliveryAreas,
    remove: removeAreas,
  } = useFieldArray<InventoryFormInputType>({
    control,
    name: "deliveryAreas",
  });
  const {
    fields: collectionFields,
    append: appendCollection,
    remove: removeCollection,
  } = useFieldArray<InventoryFormInputType>({
    control,
    name: "collectionPoints",
  });

  const onCreateInventorySubmit: SubmitHandler<InventoryFormInputType> = async (
    data
  ) => {
    console.log(`data`, data);
    startTransition(async () => {
      const result = await createInventory(data);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          variant: "success",
        });
        router.push("/admin/inventory");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onCreateInventorySubmit)}>
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
                  <FormField
                    control={control}
                    name="deliveryEligibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid gap-6 grid-cols-3">
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="minDeliveryCount"
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
                      control={control}
                      name="maxDeliveryCount"
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
                      name="maxDeliveryTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Delivery Time</FormLabel>
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
                <div className="mt-5">
                  <h3 className="font-semibold mb-2">Delivery Areas</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {" "}
                    Post code for delivery area
                  </p>
                  <div className="grid gap-3 ">
                    {areasFields.map((areaField, index) => (
                      <div
                        key={areaField.id}
                        className="grid gap-3 sm:grid-cols-8"
                      >
                        <div className="grid gap-3 col-span-7">
                          <FormField
                            name={`deliveryAreas.${index}.deliveryArea`}
                            control={control}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Enter delivery post code"
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
                            onClick={() => removeAreas(index)} // Remove the feature at the specified index
                          >
                            <Trash className="w-4 h-4 text-primary" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div>
                      <Button
                        type="button"
                        onClick={() =>
                          appendDeliveryAreas({ deliveryArea: "" })
                        } // Append a new feature with empty string
                      >
                        Add new
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Collection Eligibility
                  <FormField
                    control={control}
                    name="collectionEligibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 grid-cols-3">
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="minCollectionCount"
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
                      control={control}
                      name="maxCollectionCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Count</FormLabel>
                          <FormControl>
                            <Input placeholder="Maximum Count" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="collectionAvailabilityTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Collection Availability Time</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Collection availability time"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <h3 className="font-semibold mb-3">
                    Collection Point / Branches
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {" "}
                    Post code for collection point / branches
                  </p>
                  <div className="grid gap-3">
                    {collectionFields.map((collectionField, index) => (
                      <div
                        key={collectionField.id}
                        className="grid gap-3 sm:grid-cols-8"
                      >
                        <div className="grid gap-3 col-span-7">
                          <FormField
                            name={`collectionPoints.${index}.collectionPoint`}
                            control={control}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Enter collection post code"
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
                            onClick={() => removeCollection(index)} // Remove the feature at the specified index
                          >
                            <Trash className="w-4 h-4 text-primary" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div>
                      <Button
                        type="button"
                        onClick={() =>
                          appendCollection({ collectionPoint: "" })
                        } // Append a new feature with empty string
                      >
                        Add new
                      </Button>
                    </div>
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
                      control={control}
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
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="countAvailableForDelivery"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available For Delivery</FormLabel>
                        <FormControl>
                          <Input
                            className={`${
                              watch("deliveryEligibility")
                                ? "opacity-100"
                                : "disabled opacity-50"
                            }`}
                            {...field}
                            placeholder="Count available for delivery"
                            disabled={!watch("deliveryEligibility")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="countAvailableForCollection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available For Collection</FormLabel>
                        <FormControl>
                          <Input
                            className={`${
                              watch("collectionEligibility")
                                ? "opacity-100"
                                : "disabled opacity-50"
                            }`}
                            placeholder="Count available for collection"
                            {...field}
                            disabled={!watch("collectionEligibility")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
