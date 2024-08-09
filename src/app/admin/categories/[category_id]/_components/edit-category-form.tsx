"use client";

import Link from "next/link";
import React, { useEffect, useState, useTransition } from "react";
import { Check, ChevronLeft, ChevronsUpDown } from "lucide-react";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { CategoryFormInputType, categorySchema } from "../../schema";
import { updateCategory } from "../../actions";

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
import { cn } from "@/lib/utils";
import { Category, CategoryType } from "@prisma/client";
import useQueryString from "@/hooks/use-query-string";
import { ContentLayout } from "@/app/admin/_components/content-layout";
import DynamicBreadcrumb from "@/app/admin/_components/dynamic-breadcrumb";
import {
  FileState,
  SingleImageDropzone,
} from "../../new/_components/category-image-uploder";
import { useEdgeStore } from "@/lib/edgestore";

export default function EditCategoryForm({
  categoryDetails,
  parentCategories,
}: {
  parentCategories: Category[] | null;
  categoryDetails: Category | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [openParentComboBox, setOpenParentComboBox] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { createQueryString } = useQueryString();

  const selectedCategoryType = searchParams.get(
    "category_type"
  ) as CategoryType | null;
  const parentCategoryId = searchParams.get("parent_category_id") || null;

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Category", href: "/admin/categories" },
    {
      label: categoryDetails?.name || "",
      href: "/admin/categories/new",
      isCurrentPage: true,
    },
  ];

  const form = useForm<CategoryFormInputType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      parentCategory: "",
      type: "PRIMARY",
    },
  });

  const [fileState, setFileState] = useState<FileState | null>(null);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileState((fileState) => {
      const newFileState = structuredClone(fileState);

      if (newFileState) {
        newFileState.progress = progress;
      }

      console.log(newFileState);
      return newFileState;
    });
  }

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (categoryDetails) {
      reset({
        name: categoryDetails?.name,
        type: watch("type"),
        parentCategory: categoryDetails.parentId || "",
        image: categoryDetails?.image || "",
      });
    }
  }, [categoryDetails, reset, watch]);

  console.log(watch("type"));

  // useEffect(() => {
  //   if (categoryDetails?.image) {
  //     setFileState({
  //       file: categoryDetails.image,
  //       key: categoryDetails.image,
  //       progress: "COMPLETE",
  //     });
  //   }
  // }, [categoryDetails]);

  const onEditCategorySubmit: SubmitHandler<CategoryFormInputType> = async (
    data
  ) => {
    if (categoryDetails?.id) {
      startTransition(async () => {
        const result = await updateCategory(categoryDetails?.id, data);

        if (result.success) {
          toast({
            title: "Category Saved",
            description: result.message,
            variant: "success",
          });
        } else {
          toast({
            title: "Category Saved failed",
            description: result.message,
            variant: "destructive",
          });
          console.error(result.message);
        }
      });
    }
  };

  return (
    <ContentLayout title="Create Category">
      <DynamicBreadcrumb items={breadcrumbItems} />
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
                      control={control}
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
                            value={field.value}
                            onValueChange={(currentValue) => {
                              if (currentValue !== "") {
                                field.onChange(currentValue);

                                router.push(
                                  `${pathname}?${createQueryString({
                                    category_type: currentValue,
                                    parent_category_id: "",
                                  })}`,
                                  { scroll: false }
                                );
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CATEGORY_TYPE.map((category) => {
                                return (
                                  <SelectItem key={category} value={category}>
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

              {watch("type") !== "PRIMARY" && (
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
                          <FormItem className="w-full flex flex-col gap-1">
                            <FormLabel>Parent Category</FormLabel>
                            <FormControl>
                              <Popover
                                open={openParentComboBox}
                                onOpenChange={setOpenParentComboBox}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="justify-between"
                                  >
                                    {field.value ? (
                                      parentCategories?.find(
                                        (category) =>
                                          category.id === field.value
                                      )?.name
                                    ) : (
                                      <p className="text-muted-foreground">
                                        Select a parent category
                                      </p>
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-[200px] p-0 popover-content-width-same-as-its-trigger">
                                  <Command>
                                    <CommandInput placeholder="Search parent category..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No parent category found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {parentCategories?.map((category) => (
                                          <CommandItem
                                            key={category.id}
                                            value={category.id}
                                            onSelect={() => {
                                              field.onChange(category.id);

                                              router.push(
                                                `${pathname}?${createQueryString(
                                                  {
                                                    parent_category_id:
                                                      category.id,
                                                  }
                                                )}`
                                              );

                                              setOpenParentComboBox(false);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                field.value === category.id
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {category.name}
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
                  </CardContent>
                </Card>
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

                                    input: { type: "category" },

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
    </ContentLayout>
  );
}
