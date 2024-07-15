import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { useFormContext } from "react-hook-form";
import { CategoryFormInputType } from "../new/page";
import CategoryDropdown from "./category-dropdown";

export type CategoryType = "PRIMARY"|"SECONDARY" | "TERTIARY" | "QUATERNARY";

export default  function ParentCategory(props: any) {
  const { control,  watch } = useFormContext<CategoryFormInputType>();
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
         <CategoryDropdown categoryValue = {categoryValue} />
        </div>
      </CardContent>
    </Card>
  );
}
