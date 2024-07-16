"use client";
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
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormProvider } from "react-hook-form";

import { LoadingButton } from "@/components/ui/loading-button";
import { CATEGORY_TYPE } from "@/constant/constants";
import ImageUploader from "../_components/image-uploader";
import ParentCategory from "../_components/parent-category";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Category", href: "/admin/categories" },
  {
    label: "Create Category",
    href: "/admin/categories/new",
    isCurrentPage: true,
  },
];

export default function CreateCategoryPage() {
  return (
    <ContentLayout title="Create Category">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <FormProvider {...form}>
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
                  Add New Category
                </LoadingButton>
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
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CATEGORY_TYPE.map((category, index) => {
                                  return (
                                    <SelectItem key={index} value={category}>
                                      {category.charAt(0).toUpperCase() +
                                        category.slice(1).toLowerCase()}
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
                {form.watch("type") !== "PRIMARY" && (
                  <ParentCategory control={control} />
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
              <LoadingButton
                type="submit"
                disabled={isPending}
                size="sm"
                loading={isPending}
                className="text-xs font-semibold h-8"
              >
                Add New Category
              </LoadingButton>
              {/* <Button size="sm">Save Product</Button> */}
            </div>
          </form>
        </Form>
      </FormProvider>
    </ContentLayout>
  );
}
