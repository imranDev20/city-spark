"use client";

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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useTransition } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import { createTemplate } from "../actions";
import { TemplateFormInputType, templateSchema } from "../schema";

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

// Component definition
export default function CreateTemplatePage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  // Initialize form using useForm and zodResolver for validation
  const form = useForm<TemplateFormInputType>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      fields: [
        { fieldId: "", fieldName: "", fieldType: "TEXT", fieldOptions: "" },
      ],
      status: "DRAFT",
    },
  });

  const { control, handleSubmit, watch, formState } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  // Handle form submission
  const onCreateTemplateSubmit: SubmitHandler<TemplateFormInputType> = async (
    data
  ) => {
    startTransition(async () => {
      const result = await createTemplate(data);

      if (result.success) {
        toast({
          title: "Brand Template",
          description: result.message,
          variant: "success",
        });

        router.push("/admin/templates");
      } else {
        toast({
          title: "Templates Saved failed",
          description: result.message,
          variant: "destructive",
        });
        console.error(result.message);
      }
    });
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
              <Button variant="outline" size="sm" type="button">
                Discard
              </Button>
              <LoadingButton
                type="submit"
                disabled={isPending}
                size="sm"
                loading={isPending}
                className="text-xs font-semibold h-8"
              >
                Save Template
              </LoadingButton>
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
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                      }}
                                      value={field.value}
                                    >
                                      <SelectTrigger aria-label="Field Type">
                                        <SelectValue placeholder="Select Field Type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="TEXT">
                                          Text
                                        </SelectItem>
                                        <SelectItem value="SELECT">
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

                          {watch("fields")[index].fieldType === "SELECT" && (
                            <div className="grid gap-3 col-span-8">
                              <FormField
                                name={`fields.${index}.fieldOptions`}
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
                          )}

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
                            fieldId: "",
                            fieldName: "",
                            fieldType: "TEXT",
                            fieldOptions: "",
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
                            <Select
                              onValueChange={(value) => {
                                if (value) {
                                  field.onChange(value);
                                }
                              }}
                              value={field.value}
                            >
                              <SelectTrigger
                                id="status"
                                aria-label="Select status"
                              >
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="ARCHIVED">
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
            <LoadingButton
              type="submit"
              disabled={isPending}
              size="sm"
              loading={isPending}
              className="text-xs font-semibold h-8"
            >
              Save Brand
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ContentLayout>
  );
}
