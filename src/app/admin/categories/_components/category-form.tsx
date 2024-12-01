"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Check, ChevronLeft, ChevronsUpDown, X } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@/components/ui/loading-button";
import { cn } from "@/lib/utils";
import { Category, CategoryType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import { useEdgeStore } from "@/lib/edgestore";
import { CategoryFormInputType, categorySchema } from "../schema";
import { createCategory, updateCategory } from "../actions";
import {
  FileState,
  SingleImageDropzone,
} from "@/components/custom/single-image-uploader";

const fetchCategories = async ({
  queryKey,
}: {
  queryKey: (string | CategoryType)[];
}): Promise<Category[]> => {
  const [_, type, parentId] = queryKey;
  const { data } = await axios.get("/api/categories", {
    params: { type, parentId },
  });
  return data.data;
};

export default function CategoryForm({
  categoryDetails,
}: {
  categoryDetails?: Category | null;
}) {
  const [openPrimary, setOpenPrimary] = useState(false);
  const [openSecondary, setOpenSecondary] = useState(false);
  const [openTertiary, setOpenTertiary] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const [fileState, setFileState] = useState<FileState | null>(null);
  const { edgestore } = useEdgeStore();

  const form = useForm<CategoryFormInputType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: "",
      parentPrimaryCategory: "",
      type: "PRIMARY",
      parentSecondaryCategory: "",
      parentTertiaryCategory: "",
    },
  });

  const {
    watch,
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  const categoryType = watch("type");
  const selectedPrimaryId = watch("parentPrimaryCategory");
  const selectedSecondaryId = watch("parentSecondaryCategory");

  // Initialize form with category data when editing
  useEffect(() => {
    if (categoryDetails) {
      reset({
        name: categoryDetails.name,
        type: categoryDetails.type,
        image: categoryDetails.image || "",
        parentPrimaryCategory: categoryDetails.parentPrimaryCategoryId || "",
        parentSecondaryCategory:
          categoryDetails.parentSecondaryCategoryId || "",
        parentTertiaryCategory: categoryDetails.parentTertiaryCategoryId || "",
      });
      if (categoryDetails?.image) {
        setFileState({
          file: categoryDetails.image,
          progress: "COMPLETE",
          key: "",
        });
      }
    }
  }, [categoryDetails, reset]);

  const {
    data: primaryCategories,
    isLoading: isPrimaryLoading,
    error: primaryError,
  } = useQuery({
    queryKey: ["categories", "PRIMARY"],
    queryFn: fetchCategories,
    enabled: ["SECONDARY", "TERTIARY", "QUATERNARY"].includes(categoryType),
  });

  const {
    data: secondaryCategories,
    isLoading: isSecondaryLoading,
    error: secondaryError,
  } = useQuery({
    queryKey: ["categories", "SECONDARY", selectedPrimaryId ?? "none"],
    queryFn: fetchCategories,
    enabled:
      !!selectedPrimaryId && ["TERTIARY", "QUATERNARY"].includes(categoryType),
  });

  const {
    data: tertiaryCategories,
    isLoading: isTertiaryLoading,
    error: tertiaryError,
  } = useQuery({
    queryKey: ["categories", "TERTIARY", selectedSecondaryId ?? "none"],
    queryFn: fetchCategories,
    enabled: !!selectedSecondaryId && categoryType === "QUATERNARY",
  });

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileState((fileState) => {
      const newFileState = structuredClone(fileState);
      if (newFileState) {
        newFileState.progress = progress;
      }
      return newFileState;
    });
  }

  const onSubmit = (data: CategoryFormInputType) => {
    startTransition(async () => {
      try {
        let result;
        if (categoryDetails) {
          result = await updateCategory(categoryDetails.id, data);
        } else {
          result = await createCategory(data);
        }

        if (result.success) {
          toast({
            title: categoryDetails ? "Category Updated" : "Category Created",
            description: categoryDetails
              ? "The category has been successfully updated."
              : "The category has been successfully created.",
            variant: "success",
          });
          router.push("/admin/categories");
        } else {
          toast({
            title: "Error",
            description:
              result.message ||
              `Failed to ${categoryDetails ? "update" : "create"} category.`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(
          `Error ${categoryDetails ? "updating" : "creating"} category:`,
          error
        );
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 mb-8 mt-7">
          <Link href="/admin/categories">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {categoryDetails
              ? `Edit ${categoryDetails.name}`
              : "Add New Category"}
          </h1>
          <div className="hidden items-center gap-4 ml-auto md:flex">
            <Link href="/admin/categories">
              <Button type="button" variant="outline" className="h-9">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <LoadingButton
              type="submit"
              className="h-9"
              disabled={
                !isDirty ||
                isPending ||
                typeof fileState?.progress === "number" ||
                fileState?.progress === "PENDING"
              }
              loading={isPending}
            >
              {!isPending && <Check className="mr-2 h-4 w-4" />}
              {categoryDetails ? "Update Category" : "Save Category"}
            </LoadingButton>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
                <CardDescription>
                  Enter the basic information for this category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter category name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="type"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>Category Type</FormLabel>
                        <FormControl>
                          <Select
                            value={value}
                            onValueChange={(value) => {
                              if (value) {
                                onChange(value);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PRIMARY">Primary</SelectItem>
                              <SelectItem value="SECONDARY">
                                Secondary
                              </SelectItem>
                              <SelectItem value="TERTIARY">Tertiary</SelectItem>
                              <SelectItem value="QUATERNARY">
                                Quaternary
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {categoryType !== "PRIMARY" && (
              <Card>
                <CardHeader>
                  <CardTitle>Parent Categories</CardTitle>
                  <CardDescription>
                    Specify the parent categories if applicable.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {["SECONDARY", "TERTIARY", "QUATERNARY"].includes(
                      categoryType
                    ) && (
                      <FormField
                        control={control}
                        name="parentPrimaryCategory"
                        render={({ field }) => (
                          <FormItem className="grid gap-1">
                            <FormLabel>Parent Primary Category</FormLabel>
                            <FormControl>
                              <Popover
                                open={openPrimary}
                                onOpenChange={setOpenPrimary}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openPrimary}
                                    className="justify-between"
                                    disabled={isPrimaryLoading}
                                  >
                                    {field.value ? (
                                      primaryCategories?.find(
                                        (category) =>
                                          category.id === field.value
                                      )?.name
                                    ) : (
                                      <p className="text-muted-foreground">
                                        Select a primary category
                                      </p>
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 ">
                                  <Command>
                                    <CommandInput placeholder="Search categories..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No category found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {primaryCategories?.map((category) => (
                                          <CommandItem
                                            key={category.id}
                                            value={category.name}
                                            onSelect={() => {
                                              field.onChange(category.id);
                                              setOpenPrimary(false);
                                              // Reset child categories
                                              form.setValue(
                                                "parentSecondaryCategory",
                                                ""
                                              );
                                              form.setValue(
                                                "parentTertiaryCategory",
                                                ""
                                              );
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
                    )}

                    {["TERTIARY", "QUATERNARY"].includes(categoryType) && (
                      <FormField
                        control={control}
                        name="parentSecondaryCategory"
                        render={({ field }) => (
                          <FormItem className="grid gap-1">
                            <FormLabel>Parent Secondary Category</FormLabel>
                            <FormControl>
                              <Popover
                                open={openSecondary}
                                onOpenChange={setOpenSecondary}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openSecondary}
                                    className="justify-between"
                                    disabled={
                                      isSecondaryLoading || !selectedPrimaryId
                                    }
                                  >
                                    {field.value ? (
                                      secondaryCategories?.find(
                                        (category) =>
                                          category.id === field.value
                                      )?.name
                                    ) : (
                                      <p className="text-muted-foreground">
                                        Select a secondary category
                                      </p>
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0">
                                  <Command>
                                    <CommandInput placeholder="Search categories..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No category found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {secondaryCategories?.map(
                                          (category) => (
                                            <CommandItem
                                              key={category.id}
                                              value={category.name}
                                              onSelect={() => {
                                                field.onChange(category.id);
                                                setOpenSecondary(false);
                                                // Reset tertiary category
                                                form.setValue(
                                                  "parentTertiaryCategory",
                                                  ""
                                                );
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
                                          )
                                        )}
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
                    )}

                    {categoryType === "QUATERNARY" && (
                      <FormField
                        control={control}
                        name="parentTertiaryCategory"
                        render={({ field }) => (
                          <FormItem className="grid gap-1">
                            <FormLabel>Parent Tertiary Category</FormLabel>
                            <FormControl>
                              <Popover
                                open={openTertiary}
                                onOpenChange={setOpenTertiary}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openTertiary}
                                    className="justify-between"
                                    disabled={
                                      isTertiaryLoading || !selectedSecondaryId
                                    }
                                  >
                                    {field.value ? (
                                      tertiaryCategories?.find(
                                        (category) =>
                                          category.id === field.value
                                      )?.name
                                    ) : (
                                      <p className="text-muted-foreground">
                                        Select a tertiary category
                                      </p>
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0">
                                  <Command>
                                    <CommandInput placeholder="Search categories..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No category found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {tertiaryCategories?.map((category) => (
                                          <CommandItem
                                            key={category.id}
                                            value={category.name}
                                            onSelect={() => {
                                              field.onChange(category.id);
                                              setOpenTertiary(false);
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
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-5">
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>
                  Upload your category image here.
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
                              const res = await edgestore.publicImages.upload({
                                file: addedFile.file,
                                options: {
                                  temporary: true,
                                },

                                input: { type: "category" },

                                onProgressChange: async (progress) => {
                                  updateFileProgress(addedFile.key, progress);

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
                              });

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

        <div className="mt-8 flex justify-end md:hidden">
          <Button type="button" variant="outline" className="mr-4">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            disabled={
              !isDirty ||
              isPending ||
              typeof fileState?.progress === "number" ||
              fileState?.progress === "PENDING"
            }
            loading={isPending}
          >
            {!isPending && <Check className="mr-2 h-4 w-4" />}
            {categoryDetails ? "Update Category" : "Save Category"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
