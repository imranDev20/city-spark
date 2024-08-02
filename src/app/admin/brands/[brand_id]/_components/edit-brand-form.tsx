"use client";

import { ContentLayout } from "@/app/admin/_components/content-layout";
import DynamicBreadcrumb from "@/app/admin/_components/dynamic-breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { updateBrand } from "../../actions";
import { BrandFormInputType, brandSchema } from "../../schema";
import {
  FileState,
  SingleImageDropzone,
} from "../../_components/brand-image-uploader";
import { useEdgeStore } from "@/lib/edgestore";

export type BrandWithRelations = Prisma.BrandGetPayload<{}>;

export default function EditBrandForm({
  brandDetails,
}: {
  brandDetails: BrandWithRelations;
}) {
  const form = useForm<BrandFormInputType>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      description: "",
      brandName: "",
      website: "",
      status: "DRAFT",
      countryOfOrigin: "",
    },
  });

  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
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
    reset,
    watch,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (brandDetails) {
      const { name, website, description, status, image, countryOfOrigin } =
        brandDetails;

      reset({
        brandName: name ?? "",
        description: description ?? "",
        website: website ?? "",
        status: status ?? "DRAFT",
        image: image ?? "",
        countryOfOrigin: countryOfOrigin ?? "",
      });
    }
  }, [brandDetails, reset]);

  useEffect(() => {
    if (brandDetails.image) {
      setFileState({
        file: brandDetails.image,
        key: brandDetails.image,
        progress: "COMPLETE",
      });
    }
  }, [brandDetails]);

  const onEditBrandSubmit: SubmitHandler<BrandFormInputType> = async (data) => {
    console.log(data);
    if (brandDetails?.id) {
      startTransition(async () => {
        const result = await updateBrand(brandDetails?.id, data);

        if (result.success) {
          toast({
            title: "Brand Updated",
            description: result.message,
            variant: "success",
          });
        } else {
          toast({
            title: "Brand Saved failed",
            description: result.message,
            variant: "destructive",
          });
        }
      });
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Brands", href: "/admin/brands" },
    {
      label: `${brandDetails?.name}`,
      href: "/admin/brands/new",
      isCurrentPage: true,
    },
  ];

  return (
    <ContentLayout title="Create Brands">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Form {...form}>
        <form onSubmit={handleSubmit(onEditBrandSubmit)}>
          <div className="flex items-center gap-4 mb-5 mt-7">
            <Link href="/admin/brands">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {`Edit ${brandDetails?.name}`}
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              {brandDetails.status}
            </Badge>
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
                Save Changes
              </LoadingButton>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Details</CardTitle>
                  <CardDescription>
                    Please provide the brand details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="brandName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter brand name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-3 mt-2">
                    <FormField
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              id="description"
                              className="min-h-32"
                              placeholder="Enter brand description"
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
                  <CardTitle>Brand Links</CardTitle>
                  <CardDescription>
                    Please provide the brand links.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter website URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="countryOfOrigin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country of Origin</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter country of origin"
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
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-3">
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              if (value) field.onChange(value);
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="ARCHIVED">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logo</CardTitle>
                  <CardDescription>
                    Upload your brand logo here.
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
        </form>
      </Form>
    </ContentLayout>
  );
}
