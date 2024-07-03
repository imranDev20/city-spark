// Import necessary components and libraries
"use client";
import React, { Fragment } from "react";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { templateSchema } from "./schema";

// Define breadcrumb items
const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Templates", href: "/admin/templates" },
  {
    label: "Create Template",
    href: "/admin/templates/new",
    isCurrentPage: true,
  },
];

// Define default values and types

type FormInputType = z.infer<typeof templateSchema>;

// Component definition
export default function CreateTemplatePage() {
  // Initialize form using useForm and zodResolver for validation
  const form = useForm<FormInputType>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      fields: [{ fieldName: "", fieldType: "select", fieldValue: "" }],
      status: "draft",
    },
  });

  const { control, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  // Handle form submission
  const onCreateTemplateSubmit: SubmitHandler<FormInputType> = async (data) => {
    const { name, status, fields, description } = data;
    const payload = {
      name,
      status,
      fields,
      description,
    };
    console.log(`payload`, payload);
  };

  return (
    <ContentLayout title="Create Template">
      <Form {...form}>
        <form onSubmit={handleSubmit(onCreateTemplateSubmit)}>
          <DynamicBreadcrumb items={breadcrumbItems} />

          <div className="flex items-center gap-4 mb-5 mt-7">
            <Link href="/admin/templates">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>

            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Create Template
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              Active
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">Save Template</Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Template Details</CardTitle>
                  <CardDescription>
                    Please provide the template name and description.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="name">Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter template name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="description">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter the purpose of this template"
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
                  <CardTitle>Fields & Values</CardTitle>
                  <CardDescription>
                    Please provide the necessary fields and their corresponding
                    values.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 space-y-4">
                    {fields.map((field, index) => (
                      <Fragment key={field.id}>
                        <div
                          key={field.id}
                          className="grid gap-3 sm:grid-cols-9"
                        >
                          <div className="grid gap-3 col-span-4">
                            <FormField
                              name={`fields.${index}.fieldName`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter Field Name"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-3 col-span-4">
                            <FormField
                              name={`fields.${index}.fieldType`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Select>
                                      <SelectTrigger aria-label="Field Type">
                                        <SelectValue placeholder="Select Field Type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="text">
                                          Text
                                        </SelectItem>
                                        <SelectItem value="select">
                                          Select
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid gap-3 col-span-8">
                            <FormField
                              name={`fields.${index}.fieldValue`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter Value"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="col-span-1 flex justify-end items-center">
                            <Button
                              disabled={fields.length === 1}
                              variant="ghost"
                              onClick={() => remove(index)}
                            >
                              <Trash className="w-4 h-4 text-primary" />
                            </Button>
                          </div>
                        </div>

                        {fields.length - 1 !== index && <Separator />}
                      </Fragment>
                    ))}

                    <div>
                      <Button
                        type="button"
                        onClick={() =>
                          append({
                            fieldName: "",
                            fieldType: "select",
                            fieldValue: "",
                          })
                        }
                      >
                        Add new
                      </Button>
                    </div>
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
                  <div className="grid gap-6">
                    <FormField
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="status">Status</FormLabel>
                          <FormControl>
                            <Select>
                              <SelectTrigger
                                id="status"
                                aria-label="Select status"
                              >
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">
                                  Active
                                </SelectItem>
                                <SelectItem value="archived">
                                  Archived
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button type="submit" size="sm">
              Save Template
            </Button>
          </div>
        </form>
      </Form>
    </ContentLayout>
  );
}
