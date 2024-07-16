import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useFormContext } from "react-hook-form";
import CategoryDropdown from "./category-dropdown";
import { CategoryFormInputType } from "../schema";

export type CategoryType = "PRIMARY" | "SECONDARY" | "TERTIARY" | "QUATERNARY";

export default function ParentCategory() {
  const { control, watch } = useFormContext<CategoryFormInputType>();
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
          <CategoryDropdown categoryValue={categoryValue} />
        </div>
      </CardContent>
    </Card>
  );
}
