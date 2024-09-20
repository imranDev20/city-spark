"use client";

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
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Trash, Check, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useTransition } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { createTemplate, updateTemplate } from "../actions";
import { TemplateFormInputType, templateSchema } from "../schema";
import { Prisma } from "@prisma/client";

export type TemplateWithRelations = Prisma.TemplateGetPayload<{
  include: {
    fields: true;
  };
}>;

interface TemplateFormProps {
  templateDetails?: TemplateWithRelations | null;
}

export default function TemplateForm({ templateDetails }: TemplateFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

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

  const { control, handleSubmit, watch, formState, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  useEffect(() => {
    if (templateDetails) {
      reset({
        name: templateDetails.name,
        description: templateDetails.description || "",
        status: templateDetails.status || "DRAFT",
        fields: templateDetails.fields.map((field) => ({
          fieldId: field.id,
          fieldName: field.fieldName,
          fieldType: field.fieldType,
          fieldOptions: field.fieldOptions || "",
        })),
      });
    }
  }, [templateDetails, reset]);

  const onSubmit: SubmitHandler<TemplateFormInputType> = async (data) => {
    startTransition(async () => {
      const result = templateDetails
        ? await updateTemplate(templateDetails.id, data)
        : await createTemplate(data);

      if (result.success) {
        toast({
          title: templateDetails ? "Template Updated" : "Template Created",
          description: result.message,
          variant: "success",
        });
        router.push("/admin/templates");
      } else {
        toast({
          title: "Template Save Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 mb-8 mt-7">
          <Link href="/admin/templates">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {templateDetails
              ? `Edit ${templateDetails.name}`
              : "Add New Template"}
          </h1>
          {templateDetails && (
            <Badge variant="outline" className="ml-auto">
              {templateDetails.status}
            </Badge>
          )}
          <div className="hidden items-center gap-4 ml-auto md:flex">
            <Link href="/admin/templates">
              <Button type="button" variant="outline" className="h-9">
                Cancel
              </Button>
            </Link>
            <LoadingButton
              type="submit"
              className="h-9"
              disabled={!formState.isDirty || isPending}
              loading={isPending}
            >
              {!isPending && <Check className="mr-2 h-4 w-4" />}
              {templateDetails ? "Update Template" : "Save Template"}
            </LoadingButton>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Template Details</CardTitle>
                <CardDescription>
                  Enter the basic information for this template.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <FormField
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter template name" />
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
                        <FormLabel>Description</FormLabel>
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
                <CardTitle className="text-2xl">Fields & Values</CardTitle>
                <CardDescription>
                  Specify the fields for this template. Add, edit, or remove
                  fields as needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <Fragment key={field.id}>
                      <div className="grid gap-4 sm:grid-cols-12 items-center">
                        <div className="sm:col-span-5">
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
                        <div className="sm:col-span-5">
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
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select Field Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="TEXT">Text</SelectItem>
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

                        <div className="sm:col-span-2 flex justify-end">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="w-5 h-5" />
                            <span className="sr-only">Remove field</span>
                          </Button>
                        </div>

                        {watch(`fields.${index}.fieldType`) === "SELECT" && (
                          <div className="sm:col-span-10 sm:col-start-1">
                            <FormField
                              name={`fields.${index}.fieldOptions`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter options (separated by commas)"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>

                      {index < fields.length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </Fragment>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append({
                        fieldName: "",
                        fieldType: "TEXT",
                        fieldOptions: "",
                      })
                    }
                    className="mt-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add new field
                  </Button>
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
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            if (value) {
                              field.onChange(value);
                            }
                          }}
                          value={field.value}
                        >
                          <SelectTrigger id="status" aria-label="Select status">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="ARCHIVED">Archived</SelectItem>
                          </SelectContent>
                        </Select>
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
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            disabled={!formState.isDirty || isPending}
            loading={isPending}
          >
            {!isPending && <Check className="mr-2 h-4 w-4" />}
            {templateDetails ? "Update Template" : "Save Template"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
