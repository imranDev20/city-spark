"use client";

import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { CategoryType } from "./parent-category";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { CategoryFormInputType } from "../new/page";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { getParentCategories } from "../actions";

interface DataType {
  id: string;
  name: string;
  type: CategoryType;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
const categories = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

export default function CategoryDropdown({
  categoryValue,
}: {
  categoryValue: CategoryType;
}) {
  const { control } = useFormContext<CategoryFormInputType>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [openParentComboBox, setOpenParentComboBox] = useState<boolean>(false);
  useEffect(() => {
    const getCategoryByType = async () => {
      try {
        const data = await getParentCategories(categoryValue);
        setCategories(data);
        console.log(`data`, data); // Ensure categories is always an array
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Handle error by setting categories to an empty array
      }
    };

    getCategoryByType();
  }, [categoryValue]);

  return (
    <FormField
      control={control}
      name="parentCategory"
      render={({ field }) => (
        <FormItem className="w-full flex flex-col gap-1">
          <FormLabel>Parent Category</FormLabel>
          <FormControl>
            <Popover
              open={openParentComboBox}
              onOpenChange={setOpenParentComboBox}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="justify-between"
                >
                  {field.value ? (
                    categories.find((category) => category.id === field.value)
                      ?.name
                  ) : (
                    <p className="text-muted-foreground">Select a parent category</p>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0 popover-content-width-same-as-its-trigger">
                <Command>
                  <CommandInput placeholder="Search parent category..." />
                  <CommandList>
                    <CommandEmpty>No parent category found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.id}
                          value={category.id}
                          onSelect={() => {
                            field.onChange(category.id);
                            setOpenParentComboBox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === category.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {category.name}
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
  );
}
