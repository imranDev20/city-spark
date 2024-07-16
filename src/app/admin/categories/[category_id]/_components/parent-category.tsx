import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import React from "react";
import { useFormContext } from "react-hook-form";
import CategoryDropdown from "./category-dropdown";
import { CategoryFormInputType } from "../../schema";

export type CategoryType = "PRIMARY" | "SECONDARY" | "TERTIARY" | "QUATERNARY";

export default function ParentCategory(props: any) {
  const { watch } = useFormContext<CategoryFormInputType>();
  const categoryValue = watch("type");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parent Category</CardTitle>
        <CardDescription>
          Select the parent category if applicable.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {/* <FormField
            control={control}
            name="parentCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="tertiary">Tertiary</SelectItem>
                    <SelectItem value="quaternary">Quaternary</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <CategoryDropdown categoryValue={categoryValue} />
        </div>
      </CardContent>
    </Card>
  );
}
