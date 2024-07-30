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
import { useToast } from "@/components/ui/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";
import { ProductFormInputType, productSchema } from "../../schema";
import { updateProduct } from "../../actions";
import { ContentLayout } from "@/app/admin/_components/content-layout";
import DynamicBreadcrumb from "@/app/admin/_components/dynamic-breadcrumb";

import {
  MultiImageDropzone,
  type FileState,
} from "../../_components/product-image-uploader";

import ManualsInstructionsUpload from "../../_components/manuals-instructions-upload";
import { Brand, Category, Prisma, Template } from "@prisma/client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import useQueryString from "@/hooks/use-query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore";
import { Badge } from "@/components/ui/badge";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: true;
    brand: true;
    features: true;
    template: true;
  };
}>;

export type TemplateWithRelations = Prisma.TemplateGetPayload<{
  include: {
    fields: true;
  };
}>;

export default function EditProductForm({
  productDetails,
  primaryCategories,
  secondaryCategories,
  tertiaryCategories,
  quaternaryCategories,
  templates,
  brands,
  templateDetails,
}: {
  productDetails: ProductWithRelations;
  brands: Brand[];
  primaryCategories: Category[];
  secondaryCategories: Category[];
  tertiaryCategories: Category[];
  quaternaryCategories: Category[];
  templates: Template[];
  templateDetails: TemplateWithRelations | null;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [openBrandComboBox, setOpenBrandComboBox] = useState<boolean>(false);

  const [openTemplateComboBox, setOpenTemplateComboBox] =
    useState<boolean>(false);

  const [openPrimaryCategoriesComboBox, setOpenPrimaryCategoriesComboBox] =
    useState<boolean>(false);

  const [openSecondaryCategoriesComboBox, setOpenSecondaryCategoriesComboBox] =
    useState<boolean>(false);

  const [openTertiaryCategoreisComboBox, setOpenTertiaryCategoriesComboBox] =
    useState<boolean>(false);

  const [
    openQuaternaryCategoriesComboBox,
    setOpenQuaternaryCategoriesComboBox,
  ] = useState<boolean>(false);

  const { createQueryString } = useQueryString();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedTemplate = searchParams.get("template_id") || null;

  const selectedPrimaryCategory = searchParams.get("primary_category_id") || "";
  const selectedSecondaryCategory =
    searchParams.get("secondary_category_id") || "";
  const selectedTertiaryCategory =
    searchParams.get("tertiary_category_id") || "";
  const selectedQuaternaryCategory =
    searchParams.get("quaternary_category_id") || "";

  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  const form = useForm<ProductFormInputType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      model: "",
      type: "",
      warranty: "",
      guarantee: "",
      tradePrice: 0,
      contractPrice: 0,
      promotionalPrice: 0,
      unit: "",
      weight: 0,
      color: "",
      length: 0,
      width: 0,
      height: 0,
      material: "",
      template: "",
      features: [{ feature: "" }],
      category: "",
      status: "DRAFT",
      images: [
        {
          image: "",
        },
      ],
      manuals: [],
    },
  });

  const {
    reset,
    control,
    formState: { isDirty },
    handleSubmit,
  } = form;

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: "features",
  });

  const { fields: templateFields } = useFieldArray({
    control,
    name: "templateFields",
  });

  const { append: appendImages } = useFieldArray({
    control,
    name: "images",
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Products", href: "/admin/products" },
    {
      label: `${productDetails?.name}`,
      isCurrentPage: true,
    },
  ];

  useEffect(() => {
    if (productDetails) {
      const {
        name,
        contractPrice,
        brandId,
        color,
        features,
        description,
        guarantee,
        height,
        length,
        model,
        material,
        status,
        promotionalPrice,
        unit,
        warranty,
        width,
        manuals,
        tradePrice,
        type,
        weight,
        categoryId,
        templateId,
        images,
        primaryCategoryId,
        secondaryCategoryId,
        tertiaryCategoryId,
        quaternaryCategoryId,
      } = productDetails;

      reset({
        name: name ?? "",
        contractPrice: contractPrice ?? 0,
        brand: brandId ?? "",
        color: color ?? "",
        features:
          features?.map((feature) => ({
            feature,
          })) ?? [],
        height: height ?? 0,
        description: description ?? "",
        length: length ?? 0,
        manuals: manuals ?? [],
        guarantee: guarantee ?? "",
        type: type ?? "",
        material: material ?? "",
        model: model ?? "",
        tradePrice: tradePrice ?? 0,
        unit: unit ?? "",
        promotionalPrice: promotionalPrice ?? 0,
        weight: weight ?? 0,
        width: width ?? 0,
        status: status ?? "DRAFT",
        warranty: warranty ?? "",
        category: categoryId ?? "",
        template: selectedTemplate || templateId || "",
        templateFields: templateDetails?.fields.map((item) => ({
          fieldName: item.fieldName,
          fieldType: item.fieldType,
          fieldOptions: item.fieldOptions || "",
          fieldValue: item.fieldValue || "",
        })),
        images: images.map((image) => ({
          image,
        })),

        primaryCategory: selectedPrimaryCategory || primaryCategoryId || "",

        secondaryCategory:
          selectedSecondaryCategory || secondaryCategoryId || "",

        tertiaryCategory: selectedTertiaryCategory || tertiaryCategoryId || "",

        quaternaryCategory:
          selectedQuaternaryCategory || quaternaryCategoryId || "",
      });
    }
  }, [
    productDetails,
    reset,
    selectedTemplate,
    templateDetails,
    selectedPrimaryCategory,
    selectedSecondaryCategory,
    selectedTertiaryCategory,
    selectedQuaternaryCategory,
  ]);

  useEffect(() => {
    if (productDetails) {
      setFileStates(
        productDetails.images.map((image) => ({
          file: image,
          key: Math.random().toString(36).slice(2),
          progress: "COMPLETE",
        }))
      );
    }
  }, [productDetails]);

  const onEditProductSubmit: SubmitHandler<ProductFormInputType> = async (
    data
  ) => {
    if (productDetails?.id) {
      startTransition(async () => {
        const result = await updateProduct(productDetails?.id, data);

        const images = form.watch("images");

        if (images) {
          await Promise.all(
            images.map(async ({ image }) => {
              try {
                const res = await edgestore.publicImages.confirmUpload({
                  url: image,
                });

                return { url: image, success: true, result: res };
              } catch (error) {
                console.error(`Failed to confirm upload for ${image}:`, error);
                return { url: image, success: false, error };
              }
            })
          );
        }
        if (result.success) {
          router.push(`/admin/products/${result.data?.id}`);

          toast({
            title: "Success",
            description: result.message,
            variant: "success",
          });
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <ContentLayout title="Edit Product">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Form {...form}>
        <form onSubmit={handleSubmit(onEditProductSubmit)}>
          <div className="flex items-center gap-4 mb-5 mt-7">
            <Link href="/admin/products">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>

            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {`Edit ${productDetails?.name}`}
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              {productDetails.status}
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm">
                Discard
              </Button>

              <LoadingButton
                type="submit"
                disabled={!isDirty || isPending}
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
                              <Input
                                placeholder="Enter trade price"
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

                    <div className="grid gap-3">
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
                    </div>

                    <div className="grid gap-3">
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
                    </div>

                    <div className="grid gap-3">
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
                    </div>

                    <div className="grid gap-3">
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

                    <div className="grid gap-3">
                      <FormField
                        control={control}
                        name="volume"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Volume</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter volume" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-3">
                      <FormField
                        control={control}
                        name="shape"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shape</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter shape" {...field} />
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
                                        (template) =>
                                          template.id === field.value
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
                                                `${pathname}?${createQueryString(
                                                  {
                                                    template_id: template.id,
                                                  }
                                                )}`,
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
                            name={`templateFields.${index}.fieldValue`}
                            render={({ field }) => (
                              <FormItem className="w-full flex flex-col gap-1">
                                <FormLabel>{templateField.fieldName}</FormLabel>

                                <FormControl>
                                  {templateField.fieldType === "TEXT" ? (
                                    <Input
                                      placeholder={`Enter ${templateField.fieldName}`}
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
                                      <SelectTrigger>
                                        <SelectValue
                                          placeholder={`Enter ${templateField.fieldName}`}
                                        />
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
                      name="primaryCategory"
                      render={({ field }) => (
                        <FormItem className="grid gap-1">
                          <FormLabel>Primary</FormLabel>
                          <FormControl>
                            <Popover
                              open={openPrimaryCategoriesComboBox}
                              onOpenChange={setOpenPrimaryCategoriesComboBox}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openBrandComboBox}
                                  className="justify-between"
                                >
                                  {field.value ? (
                                    primaryCategories?.find(
                                      (brand) => brand.id === field.value
                                    )?.name
                                  ) : (
                                    <p className="text-muted-foreground">
                                      Select a primary category
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
                                      {primaryCategories?.map(
                                        (primaryCategory) => (
                                          <CommandItem
                                            key={primaryCategory.id}
                                            value={primaryCategory.name}
                                            onSelect={() => {
                                              field.onChange(
                                                primaryCategory.id
                                              );

                                              router.push(
                                                `${pathname}?${createQueryString(
                                                  {
                                                    primary_category_id:
                                                      primaryCategory.id,

                                                    secondary_category_id: "",
                                                    tertiary_category_id: "",
                                                    quaternary_category_id: "",
                                                  }
                                                )}`,
                                                {
                                                  scroll: false,
                                                }
                                              );

                                              setOpenPrimaryCategoriesComboBox(
                                                false
                                              );
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                field.value ===
                                                  primaryCategory.id
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {primaryCategory.name}
                                          </CommandItem>
                                        )
                                      )}
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

                    <FormField
                      control={control}
                      name="secondaryCategory"
                      render={({ field }) => (
                        <FormItem className="grid gap-1">
                          <FormLabel>Secondary</FormLabel>
                          <FormControl>
                            <Popover
                              open={openSecondaryCategoriesComboBox}
                              onOpenChange={setOpenSecondaryCategoriesComboBox}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={
                                    openSecondaryCategoriesComboBox
                                  }
                                  className="justify-between"
                                >
                                  {field.value ? (
                                    secondaryCategories?.find(
                                      (brand) => brand.id === field.value
                                    )?.name
                                  ) : (
                                    <p className="text-muted-foreground">
                                      Select a secondary category
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
                                      {secondaryCategories?.map(
                                        (secondaryCategory) => (
                                          <CommandItem
                                            key={secondaryCategory.id}
                                            value={secondaryCategory.name}
                                            onSelect={() => {
                                              field.onChange(
                                                secondaryCategory.id
                                              );

                                              router.push(
                                                `${pathname}?${createQueryString(
                                                  {
                                                    primary_category_id:
                                                      selectedPrimaryCategory ||
                                                      "",
                                                    secondary_category_id:
                                                      secondaryCategory.id,

                                                    tertiary_category_id: "",
                                                    quaternary_category_id: "",
                                                  }
                                                )}`,
                                                {
                                                  scroll: false,
                                                }
                                              );
                                              setOpenSecondaryCategoriesComboBox(
                                                false
                                              );
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                field.value ===
                                                  secondaryCategory.id
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {secondaryCategory.name}
                                          </CommandItem>
                                        )
                                      )}
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

                    <FormField
                      control={control}
                      name="tertiaryCategory"
                      render={({ field }) => (
                        <FormItem className="grid gap-1">
                          <FormLabel>Tertiary</FormLabel>
                          <FormControl>
                            <Popover
                              open={openTertiaryCategoreisComboBox}
                              onOpenChange={setOpenTertiaryCategoriesComboBox}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={
                                    openSecondaryCategoriesComboBox
                                  }
                                  className="justify-between"
                                >
                                  {field.value ? (
                                    tertiaryCategories?.find(
                                      (tertCat) => tertCat.id === field.value
                                    )?.name
                                  ) : (
                                    <p className="text-muted-foreground">
                                      Select a tertiary category
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
                                      {tertiaryCategories?.map(
                                        (tertiaryCategory) => (
                                          <CommandItem
                                            key={tertiaryCategory.id}
                                            value={tertiaryCategory.name}
                                            onSelect={() => {
                                              field.onChange(
                                                tertiaryCategory.id
                                              );

                                              router.push(
                                                `${pathname}?${createQueryString(
                                                  {
                                                    primary_category_id:
                                                      selectedPrimaryCategory ||
                                                      "",

                                                    secondary_category_id:
                                                      selectedSecondaryCategory ||
                                                      "",

                                                    tertiary_category_id:
                                                      tertiaryCategory.id,

                                                    quaternary_category_id: "",
                                                  }
                                                )}`,
                                                {
                                                  scroll: false,
                                                }
                                              );

                                              setOpenTertiaryCategoriesComboBox(
                                                false
                                              );
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                field.value ===
                                                  tertiaryCategory.id
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {tertiaryCategory.name}
                                          </CommandItem>
                                        )
                                      )}
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

                    <FormField
                      control={control}
                      name="quaternaryCategory"
                      render={({ field }) => (
                        <FormItem className="grid gap-1">
                          <FormLabel>Quaternary</FormLabel>
                          <FormControl>
                            <Popover
                              open={openQuaternaryCategoriesComboBox}
                              onOpenChange={setOpenQuaternaryCategoriesComboBox}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="justify-between"
                                >
                                  {field.value ? (
                                    quaternaryCategories?.find(
                                      (quatCat) => quatCat.id === field.value
                                    )?.name
                                  ) : (
                                    <p className="text-muted-foreground">
                                      Select a quaternary category
                                    </p>
                                  )}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandInput placeholder="Search quaternary category..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No categories found
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {quaternaryCategories?.map(
                                        (quaternaryCategory) => (
                                          <CommandItem
                                            key={quaternaryCategory.id}
                                            value={quaternaryCategory.name}
                                            onSelect={() => {
                                              field.onChange(
                                                quaternaryCategory.id
                                              );

                                              router.push(
                                                `${pathname}?${createQueryString(
                                                  {
                                                    primary_category_id:
                                                      selectedPrimaryCategory ||
                                                      "",

                                                    secondary_category_id:
                                                      selectedSecondaryCategory ||
                                                      "",

                                                    tertiary_category_id:
                                                      selectedTertiaryCategory ||
                                                      "",

                                                    quaternary_category_id:
                                                      quaternaryCategory.id,
                                                  }
                                                )}`,
                                                {
                                                  scroll: false,
                                                }
                                              );
                                              setOpenQuaternaryCategoriesComboBox(
                                                false
                                              );
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                field.value ===
                                                  quaternaryCategory.id
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {quaternaryCategory.name}
                                          </CommandItem>
                                        )
                                      )}
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
                      <FormItem className="mx-auto">
                        <FormLabel>
                          <h2 className="text-xl font-semibold tracking-tight"></h2>
                        </FormLabel>
                        <FormControl>
                          <MultiImageDropzone
                            value={fileStates}
                            dropzoneOptions={{
                              maxFiles: 6,
                              maxSize: 1024 * 1024 * 1, // 1MB
                            }}
                            onChange={(files) => {
                              setFileStates(files);
                            }}
                            onFilesAdded={async (addedFiles) => {
                              const allFiles = [...fileStates, ...addedFiles];
                              setFileStates(allFiles);

                              await Promise.all(
                                addedFiles.map(async (addedFileState) => {
                                  if (!(addedFileState.file instanceof File)) {
                                    console.error(
                                      "Expected a File object, but received:",
                                      addedFileState.file
                                    );
                                    updateFileProgress(
                                      addedFileState.key,
                                      "ERROR"
                                    );
                                    return;
                                  }

                                  try {
                                    const res =
                                      await edgestore.publicImages.upload({
                                        file: addedFileState.file,
                                        options: {
                                          temporary: true,
                                        },
                                        input: { type: "product" },
                                        onProgressChange: async (progress) => {
                                          updateFileProgress(
                                            addedFileState.key,
                                            progress
                                          );
                                          if (progress === 100) {
                                            // wait 1 second to set it to complete
                                            // so that the user can see the progress bar at 100%
                                            await new Promise((resolve) =>
                                              setTimeout(resolve, 1000)
                                            );

                                            updateFileProgress(
                                              addedFileState.key,
                                              "COMPLETE"
                                            );
                                          }
                                        },
                                      });

                                    appendImages({
                                      image: res.url,
                                    });
                                  } catch (err) {
                                    updateFileProgress(
                                      addedFileState.key,
                                      "ERROR"
                                    );
                                  }
                                })
                              );
                            }}
                          />
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
              disabled={!isDirty || isPending}
              size="sm"
              loading={isPending}
              className="text-xs font-semibold h-8"
            >
              Save Product
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ContentLayout>
  );
}
