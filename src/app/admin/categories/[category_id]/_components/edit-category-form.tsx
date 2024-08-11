"use client";

import { ContentLayout } from "@/app/admin/_components/content-layout";
import DynamicBreadcrumb from "@/app/admin/_components/dynamic-breadcrumb";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Category } from "@prisma/client";
import React, { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CategoryFormInputType } from "../../schema";
import { updateCategory } from "../../actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import {
  FileState,
  SingleImageDropzone,
} from "../../new/_components/category-image-uploder";
import { useEdgeStore } from "@/lib/edgestore";
import { CATEGORY_TYPE } from "@/constant/constants";

const EditCategoryForm = ({
  parentCategories,
  categoryDetails,
}: {
  parentCategories: Category[] | null;
  categoryDetails: Category | null;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const [fileState, setFileState] = useState<FileState | null>(null);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileState((fileState) => {
      const newFileState = structuredClone(fileState);

      if (newFileState) {
        newFileState.progress = progress;
      }
      return newFileState;
    });
  }

  const form = useForm<CategoryFormInputType>({
    defaultValues: {
      name: "",
      parentCategory: "",
      type: "PRIMARY",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (categoryDetails) {
      reset({
        name: categoryDetails?.name ?? "",
        parentCategory: categoryDetails.parentId ?? "",
        type: categoryDetails.type ?? "PRIMARY",
      });
    }
  }, [categoryDetails, reset]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Categories", href: "/admin/categories" },
    {
      label: `${categoryDetails?.name}`,
      isCurrentPage: true,
    },
  ];

  const onEditCategorySubmit: SubmitHandler<CategoryFormInputType> = async (
    data
  ) => {
    console.log(data);

    if (categoryDetails?.id) {
      startTransition(async () => {
        const result = await updateCategory(categoryDetails?.id, data);

        if (result.success) {
          router.push(`/admin/categories/${result.data?.id}`);
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
    <ContentLayout title="Edit Category">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Form {...form}>
        <form onSubmit={handleSubmit(onEditCategorySubmit)}>
          <div className="flex items-center gap-4 mb-5 mt-7">
            <Link href="/admin/categories">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>

            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {`Edit ${categoryDetails?.name}`}
            </h1>

            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm" type="button">
                Discard
              </Button>

              <LoadingButton
                type="submit"
                disabled={!isDirty || isPending}
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
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Category Details</CardTitle>
                  <CardDescription>
                    Please provide the category name and description.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="grid gap-3">
                      <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
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

                    <div className="grid gap-3">
                      <FormField
                        control={control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
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
                                    placeholder={`Enter category type`}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {CATEGORY_TYPE.map((categoryType) => (
                                    <SelectItem
                                      value={categoryType}
                                      key={categoryType}
                                    >
                                      {categoryType}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-5">
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>
                    Upload your brand images here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="mx-auto">
                        <FormLabel>
                          <h2 className="text-xl font-semibold tracking-tight"></h2>
                        </FormLabel>

                        <FormControl>
                          <SingleImageDropzone
                            value={fileState}
                            dropzoneOptions={{
                              maxFiles: 1,
                              maxSize: 1024 * 1024 * 1, // 1MB
                            }}
                            onChange={(file) => {
                              setFileState(file);
                            }}
                            onFilesAdded={async (addedFile) => {
                              if (!(addedFile.file instanceof File)) {
                                console.error(
                                  "Expected a File object, but received:",
                                  addedFile.file
                                );
                                updateFileProgress(addedFile.key, "ERROR");
                                return;
                              }

                              setFileState(addedFile);

                              try {
                                const res = await edgestore.publicImages.upload(
                                  {
                                    file: addedFile.file,
                                    options: {
                                      temporary: true,
                                    },

                                    input: { type: "brand" },

                                    onProgressChange: async (progress) => {
                                      updateFileProgress(
                                        addedFile.key,
                                        progress
                                      );

                                      if (progress === 100) {
                                        // wait 1 second to set it to complete
                                        // so that the user can see the progress bar at 100%
                                        await new Promise((resolve) =>
                                          setTimeout(resolve, 1000)
                                        );

                                        updateFileProgress(
                                          addedFile.key,
                                          "COMPLETE"
                                        );
                                      }
                                    },
                                  }
                                );

                                field.onChange(res.url);
                              } catch (err) {
                                updateFileProgress(addedFile.key, "ERROR");
                              }
                            }}
                          />
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
              disabled={!isDirty || isPending}
              size="sm"
              loading={isPending}
              className="text-xs font-semibold h-8"
            >
              Save Category
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ContentLayout>
  );
};

export default EditCategoryForm;
