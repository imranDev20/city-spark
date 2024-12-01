"use client";

import { useState, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";

// UI Components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Utils and Types
import { cn } from "@/lib/utils";
import { fetchTemplates, fetchTemplateDetails } from "@/lib/api-client";
import { ProductFormInputType } from "../schema";
import { FieldType } from "@prisma/client";
import { Prisma } from "@prisma/client";

interface Template {
  id: string;
  name: string;
}

interface TemplateField {
  id: string;
  fieldName: string;
  fieldType: FieldType;
  fieldOptions: string | null;
}

interface TemplateDetails {
  fields: TemplateField[];
}

type ProductWithTemplate = Prisma.ProductGetPayload<{
  include: {
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

interface TemplatesSectionProps {
  productDetails?: ProductWithTemplate | null;
}

export default function TemplatesSection({
  productDetails,
}: TemplatesSectionProps) {
  const [openTemplates, setOpenTemplates] = useState(false);
  const { control, reset, getValues } = useFormContext<ProductFormInputType>();
  const templateId = useWatch({ control, name: "templateId" });

  const { data: templates, isPending: isTemplatesPending } = useQuery<
    Template[]
  >({
    queryKey: ["templates"],
    queryFn: () => fetchTemplates(),
  });

  const { data: templateDetails, isLoading: isTemplateDetailsLoading } =
    useQuery<TemplateDetails>({
      queryKey: ["templateDetails", templateId],
      queryFn: () => fetchTemplateDetails(templateId),
      enabled: !!templateId,
    });

  useEffect(() => {
    if (templateDetails) {
      if (
        productDetails &&
        productDetails.productTemplate?.templateId === templateId
      ) {
        reset({
          ...getValues(),
          productTemplateFields: productDetails.productTemplate?.fields.map(
            (field) => ({
              id: field.id,
              fieldId: field.templateFieldId,
              fieldName: field.templateField.fieldName,
              fieldOptions: field.templateField.fieldOptions ?? "",
              fieldType: field.templateField.fieldType ?? "TEXT",
              fieldValue: field.fieldValue ?? "",
            })
          ),
        });
      } else {
        reset({
          ...getValues(),
          productTemplateFields: templateDetails.fields.map((field) => ({
            id: field.id,
            fieldId: field.id,
            fieldName: field.fieldName,
            fieldOptions: field.fieldOptions ?? "",
            fieldType: field.fieldType,
          })),
        });
      }
    }
  }, [reset, getValues, templateDetails, productDetails, templateId]);

  const templateFields = templateDetails?.fields || [];

  return (
    <Card>
      {/* Template Selection Section */}
      <CardHeader>
        <CardTitle>Templates</CardTitle>
        <CardDescription>
          Please provide the physical specifications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-6">
          <div className="col-span-4 grid gap-3">
            <FormField
              control={control}
              name="templateId"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col gap-1">
                  <FormLabel>Templates</FormLabel>
                  <FormControl>
                    <Popover
                      open={openTemplates}
                      onOpenChange={setOpenTemplates}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="justify-between"
                          disabled={isTemplatesPending}
                        >
                          {field.value ? (
                            templates?.find(
                              (template) => template.id === field.value
                            )?.name
                          ) : (
                            <p className="text-muted-foreground">
                              Select a template
                            </p>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
                        <Command>
                          <CommandInput placeholder="Search templates..." />
                          <CommandList>
                            <CommandEmpty>No template found.</CommandEmpty>
                            <CommandGroup>
                              {templates?.map((template) => (
                                <CommandItem
                                  key={template.id}
                                  value={template.name}
                                  onSelect={() => {
                                    field.onChange(template.id);
                                    setOpenTemplates(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === template.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {template.name}
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
          </div>
        </div>
      </CardContent>

      {/* Template Fields Section */}
      <CardHeader>
        <CardTitle>Template Fields</CardTitle>
        <CardDescription>
          {templateFields.length > 0
            ? "Please provide the physical specifications."
            : "No related field found"}
        </CardDescription>
      </CardHeader>

      {isTemplateDetailsLoading && (
        <CardContent>
          <Spinner />
        </CardContent>
      )}

      {templateFields.length > 0 && (
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-9">
            {templateFields.map((templateField, index) => (
              <div className="col-span-3 grid gap-3" key={templateField.id}>
                <FormField
                  control={control}
                  name={`productTemplateFields.${index}.fieldValue`}
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col gap-1">
                      <FormLabel>{templateField.fieldName}</FormLabel>
                      <FormControl>
                        {templateField.fieldType === "TEXT" ? (
                          <Input
                            placeholder={`Enter ${templateField.fieldName}`}
                            {...field}
                          />
                        ) : (
                          <Select
                            onValueChange={(currentValue) => {
                              if (currentValue) {
                                field.onChange(currentValue);
                              }
                            }}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={`Enter ${templateField.fieldName}`}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {templateField.fieldOptions
                                ?.split(",")
                                .map((option) => (
                                  <SelectItem
                                    value={option.trim()}
                                    key={option}
                                  >
                                    {option.trim()}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
