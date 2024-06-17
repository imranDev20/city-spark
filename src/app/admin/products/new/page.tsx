"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, PlusCircle, Trash, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ContentLayout } from "../../_components/content-layout";
import { Form } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import TemplateSelect from "../_components/template-select";
import ManualsInstructionsUpload from "../_components/manuals-instructions-upload";

const breadcrumbItems = [
  { label: "Home", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Create Product", href: "/admin/products/new", isCurrentPage: true },
];

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),

  password: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
});

export default function Dashboard() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <ContentLayout title="Create Product">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DynamicBreadcrumb items={breadcrumbItems} />

          <div className="flex items-center gap-4 mb-5 mt-7">
            <Link href="/admin/products">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>

            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Pro Controller
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              In stock
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">Save Product</Button>
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
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        defaultValue="Gamer Gear Pro Controller"
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                        className="min-h-32"
                        placeholder="Enter product description"
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
                      <Label htmlFor="trade-price">Brand Name</Label>
                      <Input id="trade-price" placeholder="Enter brand name" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="contract-price">Model</Label>
                      <Input id="contract-price" placeholder="Enter model" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="promotional-price">Type</Label>
                      <Input id="promotional-price" placeholder="Enter type" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="promotional-price">Warranty</Label>
                      <Input id="promotional-price" placeholder="Enter type" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="promotional-price">
                        Years Guaranteed
                      </Label>
                      <Input
                        id="promotional-price"
                        placeholder="Enter years guaranteed"
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
                      <Label htmlFor="trade-price">Trade Price</Label>
                      <Input id="trade-price" placeholder="Enter trade price" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="contract-price">Contract Price</Label>
                      <Input
                        id="contract-price"
                        placeholder="Enter contract price"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="promotional-price">
                        Promotional Price
                      </Label>
                      <Input
                        id="promotional-price"
                        placeholder="Enter promotional price"
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
                      <Label htmlFor="unit">Unit of Measurement</Label>
                      <Input
                        id="unit"
                        placeholder="e.g. kg, lb, meter, piece"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="weight">Weight</Label>
                      <Input id="weight" placeholder="Enter weight" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="weight">Colour</Label>
                      <Input id="weight" placeholder="Enter colour" />
                    </div>
                    <div className="grid gap-3 col-span-2">
                      <Label htmlFor="dimensions">Dimensions (in meters)</Label>
                      <div className="grid gap-3 grid-cols-3">
                        <Input id="length" placeholder="Length" />
                        <Input id="width" placeholder="Width" />
                        <Input id="height" placeholder="Height" />
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="weight">Material</Label>
                      <Input id="weight" placeholder="Enter material" />
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
                    <div className="grid gap-3 sm:grid-cols-8">
                      <div className="grid gap-3 col-span-7">
                        <Input placeholder="Enter feature" />
                      </div>
                      <div className="grid gap-3 col-span-1">
                        <Button variant="ghost">
                          <Trash className="w-4 h-4 text-primary" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-8">
                      <div className="grid gap-3 col-span-7">
                        <Input placeholder="Enter feature" />
                      </div>
                      <div className="grid gap-3 col-span-1">
                        <Button variant="ghost">
                          <Trash className="w-4 h-4 text-primary" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Button>Add new</Button>
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
                          <SelectItem value="clothing">Clothing</SelectItem>
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
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger id="status" aria-label="Select status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
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
                  <div className="grid gap-2">
                    <Image
                      alt="Product image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="300"
                      src="/placeholder.svg"
                      width="300"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <button>
                        <Image
                          alt="Product image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="84"
                          src="/placeholder.svg"
                          width="84"
                        />
                      </button>
                      <button>
                        <Image
                          alt="Product image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="84"
                          src="/placeholder.svg"
                          width="84"
                        />
                      </button>
                      <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </div>
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
            <Button size="sm">Save Product</Button>
          </div>
        </form>
      </Form>
    </ContentLayout>
  );
}
