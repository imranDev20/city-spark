"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import ImageUploader from "../_components/image-uploader";
import { CATEGORY_TYPE } from "@/constant/constants";
import { LoadingButton } from "@/components/ui/loading-button";
import { useFormState, useFormStatus } from "react-dom";
import ParentCategory from "../_components/parent-category";
import { useRouter } from "next/navigation";
import { createCategory } from "./actions";
import { useToast } from "@/components/ui/use-toast";
function SubmitButton({ isValid }: { isValid: boolean }) {
  const { pending } = useFormStatus();

  return (
    <LoadingButton
      type="submit"
      // disabled={!isValid || pending}
      size="sm"
      loading={pending}
      className="text-xs font-semibold h-8"
    >
      Add New Category
    </LoadingButton>
  );
}
const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Category", href: "/admin/categories" },
  {
    label: "Create Category",
    href: "/admin/categories/new",
    isCurrentPage: true,
  },
];



export type CategoryFormInputType = z.infer<typeof categorySchema>;

export default function CreateCategoryPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(createCategory, {
    success: false,
    message: "",
  });
  const { toast } = useToast();
  const form = useForm<CategoryFormInputType>({
    resolver: zodResolver(categorySchema),
    defaultValues:{
      name: "",
      images: "",
      parentCategory: "",
      type: 'PRIMARY',    
    },
  });
  const { control } = form;
  useEffect(() => {
    if (state.success) {
      toast({
        title: "Category Saved",
        description: "The category has been successfully saved.",
        variant: "success",
      });
      router.push("/admin/categories");
    }
  }, [state, router, toast]);
  
  return (
    <ContentLayout title="Create Category">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <FormProvider {...form}>
      <Form {...form}>
        <form action={formAction}>
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

            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <SubmitButton isValid={form.formState.isValid} />
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
                  <div className="grid gap-3 grid-cols-2">
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
                    <FormField
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Type</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(value)
                            }
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue  placeholder="Select category type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CATEGORY_TYPE.map((category, index) => {
                                return (
                                  <SelectItem  key={index} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              {form.watch('type') !== 'PRIMARY' && (
                <ParentCategory  control={control} />
              )}
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-5">
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>Upload category images.</CardDescription>
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
                          <ImageUploader {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <SubmitButton isValid={form.formState.isValid} />
            {/* <Button size="sm">Save Product</Button> */}
          </div>
        </form>
      </Form>
      </FormProvider>
    </ContentLayout>
  );
}
