"use client";
import Link from "next/link";
import { ChevronLeft, Icon, Trash, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContentLayout } from "../../_components/content-layout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import OrderDetailsList from "../_components/orders-details";
import PaidByCustomerList from "../_components/paid-customer";
import { TimelineLayout } from "../../_components/timeline-layout";
import { timelineData } from "@/app/data";
import { LucideEdit } from "lucide-react";
import { useState } from "react";
import { orderDetailsSchema } from "./schema";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Orders Details", href: "/admin/orders/id", isCurrentPage: true },
];
const defaultValues = {
  name: "Mick Jeson Holder",
  email: "XNqQ4@example.com",
  shippingAddress: "1600 Amphiteatre Parkway, CA, USA 94043",
  billingAddress: "same as shipping address",
  payment: "Cash on Delivery",
};
export default function AdminOrderDetailsPage() {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  type FormInputType = z.infer<typeof orderDetailsSchema>;
  const form = useForm<FormInputType>({
    resolver: zodResolver(orderDetailsSchema),
    defaultValues,
  });

  const { control, handleSubmit } = form;
  const onUserInformantionSubmit: SubmitHandler<FormInputType> = async (
    data
  ) => {
    console.log(data);
  };
  return (
    <ContentLayout title="Orders Details">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <div className="flex items-center gap-4 mb-5 mt-7">
        <Link href="/admin/orders">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <span> 09-10-2022 09:22 PM 20-10-22 10:42 PM </span> <br />
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            SPRITE-100063
          </h1>
        </div>

        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button size="sm" type="button" variant="outline">
            Download Invoice
          </Button>
          <Button
            size="sm"
            type="button"
            onClick={() => setIsEdit(false)}
            variant="outline"
          >
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <OrderDetailsList />
          <PaidByCustomerList />
          <TimelineLayout items={timelineData} />
        </div>

        <div className="grid auto-rows-max items-start gap-4  lg:mt-14 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-3">
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger id="status" aria-label="Select status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <h2 style={{ marginBottom: "-20px" }} className="text-xl font-bold">
            Customer Information
          </h2>
          {!isEdit && (
            <Card x-chunk="dashboard-07-chunk-3 mt-0">
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <div>
                      <span className="flex justify-between items-center">
                        <span>Name</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent outline-none border-none p-0"
                          onClick={() => setIsEdit(true)}
                        >
                          <LucideEdit
                            size={16} // Adjust the size as needed, e.g., 12, 14, 16, etc.
                            className="text-gray-500" // Adjust color as needed
                          />
                        </Button>
                      </span>
                      <p className="font-semibold">Mick Jeson Holder</p>
                    </div>
                    <div>
                      <p>Email</p>
                      <p className="font-semibold">XNqQ4@example.com</p>
                    </div>
                    <div>
                      <p>Shipping Address</p>
                      <p className="font-semibold">
                        {" "}
                        1600 Amphiteatre Parkway, CA, USA 94043{" "}
                      </p>
                    </div>
                    <div>
                      <p>Billing Address</p>
                      <p className="font-semibold">same as shipping address </p>
                    </div>
                    <div>
                      <p>Payment</p>
                      <p className="font-semibold">Cash on Delivery </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {isEdit && (
            <Form {...form}>
              <form onSubmit={handleSubmit(onUserInformantionSubmit)}>
                <Card x-chunk="dashboard-07-chunk-3 mt-0">
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <div>
                          <FormField
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                   
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            name="shippingAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Shipping Address</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                  
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            name="billingAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Billing Address</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                  
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            name="payment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Payment</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                   
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
