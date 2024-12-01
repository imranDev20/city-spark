"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductFormInputType } from "../schema";

export default function PriceSection() {
  const { control } = useFormContext<ProductFormInputType>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price</CardTitle>
        <CardDescription>Please provide the pricing details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="grid gap-3">
            <FormField
              control={control}
              name="tradePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trade Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter trade price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={control}
              name="contractPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contract price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={control}
              name="promotionalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotional Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter promotional price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
