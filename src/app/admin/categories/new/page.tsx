"use client";
import Link from "next/link";
import React, { useRef } from "react";
import { ChevronLeft, Upload } from "lucide-react";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { categorySchema } from "./schema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "../../_components/image-uploader";
import { z } from "zod";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Category", href: "/admin/categories" },
  {
    label: "Create Category",
    href: "/admin/categories/new",
    isCurrentPage: true,
  },
];

const defaultValues = {
  name: "",
  image: "",
  parentCategory: "",
};

type FormInputType = z.infer<typeof categorySchema>;

export default function CreateCategoryPage() {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });
  const { control, handleSubmit } = form;
  const onCreateCategorySubmit: SubmitHandler<FormInputType> = async (data) => {
    console.log(data);
    const { name, image, parentCategory } = data;
    const payload = {
      name,
      image,
      parentCategory,
    };
    console.log(`payload`, payload);
  };
  return (
    <ContentLayout title="Create Category">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Form {...form}>
        <form onSubmit={handleSubmit(onCreateCategorySubmit)}>
          <div className="flex items-center gap-4 mb-5 mt-7">
            <Link href="/admin/categories">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Create Category
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              Active
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm" type="submit">
                Save Category
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Category Details</CardTitle>
                  <CardDescription>
                    Please provide the category details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter category name"
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
                  <CardTitle>Parent Category</CardTitle>
                  <CardDescription>
                    Select the parent category if applicable.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="parentCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select parent category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="primary">Primary</SelectItem>
                              <SelectItem value="secondary">
                                Secondary
                              </SelectItem>
                              <SelectItem value="tertiary">Tertiary</SelectItem>
                              <SelectItem value="quaternary">
                                Quaternary
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
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
