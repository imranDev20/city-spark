"use client";

import React, { Fragment, useEffect, useState, useTransition } from "react";
import { Plus, Trash } from "lucide-react";

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { useEdgeStore } from "@/lib/edgestore";

import {
  FileState,
  SingleImageDropzone,
} from "@/components/custom/single-image-uploader";
import { updateUser } from "../actions";
import { FromInputType, userSchema } from "../schema";
import UserFormHeader from "./user-form-header";
import { UserDetails } from "@/services/admin-users";

export default function UserForm({
  userDetails,
}: {
  userDetails?: UserDetails;
}) {
  // State management
  const [isPending, startTransition] = useTransition();
  const [fileState, setFileState] = useState<FileState | null>(null);

  // Hooks
  const { toast } = useToast();
  const { edgestore } = useEdgeStore();

  // Form setup with react-hook-form
  const form = useForm<FromInputType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: [
        {
          addressId: "",
          city: "",
          postalCode: "",
          state: "",
          addressLine1: "",
          addressLine2: "",
          country: "",
        },
      ],
    },
  });

  // Destructure form methods
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  // Setup field array for addresses
  const { fields, append, remove } = useFieldArray({
    control,
    name: "address",
  });

  // File upload progress handler
  const updateFileProgress = (key: string, progress: FileState["progress"]) => {
    setFileState((currentFileState) => {
      if (!currentFileState) return null;
      return {
        ...currentFileState,
        progress,
      };
    });
  };

  // Initialize form with user details
  useEffect(() => {
    if (userDetails) {
      const { firstName, lastName, email, phone, addresses } = userDetails;

      reset({
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        email: email ?? "",
        phone: phone ?? "",
        address:
          addresses?.map((address) => ({
            addressId: address.id,
            addressLine1: address.addressLine1 ?? "",
            addressLine2: address.addressLine2 ?? "",
            city: address.city ?? "",
            country: address.country ?? "",
            postalCode: address.postcode ?? "",
            state: address.county ?? "",
          })) ?? [],
      });
    }
  }, [userDetails, reset]);

  // Initialize avatar if exists
  useEffect(() => {
    if (userDetails?.avatar) {
      setFileState({
        file: userDetails.avatar,
        key: userDetails.avatar,
        progress: "COMPLETE",
      });
    }
  }, [userDetails?.avatar]);

  // Form submission handler
  const onEditUserSubmit: SubmitHandler<FromInputType> = async (data) => {
    if (!userDetails?.id) return;

    startTransition(async () => {
      const result = await updateUser(userDetails.id, data);

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
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onEditUserSubmit)}>
        <UserFormHeader isPending={isPending} userDetails={userDetails} />

        <div className="container pt-8 pb-4 px-4 sm:px-8">
          <div className="grid gap-6 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2 space-y-7">
              {/* Personal Details Card */}
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Personal Details</CardTitle>
                  <CardDescription>
                    Please provide the user&apos;s personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            First Name{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Last Name{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email Address{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter email address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter phone number"
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

              {/* Address Card */}
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Addresses</CardTitle>
                  <CardDescription>
                    Manage user&apos;s addresses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {fields.map((field, index) => (
                    <Fragment key={field.id}>
                      <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">Address {index + 1}</h3>
                          <Button
                            disabled={fields.length === 1}
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                        <div className="grid gap-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              name={`address.${index}.addressLine1`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Address Line 1{" "}
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Street address"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name={`address.${index}.addressLine2`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address Line 2</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Apartment, suite, etc."
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-3">
                            <FormField
                              name={`address.${index}.city`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    City{" "}
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter city"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name={`address.${index}.state`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    County/State{" "}
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter county/state"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name={`address.${index}.postalCode`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Postal Code{" "}
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter postal code"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            name={`address.${index}.country`}
                            control={control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Country{" "}
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter country"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      {fields.length - 1 !== index && <Separator />}
                    </Fragment>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      append({
                        addressLine1: "",
                        addressLine2: "",
                        city: "",
                        state: "",
                        postalCode: "",
                        country: "",
                      })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Address
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Profile Picture</CardTitle>
                  <CardDescription>
                    Upload a profile picture for the user
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <SingleImageDropzone
                            className="w-full"
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
                        <FormMessage />
                        <p className="text-xs text-muted-foreground mt-2">
                          Maximum file size: 1MB. Supported formats: JPEG, PNG
                        </p>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
