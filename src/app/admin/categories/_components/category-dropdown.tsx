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
import { getCategories } from "../actions";

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
] as const

export default function CategoryDropdown({
  categoryValue,
}: {
  categoryValue: CategoryType;
}) {
  const { control, setValue } = useFormContext<CategoryFormInputType>();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategoryByType = async () => {
      try {
        const data = await getCategories(categoryValue);
        setCategories(data);
        console.log(`data`, data); // Ensure categories is always an array
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Handle error by setting categories to an empty array
      }
    };

    getCategoryByType();
  }, [categoryValue]);
  console.log(`categories`, categories);
  return (
    <FormField
    control={control}
    name="parentCategory"
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel>Parent Category</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-[200px] justify-between",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value
                  ? categories.find(
                      (category) => category.id === field.value
                    )?.name
                  : "Select parent category"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search parent category..." />
              <CommandEmpty>No parent category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandList>
                  <CommandItem
                    value={category.id}
                    key={category.id}
                    onSelect={() => {
                      setValue("parentCategory", field.value)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        category.id === field.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                 </CommandList>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>       
        <FormMessage />
      </FormItem>
    )}
  />
  );
}
