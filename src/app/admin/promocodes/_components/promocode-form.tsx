"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Calendar, Check, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Status } from "@prisma/client";
import { PromoCodeFormValues, promoCodeSchema } from "../schema";
import PromoFormHeader from "./promocode-form-header";

export default function PromoCodeForm() {
  const form = useForm<PromoCodeFormValues>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      minOrderValue: "",
      maxDiscount: "",
      startDate: new Date(),
      endDate: new Date(),
      usageLimit: "",
    },
  });

  const { handleSubmit, control, watch } = form;

  function onSubmit(values: PromoCodeFormValues) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <PromoFormHeader isPending={false} />

        {/* Main Content */}
        <div className="container pt-8 pb-4 px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Left Side - 2 columns */}
            <div className="md:col-span-2 space-y-8">
              {/* Basic Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Details</CardTitle>
                  <CardDescription>
                    Enter the basic information for this promo code.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Promo Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="SUMMER2024"
                              {...field}
                              className="uppercase"
                            />
                          </FormControl>
                          <FormDescription>
                            Enter a unique code for this promotion
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter a description for this promo code"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide details about the promotion (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Discount Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Discount Settings</CardTitle>
                  <CardDescription>
                    Configure how the discount will be applied.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PERCENTAGE">
                                Percentage
                              </SelectItem>
                              <SelectItem value="FIXED">
                                Fixed Amount
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose how the discount will be applied
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={control}
                        name="discountValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Value</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder={
                                  watch("discountType") === "PERCENTAGE"
                                    ? "10"
                                    : "50"
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              {watch("discountType") === "PERCENTAGE"
                                ? "Enter percentage (e.g., 10 for 10%)"
                                : "Enter amount in £"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="maxDiscount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Discount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="50"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Optional: Maximum discount amount
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={control}
                      name="minOrderValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Order Value</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="100" {...field} />
                          </FormControl>
                          <FormDescription>
                            Optional: Minimum cart value required
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Validity Period Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Validity Period</CardTitle>
                  <CardDescription>
                    Set when this promo code can be used.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              {/* <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              /> */}
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            When the promotion begins
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              {/* <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < watch("startDate")}
                                initialFocus
                              /> */}
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            When the promotion ends
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - 1 column */}
            <div className="space-y-8">
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="ARCHIVED">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Set the current status of this promo code
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Usage Limits Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage Limits</CardTitle>
                  <CardDescription>
                    Control how this code can be used.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={control}
                    name="usageLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usage Limit</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="100" {...field} />
                        </FormControl>
                        <FormDescription>
                          Maximum number of times this code can be used
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
