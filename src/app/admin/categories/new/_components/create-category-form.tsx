"use client";

import Link from "next/link";
import React, { useState, useTransition } from "react";
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
import { createCategory } from "../../actions";
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
import { useEdgeStore } from "@/lib/edgestore";
import { FileState, SingleImageDropzone } from "./category-image-uploder";

export default function CreateCategoryForm({
  parentPrimaryCategories,
  parentSecondaryCategories,
  parentTertiaryCategories,
}: {
  parentPrimaryCategories: Category[] | null;
  parentSecondaryCategories: Category[] | null;
  parentTertiaryCategories: Category[] | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { createQueryString } = useQueryString();
  const { toast } = useToast();
  const [fileState, setFileState] = useState<FileState | null>(null);
  const { edgestore } = useEdgeStore();
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const selectedType = searchParams.get("category_type") as CategoryType;
  const selectedPrimaryCategory = searchParams.get("parent_primary_id") ?? "";
  const selectedSecondaryCategory =
    searchParams.get("parent_secondary_id") ?? "";
  const selectedTertiaryCategory = searchParams.get("parent_tertiary_id") ?? "";

  const [openPrimaryCategoriesComboBox, setOpenPrimaryCategoriesComboBox] =
    useState<boolean>(false);
  const [openSecondaryCategoriesComboBox, setOpenSecondaryCategoriesComboBox] =
    useState<boolean>(false);
  const [openTertiaryCategoreisComboBox, setOpenTertiaryCategoriesComboBox] =
    useState<boolean>(false);

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
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      parentPrimaryCategory: "",
      parentSecondaryCategory: "",
      parentTertiaryCategory: "",
      type: "PRIMARY",
    },
  });

  const { control, handleSubmit, watch } = form;

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

  const isPrimary = watch("type") === "PRIMARY";
  const isSecondary = watch("type") === "SECONDARY";
  const isTertiary = watch("type") === "TERTIARY";
  const isQuaternary = watch("type") === "QUATERNARY";

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
            Add New Category
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
                    control={control}
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
                          onValueChange={(currentValue) => {
                            if (currentValue) {
                              field.onChange(currentValue);

                              router.push(
                                `${pathname}?${createQueryString({
                                  category_type: currentValue,
                                  parent_category_id: "",
                                })}`
                              );

                              form.setValue("parentPrimaryCategory", "");
                              form.setValue("parentSecondaryCategory", "");
                              form.setValue("parentTertiaryCategory", "");
                            }
                          }}
                          value={
                            searchParams.get("category_type") || field.value
                          }
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

            {!isPrimary && (
              <Card>
                <CardHeader>
                  <CardTitle>Parent Categories</CardTitle>
                  <CardDescription>
                    Specify the parent categories if applicable.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {(isSecondary || isTertiary || isQuaternary) && (
                      <FormField
                        control={control}
                        name="parentPrimaryCategory"
                        render={({ field }) => (
                          <FormItem className="grid gap-1">
                            <FormLabel>Parent Primary Category</FormLabel>
                            <FormControl>
                              <Popover
                                open={openPrimaryCategoriesComboBox}
                                onOpenChange={setOpenPrimaryCategoriesComboBox}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={
                                      openPrimaryCategoriesComboBox
                                    }
                                    className="justify-between"
                                  >
                                    {field.value ? (
                                      parentPrimaryCategories?.find(
                                        (parentPrimary) =>
                                          parentPrimary.id === field.value
                                      )?.name
                                    ) : (
                                      <p className="text-muted-foreground">
                                        Select a primary category
                                      </p>
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-[320px]">
                                  <Command>
                                    <CommandInput placeholder="Search brands..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No framework found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {parentPrimaryCategories?.map(
                                          (primaryCategory) => (
                                            <CommandItem
                                              key={primaryCategory.id}
                                              value={primaryCategory.name}
                                              onSelect={() => {
                                                field.onChange(
                                                  primaryCategory.id
                                                );

                                                router.push(
                                                  `${pathname}?${createQueryString(
                                                    {
                                                      parent_primary_id:
                                                        primaryCategory.id,

                                                      parent_secondary_id: "",
                                                      parent_tertiary_id: "",
                                                      parent_quaternary_id: "",
                                                    }
                                                  )}`,
                                                  {
                                                    scroll: false,
                                                  }
                                                );

                                                setOpenPrimaryCategoriesComboBox(
                                                  false
                                                );
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  field.value ===
                                                    primaryCategory.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                              />
                                              {primaryCategory.name}
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

                    {(isTertiary || isQuaternary) && (
                      <FormField
                        control={control}
                        name="parentSecondaryCategory"
                        render={({ field }) => (
                          <FormItem className="grid gap-1">
                            <FormLabel>Parent Secondary Category</FormLabel>
                            <FormControl>
                              <Popover
                                open={openSecondaryCategoriesComboBox}
                                onOpenChange={
                                  setOpenSecondaryCategoriesComboBox
                                }
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={
                                      openSecondaryCategoriesComboBox
                                    }
                                    className="justify-between"
                                  >
                                    {field.value ? (
                                      parentSecondaryCategories?.find(
                                        (parentSecondary) =>
                                          parentSecondary.id === field.value
                                      )?.name
                                    ) : (
                                      <p className="text-muted-foreground">
                                        Select a secondary category
                                      </p>
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-[320px]">
                                  <Command>
                                    <CommandInput placeholder="Search categories..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No framework found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {parentSecondaryCategories?.map(
                                          (secondaryCategory) => (
                                            <CommandItem
                                              key={secondaryCategory.id}
                                              value={secondaryCategory.name}
                                              onSelect={() => {
                                                field.onChange(
                                                  secondaryCategory.id
                                                );

                                                router.push(
                                                  `${pathname}?${createQueryString(
                                                    {
                                                      parent_primary_id:
                                                        selectedPrimaryCategory,

                                                      parent_secondary_id:
                                                        secondaryCategory.id,
                                                      parent_tertiary_id: "",
                                                      quaternary_category_id:
                                                        "",
                                                    }
                                                  )}`,
                                                  {
                                                    scroll: false,
                                                  }
                                                );

                                                setOpenSecondaryCategoriesComboBox(
                                                  false
                                                );
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  field.value ===
                                                    secondaryCategory.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                              />
                                              {secondaryCategory.name}
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

                    {isQuaternary && (
                      <FormField
                        control={control}
                        name="parentTertiaryCategory"
                        render={({ field }) => (
                          <FormItem className="grid gap-1">
                            <FormLabel>Parent Tertiary Category</FormLabel>
                            <FormControl>
                              <Popover
                                open={openTertiaryCategoreisComboBox}
                                onOpenChange={setOpenTertiaryCategoriesComboBox}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={
                                      openTertiaryCategoreisComboBox
                                    }
                                    className="justify-between"
                                  >
                                    {field.value ? (
                                      parentTertiaryCategories?.find(
                                        (parentTertiary) =>
                                          parentTertiary.id === field.value
                                      )?.name
                                    ) : (
                                      <p className="text-muted-foreground">
                                        Select a tertiary category
                                      </p>
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-[320px]">
                                  <Command>
                                    <CommandInput placeholder="Search brands..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No framework found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {parentTertiaryCategories?.map(
                                          (tertiaryCategory) => (
                                            <CommandItem
                                              key={tertiaryCategory.id}
                                              value={tertiaryCategory.name}
                                              onSelect={() => {
                                                field.onChange(
                                                  tertiaryCategory.id
                                                );

                                                router.push(
                                                  `${pathname}?${createQueryString(
                                                    {
                                                      parent_primary_id:
                                                        selectedPrimaryCategory,

                                                      parent_secondary_id:
                                                        selectedSecondaryCategory,
                                                      parent_tertiary_id:
                                                        tertiaryCategory.id,
                                                    }
                                                  )}`,
                                                  {
                                                    scroll: false,
                                                  }
                                                );

                                                setOpenTertiaryCategoriesComboBox(
                                                  false
                                                );
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  field.value ===
                                                    tertiaryCategory.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                              />
                                              {tertiaryCategory.name}
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
