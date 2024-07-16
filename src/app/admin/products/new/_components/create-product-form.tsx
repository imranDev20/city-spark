"use client";
import Link from "next/link";
import { Check, ChevronLeft, ChevronsUpDown, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { productSchema } from "../../schema";
import { createProduct } from "../../actions";
import ProductImageUploader from "../../_components/product-image-uploader";
import { Brand, Category, Template } from "@prisma/client";
import { TemplateWithRelations } from "../../[product_id]/_components/edit-product-form";
import ManualsInstructionsUpload from "../../_components/manuals-instructions-upload";
import useQueryString from "@/hooks/use-query-string";

export type ProductFormInputType = z.infer<typeof productSchema>;

export default function CreateProductForm({
  categories,
  templates,
  brands,
  templateDetails,
}: {
  brands: Brand[];
  categories: Category[];
  templates: Template[];
  templateDetails: TemplateWithRelations | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [openBrandComboBox, setOpenBrandComboBox] = useState<boolean>(false);
  const [openTemplateComboBox, setOpenTemplateComboBox] =
    useState<boolean>(false);
  const [openCategoriesComboBox, setOpenCategoriesComboBox] =
    useState<boolean>(false);
  const { createQueryString } = useQueryString();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTemplate = searchParams.get("template_id") || null;

  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormInputType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      status: "DRAFT",
      description: "",
      features: [
        {
          feature: "",
        },
      ],

      category: "",
    },
  });

  const { control, handleSubmit } = form;
  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray<ProductFormInputType>({
    control,
    name: "features",
  });

  const { fields: templateFields } = useFieldArray({
    control,
    name: "templateFields",
  });

  useEffect(() => {
    if (templateDetails) {
      form.reset({
        ...form.getValues(),
        template: selectedTemplate || "",
        templateFields: templateDetails?.fields.map((item) => ({
          fieldName: item.fieldName,
          fieldType: item.fieldType,
          fieldOptions: item.fieldOptions || "",
          fieldValues: item.fieldValues || "",
        })),
      });
    }
  }, [form, templateDetails, selectedTemplate]);

  const onCreateProductSubmit: SubmitHandler<ProductFormInputType> = async (
    data
  ) => {
    startTransition(async () => {
      const result = await createProduct(data);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          variant: "success",
        });
        router.push("/admin/products");
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
      <form onSubmit={handleSubmit(onCreateProductSubmit)}>
        <div className="flex items-center gap-4 mb-5 mt-7">
          <Link href="/admin/products">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>

          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Add New Product
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
              Save Product
            </LoadingButton>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Please provide the product name and description.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter product name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              id="description"
                              className="min-h-32"
                              placeholder="Enter product description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Brand Specifications</CardTitle>
                <CardDescription>
                  Please provide the brand specifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand Name</FormLabel>
                          <FormControl>
                            <Popover
                              open={openBrandComboBox}
                              onOpenChange={setOpenBrandComboBox}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openBrandComboBox}
                                  className="w-[200px] justify-between"
                                >
                                  {field.value ? (
                                    brands?.find(
                                      (brand) => brand.id === field.value
                                    )?.name
                                  ) : (
                                    <p className="text-muted-foreground">
                                      Select a brand
                                    </p>
                                  )}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0">
                                <Command>
                                  <CommandInput placeholder="Search brands..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No framework found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {brands?.map((brand) => (
                                        <CommandItem
                                          key={brand.id}
                                          value={brand.name}
                                          onSelect={() => {
                                            field.onChange(brand.id);
                                            setOpenBrandComboBox(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value === brand.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {brand.name}
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
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter model" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter type" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="warranty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warranty</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter warranty in months"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="guarantee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guarantee</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter guarantee in months"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Price</CardTitle>
                <CardDescription>
                  Please provide the pricing details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="tradePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trade Price</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter trade price" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="contractPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contract Price</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter contract price"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="promotionalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Promotional Price</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter promotional price"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Physical Specifications</CardTitle>
                <CardDescription>
                  Please provide the physical specifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit of Measurement</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. kg, lb, meter, piece"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter weight" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter color" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3 col-span-3">
                    <div className="grid gap-3 grid-cols-4">
                      <FormField
                        control={control}
                        name="length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Length</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter length" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="width"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Width</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter width" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter height" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="material"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Material</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter material" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Templates</CardTitle>
                <CardDescription>
                  Please provide the physical specifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-6">
                  <div className="col-span-4 grid gap-3">
                    <FormField
                      control={control}
                      name="template"
                      render={({ field }) => (
                        <FormItem className="w-full flex flex-col gap-1">
                          <FormLabel>Templates</FormLabel>
                          <FormControl>
                            <Popover
                              open={openTemplateComboBox}
                              onOpenChange={setOpenTemplateComboBox}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="justify-between"
                                >
                                  {field.value ? (
                                    templates?.find(
                                      (template) => template.id === field.value
                                    )?.name
                                  ) : (
                                    <p className="text-muted-foreground">
                                      Select a template
                                    </p>
                                  )}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
                                <Command>
                                  <CommandInput placeholder="Search templates..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No framework found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {templates?.map((template) => (
                                        <CommandItem
                                          key={template.id}
                                          value={template.name}
                                          onSelect={() => {
                                            field.onChange(template.id);
                                            setOpenTemplateComboBox(false);

                                            router.push(
                                              `${pathname}?${createQueryString({
                                                template_id: template.id,
                                              })}`,
                                              {
                                                scroll: false,
                                              }
                                            );
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value === template.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {template.name}
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

              <CardHeader>
                <CardTitle>Template Fields</CardTitle>
                <CardDescription>
                  {templateFields && templateFields.length > 0
                    ? " Please provide the physical specifications."
                    : "No related field found"}
                </CardDescription>
              </CardHeader>

              {templateFields && templateFields.length > 0 && (
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-9">
                    {templateFields.map((templateField, index) => (
                      <div
                        className="col-span-3 grid gap-3"
                        key={templateField.id}
                      >
                        <FormField
                          control={control}
                          name={`templateFields.${index}.fieldValues`}
                          render={({ field }) => (
                            <FormItem className="w-full flex flex-col gap-1">
                              <FormLabel>{templateField.fieldName}</FormLabel>

                              <FormControl>
                                {templateField.fieldType === "TEXT" ? (
                                  <Input
                                    placeholder="Enter features and benefits"
                                    {...field}
                                  />
                                ) : (
                                  <Select
                                    onValueChange={(currentValue) => {
                                      if (currentValue !== "") {
                                        field.onChange(currentValue);
                                      }
                                    }}
                                    value={field.value}
                                  >
                                    <SelectTrigger
                                      id="secondary-category"
                                      aria-label="Select secondary category"
                                    >
                                      <SelectValue placeholder="Select subcategory" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {templateField.fieldOptions
                                        ?.split(",")
                                        .map((option) => (
                                          <SelectItem
                                            value={option}
                                            key={option}
                                          >
                                            {option}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

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
                          control={control}
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
                          onClick={() => removeFeature(index)} // Remove the feature at the specified index
                        >
                          <Trash className="w-4 h-4 text-primary" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div>
                    <Button
                      type="button"
                      onClick={() => appendFeature({ feature: "" })} // Append a new feature with empty string
                    >
                      Add new
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card x-chunk="dashboard-07-chunk-2">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="grid gap-1">
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Popover
                            open={openCategoriesComboBox}
                            onOpenChange={setOpenCategoriesComboBox}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openBrandComboBox}
                                className="justify-between"
                              >
                                {field.value ? (
                                  categories?.find(
                                    (brand) => brand.id === field.value
                                  )?.name
                                ) : (
                                  <p className="text-muted-foreground">
                                    Select a category
                                  </p>
                                )}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput placeholder="Search brands..." />
                                <CommandList>
                                  <CommandEmpty>
                                    No framework found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {categories?.map((category) => (
                                      <CommandItem
                                        key={category.id}
                                        value={category.name}
                                        onSelect={() => {
                                          field.onChange(category.id);
                                          setOpenCategoriesComboBox(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === category.id
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {category.name}
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

                  <div className="grid gap-3">
                    <Label htmlFor="secondary-category">
                      Secondary (optional)
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="secondary-category"
                        aria-label="Select secondary category"
                      >
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="t-shirts">T-Shirts</SelectItem>
                        <SelectItem value="hoodies">Hoodies</SelectItem>
                        <SelectItem value="sweatshirts">Sweatshirts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="tertiary-category">
                      Tertiary (optional)
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="tertiary-category"
                        aria-label="Select tertiary category"
                      >
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="t-shirts">T-Shirts</SelectItem>
                        <SelectItem value="hoodies">Hoodies</SelectItem>
                        <SelectItem value="sweatshirts">Sweatshirts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="quaternary-category">
                      Quaternary (optional)
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="quaternary-category"
                        aria-label="Select quaternary category"
                      >
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="t-shirts">T-Shirts</SelectItem>
                        <SelectItem value="hoodies">Hoodies</SelectItem>
                        <SelectItem value="sweatshirts">Sweatshirts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="status"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={(currentValue) => {
                                if (currentValue !== "") {
                                  field.onChange(currentValue);
                                }
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="ARCHIVED">
                                  Archived
                                </SelectItem>
                                <SelectItem value="DISCONTINUED">
                                  Discondinued
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Upload product images here.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="mx-auto ">
                      <FormLabel>
                        <h2 className="text-xl font-semibold tracking-tight"></h2>
                      </FormLabel>
                      <FormControl>
                        <ProductImageUploader {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card x-chunk="dashboard-07-chunk-5">
              <CardHeader>
                <CardTitle>Manuals & Instructions</CardTitle>
                <CardDescription>
                  Archive this product if it&apos;s no longer available.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ManualsInstructionsUpload />
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-5">
              <CardHeader>
                <CardTitle>Archive Product</CardTitle>
                <CardDescription>
                  Archive this product if it&apos;s no longer available.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button size="sm" variant="secondary">
                  Archive Product
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden">
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
            Save Product
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
