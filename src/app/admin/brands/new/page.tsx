"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { ChevronLeft, Trash, Upload } from "lucide-react";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import { createBrandAction } from "./actions";
import { useFormState } from "react-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import TemplateSelect from "../_components/template-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { brandSchema } from "./schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "../../_components/image-uploader";




const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Brands", href: "/admin/brands" },
  { label: "Create Brand", href: "/admin/brands/new", isCurrentPage: true },
];

const defaultValues = {
  name: "",
  description: "",
  brandName: "",
  website: "",
  email: "",
  phone: "",  
  productCategories: [],
  brandStory: "",
  ambassador: "",
  tagline: "",
};

export default function CreateBrandPage() {
  const [state, formAction] = useFormState(createBrandAction, {
    message: "",
  });
  const form = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues,
  });
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <ContentLayout title="Create Brands">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Form {...form}>
        <form
          ref={formRef}
          action={formAction}
          onSubmit={(e) => {
            e.preventDefault();
            return form.handleSubmit(() => {
              formAction(new FormData(formRef.current!));
            })(e);
          }}
        >
          <div className="flex items-center gap-4 mb-5 mt-7">
            <Link href="/admin/brands">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Pro Controller Brand
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              Active
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm" type="submit">
                Save Product
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Details</CardTitle>
                  <CardDescription>
                    Please provide the brand details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="brandName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter brand name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3 mt-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              id="description"
                              className="min-h-32"
                              placeholder="Enter brand description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Brand Links</CardTitle>
                  <CardDescription>
                    Please provide the brand links.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter website URL" {...field} />
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
              <Card x-chunk="dashboard-07-chunk-5">
                <CardHeader>
                  <CardTitle>Manuals & Instructions</CardTitle>
                  <CardDescription>
                    Archive this product if it&apos;s no longer available.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                <ImageUploader />
                </CardContent>
              </Card>                            
            </div>                                                             
          </div>
        </form>
      </Form>
    </ContentLayout>
  );
}
