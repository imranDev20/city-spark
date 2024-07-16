"use client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

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

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/loading-button";
import { CATEGORY_TYPE } from "@/constant/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { ContentLayout } from "@/app/admin/_components/content-layout";
import DynamicBreadcrumb from "@/app/admin/_components/dynamic-breadcrumb";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import CategoryImageUploader from "../../_components/category-image-uploader";
import { getCategoryById, updateCategoryById } from "../../actions";
import { CategoryFormInputType, categorySchema } from "../../schema";
import ParentCategory from "./parent-category";

export default function EditCategoryForm() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const [openComboBox, setOpenComboBox] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<CategoryFormInputType>({
    resolver: zodResolver(categorySchema),
  });
  const {
    data: categoryDetails,
    isPending: isCategoryDetailsPending,
    isError: isCategoryDetailsError,
    error: categoryDetailsError,
  } = useQuery({
    queryKey: ["category-details"],
    queryFn: async () => await getCategoryById(params.category_id as string),
  });
  console.log(`categoryDetails`, categoryDetails);
  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Category", href: "/admin/categories" },
    {
      label: `${categoryDetails?.name}`,
      isCurrentPage: true,
    },
  ];
  useEffect(() => {
    if (categoryDetails) {
      form.reset({
        name: categoryDetails?.name,
        type: categoryDetails?.type,
        parentCategory: categoryDetails?.parentCategory?.name,
      });
    }
  }, [categoryDetails, form]);

  const { control, handleSubmit } = form;
  const onEditCategorySubmit: SubmitHandler<CategoryFormInputType> = async (
    data
  ) => {
    startTransition(async () => {
      const result = await updateCategoryById(
        params.category_id as string,
        data
      );

      if (result.success) {
        // Handle successful deletion (e.g., show a success message, update UI)
        console.log(result.message);
        toast({
          title: "Category Updated",
          description: result.message,
          variant: "success",
        });

        router.push("/admin/categories");
      } else {
        toast({
          title: "Category Saved failed",
          description: result.message,
          variant: "destructive",
        });
        console.error(result.message);
      }
    });
  };

  if (isCategoryDetailsPending) {
    return (
      <div className="min-h-[100vh] flex justify-center items-center">
        <Spinner className="text-secondary" size="large" />
      </div>
    );
  }

  if (isCategoryDetailsError) {
    return (
      <ContentLayout title="Edit Product">
        {categoryDetailsError.message}
      </ContentLayout>
    );
  }
  return (
    <ContentLayout title="Edit Category">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={handleSubmit(onEditCategorySubmit)}>
            <div className="flex items-center gap-4 mb-5 mt-7">
              <Link href="/admin/categories">
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {`Edit ${categoryDetails?.name}`}
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
                  Update Category
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
                      name="image"
                      render={({ field }) => (
                        <FormItem className="mx-auto ">
                          <FormLabel>
                            <h2 className="text-xl font-semibold tracking-tight"></h2>
                          </FormLabel>
                          <FormControl>
                            <CategoryImageUploader {...field} />
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
                Update Category
              </LoadingButton>
            </div>
          </form>
        </Form>
      </FormProvider>
    </ContentLayout>
  );
}
