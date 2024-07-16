"use client";

import React, { useState } from "react";
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
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { CategoryFormInputType } from "../schema";

interface DataType {
  id: string;
  name: string;
  type: CategoryType;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function CategoryDropdown({
  categoryValue,
}: {
  categoryValue: CategoryType;
}) {
  const { control } = useFormContext<CategoryFormInputType>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [openParentComboBox, setOpenParentComboBox] = useState<boolean>(false);

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
                    <p className="text-muted-foreground">
                      Select a parent category
                    </p>
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
