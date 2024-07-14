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
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { LoadingButton } from "@/components/ui/loading-button";
import { Spinner } from "@/components/ui/spinner";
import { Fragment, useEffect, useState, useTransition } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { getTemplateById, updateTemplateById } from "../../actions";
import { templateSchema } from "../../new/schema";
console.log(updateTemplateById);
// Define default values and types

export type FormInputType = z.infer<typeof templateSchema>;
export default function EditTemplateForm() {
  // Initialize form using useForm and zodResolver for validation
  const form = useForm<FormInputType>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      fields: [{ fieldName: "", fieldType: "", fieldValue: "" }],
      status: "draft",
    },
  });
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });
  const [fieldTypes, setFieldTypes] = useState(
    fields.map((field) => field.fieldType)
  );

  const handleFieldTypeChange = (index: number, value: string) => {
    const newFieldTypes = [...fieldTypes];
    newFieldTypes[index] = value;
    setFieldTypes(newFieldTypes);
  };

  const {
    data: templateDetails,
    isPending: isTemplateDetailsPending,
    isFetching: isTemplateDetailsFetching,
    isError: isTemplateDetailsError,
    error: TemplateDetailsError,
  } = useQuery({
    queryKey: ["template-details"],
    queryFn: async () => await getTemplateById(params.template_id as string),
  });

  //   console.log(templateDetails);

  // Handle form submission
  const onEditTemplateSubmit: SubmitHandler<FormInputType> = async (data) => {
    if (templateDetails?.id) {
      startTransition(async () => {
        const result = await updateTemplateById(templateDetails?.id, data);

        if (result.success) {
          // Handle successful deletion (e.g., show a success message, update UI)
          console.log(result.message);
          toast({
            title: "Template Updated",
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
    }
  };

  useEffect(() => {
    if (templateDetails) {
      const { name, description } = templateDetails;
      reset({
        name: name ?? "",
        description: description ?? "",
      });
    }
  }, [templateDetails, reset]);

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Templates", href: "/admin/templates" },
    {
      label: `${templateDetails?.name}`,
      href: "/admin/templates/new",
      isCurrentPage: true,
    },
  ];

  if (
    isTemplateDetailsPending ||
    isTemplateDetailsFetching ||
    isTemplateDetailsError ||
    TemplateDetailsError
  ) {
    return (
      <div className="min-h-[100vh] flex justify-center items-center">
        <Spinner className="text-secondary" size="large" />
      </div>
    );
  }

  return (
    <ContentLayout title="Edit Template">
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={handleSubmit(onEditTemplateSubmit)}>
            <DynamicBreadcrumb items={breadcrumbItems} />

            <div className="flex items-center gap-4 mb-5 mt-7">
              <Link href="/admin/templates">
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>

              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {`Edit ${templateDetails?.name}`}
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                Active
              </Badge>
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
                  Update Template
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
                      Please provide the necessary fields and their
                      corresponding values.
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
                                          handleFieldTypeChange(index, value);
                                        }}
                                        defaultValue={field.value}
                                        value={fieldTypes[index]}
                                      >
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

                            {fieldTypes[index] === "select" && (
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
              <LoadingButton
                type="submit"
                disabled={isPending}
                size="sm"
                loading={isPending}
                className="text-xs font-semibold h-8"
              >
                Update Template
              </LoadingButton>
            </div>
          </form>
        </Form>
      </FormProvider>
    </ContentLayout>
  );
}
