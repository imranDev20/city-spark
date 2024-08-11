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
import { Brand, Category, Prisma } from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProductFormInputType } from "../../schema";
import Link from "next/link";
import { updateProduct } from "../../actions";
import { useToast } from "@/components/ui/use-toast";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronsUpDown } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEdgeStore } from "@/lib/edgestore";
import { FileState } from "../../_components/product-image-uploader";
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
import { usePathname, useRouter } from "next/navigation";
import useQueryString from "@/hooks/use-query-string";

export type ProductWithRelation = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    productTemplate: {
      include: {
        fields: {
          include: {
            templateField: true;
          };
        };
      };
    };
  };
}>;

export type TemplateWithRelation = Prisma.TemplateGetPayload<{
  include: {
    fields: true;
  };
}>;

export default function EditProductForm({
  productDetails,
  brands,
  templates,
  primaryCategories,
}: {
  productDetails: ProductWithRelation;
  templates: TemplateWithRelation[];
  brands: Brand[];
  primaryCategories: Category[];
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { edgestore } = useEdgeStore();
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const router = useRouter();
  const { createQueryString } = useQueryString();
  const pathname = usePathname();

  const [openPrimaryCategoriesComboBox, setOpenPrimaryCategoriesComboBox] =
    useState<boolean>(false);

  const form = useForm<ProductFormInputType>({
    defaultValues: {
      name: "",
      primaryCategory: "",
      secondaryCategory: "",
      tertiaryCategory: "",
      quaternaryCategory: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = form;

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Products", href: "/admin/products" },
    {
      label: `${productDetails?.name}`,
      isCurrentPage: true,
    },
  ];

  const onEditProductSubmit: SubmitHandler<ProductFormInputType> = async (
    data
  ) => {
    if (productDetails?.id) {
      startTransition(async () => {
        const result = await updateProduct(productDetails?.id, data);

        const images = form.watch("images");

        if (result.success) {
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
    <ContentLayout title="Edit Product">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <Form {...form}>
        <form onSubmit={handleSubmit(onEditProductSubmit)}>
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
              {`Edit ${productDetails?.name}`}
            </h1>

            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => reset()}
              >
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
              <Card x-chunk="dashboard-07-chunk-2">
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={control}
                      name="primaryCategory"
                      render={({ field }) => (
                        <FormItem className="grid gap-1">
                          <FormLabel>Primary</FormLabel>
                          <FormControl>
                            <Popover
                              open={openPrimaryCategoriesComboBox}
                              onOpenChange={setOpenPrimaryCategoriesComboBox}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openPrimaryCategoriesComboBox}
                                  className="justify-between"
                                >
                                  {field.value ? (
                                    primaryCategories?.find(
                                      (primaryCategory) =>
                                        primaryCategory.id === field.value
                                    )?.name
                                  ) : (
                                    <p className="text-muted-foreground">
                                      Select a primary category
                                    </p>
                                  )}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandInput placeholder="Search brands..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No framework found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {primaryCategories?.map(
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
                                                    primary_category_id:
                                                      primaryCategory.id,

                                                    secondary_category_id: "",
                                                    tertiary_category_id: "",
                                                    quaternary_category_id: "",
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
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid auto-rows-max items-start gap-4 lg:gap-8"></div>
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
}
