"use client";
import Link from "next/link";
import { ChevronLeft, Trash } from "lucide-react";
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
import { ContentLayout } from "../../_components/content-layout";
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
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import TemplateSelect from "../_components/template-select";
import ManualsInstructionsUpload from "../_components/manuals-instructions-upload";
import { productSchema } from "./schema";
import ProductImageUploader from "../_components/product-image-uploader";
import { createProduct } from "../actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  {
    label: "Add New Product",
    href: "/admin/products/new",
    isCurrentPage: true,
  },
];

export type ProductFormInputType = z.infer<typeof productSchema>;

export default function CreateProductPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormInputType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      features: [
        {
          feature: "",
        },
      ],
    },
  });

  const { control, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray<ProductFormInputType>({
    control,
    name: "features",
  });

  const onCreateProductSubmit: SubmitHandler<ProductFormInputType> = async (
    data
  ) => {
    startTransition(async () => {
      const result = await createProduct(data);

      if (result.success) {
        // Handle successful deletion (e.g., show a success message, update UI)
        console.log(result.message);

        router.push("/admin/products");
      } else {
        // Handle error (e.g., show an error message)
        console.error(result.message);
      }
    });
  };

  return (
    <ContentLayout title="Add New Product">
      <DynamicBreadcrumb items={breadcrumbItems} />
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
            {/* <Badge variant="outline" className="ml-auto sm:ml-0">
              In stock
            </Badge> */}
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
                Add New Product
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
                              <Input
                                placeholder="Enter brand name"
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
                    <div className="grid gap-3 col-span-3">
                      <Label htmlFor="dimensions">Dimensions (in meters)</Label>
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
                                <Input
                                  placeholder="Enter material"
                                  {...field}
                                />
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
                    <div className="grid gap-3 col-span-6">
                      <TemplateSelect />
                    </div>
                  </div>
                </CardContent>
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
                    {fields.map((field, index) => (
                      <div key={field.id} className="grid gap-3 sm:grid-cols-8">
                        <div className="grid gap-3 col-span-7">
                          <FormField
                            name={`features.${index}.feature`}
                            control={control}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Enter features and benefits"
                                    defaultValue={field.value || ""}
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
                            onClick={() => remove(index)} // Remove the feature at the specified index
                          >
                            <Trash className="w-4 h-4 text-primary" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div>
                      <Button
                        type="button"
                        onClick={() => append({ feature: "" })} // Append a new feature with empty string
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
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div className="grid gap-3">
                      <Label htmlFor="primary-category">Primary</Label>
                      <Select>
                        <SelectTrigger
                          id="primary-category"
                          aria-label="Select primary category"
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clothing" className="capitalize">
                            clothing
                          </SelectItem>
                          <SelectItem value="electronics">
                            Electronics
                          </SelectItem>
                          <SelectItem value="accessories">
                            Accessories
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                          <SelectItem value="sweatshirts">
                            Sweatshirts
                          </SelectItem>
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
                          <SelectItem value="sweatshirts">
                            Sweatshirts
                          </SelectItem>
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
                          <SelectItem value="sweatshirts">
                            Sweatshirts
                          </SelectItem>
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
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="archived">
                                  Archived
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
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
                    control={form.control}
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
              Add New Product
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ContentLayout>
  );
}
