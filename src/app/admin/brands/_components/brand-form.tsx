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
import { Check, ChevronLeft, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@/components/ui/loading-button";
import { Brand, Status } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore";
import { BrandFormInputType, brandSchema } from "../schema";
import { createBrand, updateBrand } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import {
  FileState,
  SingleImageDropzone,
} from "@/components/custom/single-image-uploader";

export default function BrandForm({
  brandDetails,
}: {
  brandDetails?: Brand | null;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const [fileState, setFileState] = useState<FileState | null>(null);
  const { edgestore } = useEdgeStore();

  const form = useForm<BrandFormInputType>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      brandName: "",
      description: "",
      website: "",
      status: "DRAFT",
      image: "",
      countryOfOrigin: "",
    },
  });

  const {
    watch,
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  // Initialize form with brand data when editing
  useEffect(() => {
    if (brandDetails) {
      reset({
        brandName: brandDetails.name,
        description: brandDetails.description || "",
        website: brandDetails.website || "",
        status: brandDetails.status || "DRAFT",
        image: brandDetails.image || "",
        countryOfOrigin: brandDetails.countryOfOrigin || "",
      });
      if (brandDetails?.image) {
        setFileState({
          file: brandDetails.image,
          progress: "COMPLETE",
          key: "",
        });
      }
    }
  }, [brandDetails, reset]);

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileState((fileState) => {
      const newFileState = structuredClone(fileState);
      if (newFileState) {
        newFileState.progress = progress;
      }
      return newFileState;
    });
  }

  const onSubmit = (data: BrandFormInputType) => {
    startTransition(async () => {
      try {
        let result;
        if (brandDetails) {
          result = await updateBrand(brandDetails.id, data);
        } else {
          result = await createBrand(data);
        }

        if (result.success) {
          toast({
            title: brandDetails ? "Brand Updated" : "Brand Created",
            description: result.message,
            variant: "success",
          });
          router.push("/admin/brands");
        } else {
          toast({
            title: "Error",
            description:
              result.message ||
              `Failed to ${brandDetails ? "update" : "create"} brand.`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(
          `Error ${brandDetails ? "updating" : "creating"} brand:`,
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
          <Link href="/admin/brands">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {brandDetails ? `Edit ${brandDetails.name}` : "Add New Brand"}
          </h1>
          <div className="hidden items-center gap-4 ml-auto md:flex">
            <Link href="/admin/brands">
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
              {brandDetails ? "Update Brand" : "Save Brand"}
            </LoadingButton>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Brand Details</CardTitle>
                <CardDescription>
                  Enter the basic information for this brand.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <FormField
                    name="brandName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter brand name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter brand description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter brand website" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="countryOfOrigin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country of Origin</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter country of origin"
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
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
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
                          {Object.values(Status).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logo</CardTitle>
                <CardDescription>Upload your brand logo here.</CardDescription>
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
                                input: { type: "brand" },
                                onProgressChange: async (progress) => {
                                  updateFileProgress(addedFile.key, progress);
                                  if (progress === 100) {
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
            {brandDetails ? "Update Brand" : "Save Brand"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
