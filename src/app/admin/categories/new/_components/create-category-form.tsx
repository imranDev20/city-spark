"use client";
import Link from "next/link";
import React, { useTransition } from "react";
import { ChevronLeft } from "lucide-react";
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
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { CATEGORY_TYPE } from "@/constant/constants";
import { LoadingButton } from "@/components/ui/loading-button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { CategoryFormInputType, categorySchema } from "../../schema";
import { createCategory } from "../../actions";
import ParentCategory from "../../_components/parent-category";
import ImageUploader from "../../_components/image-uploader";

export default function CreateCategoryForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoryFormInputType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      parentCategory: "",
      type: "PRIMARY",
    },
  });
  const { control, handleSubmit } = form;

  const onCreateCategorySubmit: SubmitHandler<CategoryFormInputType> = async (
    data
  ) => {
    startTransition(async () => {
      const result = await createCategory(data);

      if (result.success) {
        console.log(result.message);
        toast({
          title: "Category Saved",
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

  return (
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
              Save Category
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
                          <Input placeholder="Enter category name" {...field} />
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
            {form.watch("type") !== "PRIMARY" && <ParentCategory />}
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
            Save Category
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
