"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormInputType, createProductSchema } from "../schema";
import {
  Check,
  ChevronLeft,
  ChevronsUpDown,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Prisma } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { FileState, MultiImageDropzone } from "./product-image-uploader";
import { useEdgeStore } from "@/lib/edgestore";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "../actions";
import { useToast } from "@/components/ui/use-toast";
import {
  fetchBrands,
  fetchCategories,
  fetchTemplateDetails,
  fetchTemplates,
} from "@/lib/api-client";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: true;
    brand: true;
    features: true;
    productTemplate: {
      include: {
        fields: {
          include: {
            templateField: true;
          };
        };
      };
    };
  };
}>;

export default function ProductForm({
  productDetails,
}: {
  productDetails?: ProductWithRelations | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();
  const [primaryCategoryId, setPrimaryCategoryId] = useState<string>();
  const [secondaryCategoryId, setSecondaryCategoryId] = useState<string>();
  const [tertiaryCategoryId, setTertiaryCategoryId] = useState<string>();

  const [openPrimary, setOpenPrimary] = useState(false);
  const [openSecondary, setOpenSecondary] = useState(false);
  const [openTertiary, setOpenTertiary] = useState(false);
  const [openQuaternary, setOpenQuaternary] = useState(false);
  const [openTemplates, setOpenTemplates] = useState(false);
  const [openBrands, setOpenBrands] = useState(false);
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { data: brands, isPending: isBrandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: () => fetchBrands(),
  });

  const { data: templates, isPending: isTemplatesPending } = useQuery({
    queryKey: ["templates"],
    queryFn: () => fetchTemplates(),
  });

  const { data: primaryCategories, isPending: isPrimaryPending } = useQuery({
    queryKey: ["categories", "PRIMARY"],
    queryFn: () => fetchCategories("PRIMARY"),
  });

  const { data: secondaryCategories, isPending: isSecondaryPending } = useQuery(
    {
      queryKey: ["categories", "SECONDARY", primaryCategoryId],
      queryFn: () => fetchCategories("SECONDARY", primaryCategoryId),
      enabled: !!primaryCategoryId,
    }
  );

  const { data: tertiaryCategories, isPending: isTertiaryPending } = useQuery({
    queryKey: ["categories", "TERTIARY", secondaryCategoryId],
    queryFn: () => fetchCategories("TERTIARY", secondaryCategoryId),
    enabled: !!secondaryCategoryId,
  });

  const { data: quaternaryCategories, isPending: isQuaternaryPending } =
    useQuery({
      queryKey: ["categories", "QUATERNARY", tertiaryCategoryId],
      queryFn: () => fetchCategories("QUATERNARY", tertiaryCategoryId),
      enabled: !!tertiaryCategoryId,
    });

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

  const productSchema = createProductSchema(
    primaryCategories,
    secondaryCategories,
    tertiaryCategories,
    quaternaryCategories
  );

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
      model: "",
      brand: "",
      images: [],
      shape: "",
      volume: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      material: "",
      color: "",
      templateId: "",
      contractPrice: "",
      tradePrice: "",
      guarantee: "",
      warranty: "",
      promotionalPrice: "",
      type: "",
      unit: "",
      productTemplateId: "",
      primaryCategoryId: "",
      secondaryCategoryId: "",
      tertiaryCategoryId: "",
      quaternaryCategoryId: "",
    },
  });

  const {
    handleSubmit,
    formState: { isDirty },
    control,
    watch,
    reset,
    getValues,
    setValue,
  } = form;

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: "features",
  });

  const { fields: templateFields, remove } = useFieldArray({
    control,
    name: "productTemplateFields",
  });

  const { append: appendImages } = useFieldArray({
    control,
    name: "images",
  });

  const templateId = watch("templateId");
  const { data: templateDetails, isLoading: isTemplateDetailsLoading } =
    useQuery({
      queryKey: ["templateDetails", templateId],
      queryFn: () => fetchTemplateDetails(templateId),
      enabled: !!templateId,
    });

  useEffect(() => {
    if (productDetails) {
      reset({
        name: productDetails.name,
        description: productDetails.description || "",
        brand: productDetails.brandId || "",
        model: productDetails.model || "",
        type: productDetails.type || "",
        warranty: productDetails.warranty || "",
        guarantee: productDetails.guarantee || "",
        tradePrice: productDetails.tradePrice?.toString() || "",
        contractPrice: productDetails.contractPrice?.toString() || "",
        promotionalPrice: productDetails.promotionalPrice?.toString() || "",
        unit: productDetails.unit || "",
        weight: productDetails.weight?.toString() || "",
        color: productDetails.color || "",
        length: productDetails.length?.toString() || "",
        width: productDetails.width?.toString() || "",
        height: productDetails.height?.toString() || "",
        material: productDetails.material || "",
        templateId: productDetails.productTemplate?.templateId || "",
        productTemplateId: productDetails.productTemplateId || "",
        features: productDetails.features.map((item) => ({ feature: item })),
        images: productDetails.images.map((item) => ({ image: item })),
        primaryCategoryId: productDetails.primaryCategoryId || "",
        secondaryCategoryId: productDetails.secondaryCategoryId || "",
        tertiaryCategoryId: productDetails.tertiaryCategoryId || "",
        quaternaryCategoryId: productDetails.quaternaryCategoryId || "",
        status: productDetails.status || "DRAFT",
        shape: productDetails.shape || "",
        volume: productDetails.volume?.toString() || "",
        manuals: [],
      });

      setPrimaryCategoryId(productDetails.primaryCategoryId || "");
      setSecondaryCategoryId(productDetails.secondaryCategoryId || "");
      setTertiaryCategoryId(productDetails.tertiaryCategoryId || "");
    }
  }, [productDetails, reset]);

  useEffect(() => {
    if (templateDetails) {
      if (
        productDetails &&
        productDetails.productTemplate?.templateId === templateId
      ) {
        reset({
          ...getValues(),
          productTemplateFields: productDetails.productTemplate?.fields.map(
            (field) => ({
              id: field.id,
              fieldId: field.templateFieldId,
              fieldName: field.templateField.fieldName,
              fieldOptions: field.templateField.fieldOptions ?? "",
              fieldType: field.templateField.fieldType ?? "TEXT",
              fieldValue: field.fieldValue ?? "",
            })
          ),
        });
      } else {
        reset({
          ...getValues(),
          productTemplateFields: templateDetails.fields.map((field, index) => ({
            id: field.id,
            fieldId: field.id,
            fieldName: field.fieldName,
            fieldOptions: field.fieldOptions ?? "",
            fieldType: field.fieldType,
          })),
        });
      }
    }
  }, [reset, getValues, templateDetails, productDetails, templateId]);

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
  }, [productDetails, templateDetails]);

  const onSubmit = async (data: ProductFormInputType) => {
    startTransition(async () => {
      try {
        let result;
        if (productDetails) {
          // Update existing product
          result = await updateProduct(productDetails.id, data);
        } else {
          // Create new product
          result = await createProduct(data);
        }

        if (result.success) {
          await queryClient.invalidateQueries({ queryKey: ["products"] });

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
      } catch (error) {
        console.error("Error submitting product:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 mb-5 mt-7">
          <Link href="/admin/products">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="flex-1 text-xl font-semibold tracking-tight">
            {productDetails ? `Edit ${productDetails.name}` : "Add New Product"}
          </h1>
          {productDetails && (
            <Badge variant="outline" className="ml-auto">
              {productDetails.status}
            </Badge>
          )}
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Link href="/admin/products">
              <Button type="button" variant="outline" className="h-9">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <LoadingButton
              type="submit"
              className="h-9"
              disabled={!isDirty || isPending}
              loading={isPending}
            >
              {!isPending && <Check className="mr-2 h-4 w-4" />}
              {productDetails ? "Update Product" : "Save Product"}
            </LoadingButton>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
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
                              open={openBrands}
                              onOpenChange={setOpenBrands}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  disabled={isBrandsLoading}
                                  aria-expanded={openBrands}
                                  className="w-full justify-between"
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
                                            setOpenBrands(false);
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
                <CardTitle className="">Features & Benefits</CardTitle>
                <CardDescription>
                  List the key features and benefits of your product or service.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <div className="space-y-4">
                    {featureFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center space-x-2"
                      >
                        <FormField
                          name={`features.${index}.feature`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="flex-grow">
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={`Feature ${index + 1}`}
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Separator className="my-4" />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendFeature({ feature: "" })}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add New Feature
                    </Button>
                  </div>
                </Form>
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
                      name="templateId"
                      render={({ field }) => (
                        <FormItem className="w-full flex flex-col gap-1">
                          <FormLabel>Templates</FormLabel>
                          <FormControl>
                            <Popover
                              open={openTemplates}
                              onOpenChange={setOpenTemplates}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="justify-between"
                                  disabled={isTemplatesPending}
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
                                            setOpenTemplates(false);
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
                    ? "Please provide the physical specifications."
                    : "No related field found"}
                </CardDescription>
              </CardHeader>

              {isTemplateDetailsLoading && (
                <CardContent>
                  <Spinner />
                </CardContent>
              )}

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
                          name={`productTemplateFields.${index}.fieldValue`}
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
                                      if (currentValue) {
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
                                            value={option.trim()}
                                            key={option}
                                          >
                                            {option.trim()}
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
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="primaryCategoryId"
                    render={({ field }) => (
                      <FormItem className="grid gap-1">
                        <FormLabel>Primary</FormLabel>
                        <FormControl>
                          <Popover
                            open={openPrimary}
                            onOpenChange={setOpenPrimary}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                disabled={isPrimaryPending}
                                aria-expanded={openPrimary}
                                className="justify-between"
                              >
                                {field.value ? (
                                  primaryCategories?.find(
                                    (category) => category.id === field.value
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
                                <CommandInput placeholder="Search primary categories..." />
                                <CommandList>
                                  <CommandEmpty>
                                    No primary category found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {primaryCategories?.map(
                                      (primaryCategory) => (
                                        <CommandItem
                                          key={primaryCategory.id}
                                          value={primaryCategory.name}
                                          onSelect={() => {
                                            field.onChange(primaryCategory.id);
                                            setValue("secondaryCategoryId", "");
                                            setValue("tertiaryCategoryId", "");
                                            setValue(
                                              "quaternaryCategoryId",
                                              ""
                                            );
                                            setOpenPrimary(false);
                                            setPrimaryCategoryId(
                                              primaryCategory.id
                                            );

                                            setSecondaryCategoryId(undefined);
                                            setTertiaryCategoryId(undefined);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value === primaryCategory.id
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
                    name="secondaryCategoryId"
                    render={({ field }) => (
                      <FormItem className="grid gap-1">
                        <FormLabel>Secondary</FormLabel>
                        <FormControl>
                          <Popover
                            open={openSecondary}
                            onOpenChange={setOpenSecondary}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openSecondary}
                                className="justify-between"
                                disabled={
                                  !primaryCategoryId || isSecondaryPending
                                }
                              >
                                {field.value ? (
                                  secondaryCategories?.find(
                                    (category) => category.id === field.value
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
                                <CommandInput placeholder="Search secondary categories..." />
                                <CommandList>
                                  <CommandEmpty>
                                    No secondary category found.
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
                                            setValue("tertiaryCategoryId", "");
                                            setValue(
                                              "quaternaryCategoryId",
                                              ""
                                            );
                                            setOpenSecondary(false);
                                            setSecondaryCategoryId(
                                              secondaryCategory.id
                                            );
                                            setTertiaryCategoryId(undefined);
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
                    name="tertiaryCategoryId"
                    render={({ field }) => (
                      <FormItem className="grid gap-1">
                        <FormLabel>Tertiary</FormLabel>
                        <FormControl>
                          <Popover
                            open={openTertiary}
                            onOpenChange={setOpenTertiary}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openTertiary}
                                className="justify-between"
                                disabled={
                                  !secondaryCategoryId || isTertiaryPending
                                }
                              >
                                {field.value ? (
                                  tertiaryCategories?.find(
                                    (category) => category.id === field.value
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
                                <CommandInput placeholder="Search tertiary categories..." />
                                <CommandList>
                                  <CommandEmpty>
                                    No tertiary category found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {tertiaryCategories?.map(
                                      (tertiaryCategory) => (
                                        <CommandItem
                                          key={tertiaryCategory.id}
                                          value={tertiaryCategory.name}
                                          onSelect={() => {
                                            field.onChange(tertiaryCategory.id);

                                            setValue(
                                              "quaternaryCategoryId",
                                              ""
                                            );

                                            setOpenTertiary(false);
                                            setTertiaryCategoryId(
                                              tertiaryCategory.id
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
                    name="quaternaryCategoryId"
                    render={({ field }) => (
                      <FormItem className="grid gap-1">
                        <FormLabel>Quaternary</FormLabel>
                        <FormControl>
                          <Popover
                            open={openQuaternary}
                            onOpenChange={setOpenQuaternary}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openQuaternary}
                                className="justify-between"
                                disabled={
                                  !tertiaryCategoryId || isQuaternaryPending
                                }
                              >
                                {field.value ? (
                                  quaternaryCategories?.find(
                                    (category) => category.id === field.value
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
                                <CommandInput placeholder="Search quaternary categories..." />
                                <CommandList>
                                  <CommandEmpty>
                                    No quaternary category found.
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
                                            setOpenQuaternary(false);
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
              <CardContent></CardContent>
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

        {/* Form fields will go here */}

        <div className="mt-8 flex justify-end md:hidden">
          <Button type="button" variant="outline" className="mr-4">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            disabled={!isDirty || isPending}
            loading={isPending}
          >
            {!isPending && <Check className="mr-2 h-4 w-4" />}
            {productDetails ? "Update Product" : "Save Product"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
