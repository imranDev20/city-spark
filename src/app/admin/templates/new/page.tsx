"use client";
import React from "react";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Templates", href: "/admin/templates" },
  {
    label: "Create Template",
    href: "/admin/templates/new",
    isCurrentPage: true,
  },
];

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),

  password: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
});

export default function CreateTemplatePage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <ContentLayout title="Create Template">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DynamicBreadcrumb items={breadcrumbItems} />

          <div className="flex items-center gap-4 mb-5 mt-7">
            <Link href="/admin/templates">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>

            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Pro Controller Template
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              Active
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">Save Template</Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Template Details</CardTitle>
                  <CardDescription>
                    Please provide the template name and description.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        defaultValue="Gamer Gear Pro Controller"
                        placeholder="Enter template name"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                        className="min-h-32"
                        placeholder="Enter the purpose of this template"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Fields & Values</CardTitle>
                  <CardDescription>
                    Please provide the necessary fields and their corresponding
                    values.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-9">
                      <div className="grid gap-3 col-span-4">
                        <Input placeholder="Enter Field Name" />
                      </div>
                      <div className="grid gap-3 col-span-4">
                        <Select>
                          <SelectTrigger id="status" aria-label="Field Type">
                            <SelectValue placeholder="Select Field Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3 col-span-8">
                        <Input placeholder="Enter Value" />
                      </div>
                      <div className="col-span-1 flex justify-end items-center">
                        <Button variant="ghost">
                          <Trash className="w-4 h-4 text-primary" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-3 sm:grid-cols-9">
                      <div className="grid gap-3 col-span-4">
                        <Input placeholder="Enter Field Name" />
                      </div>
                      <div className="grid gap-3 col-span-4">
                        <Select>
                          <SelectTrigger id="status" aria-label="Field Type">
                            <SelectValue placeholder="Select Field Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3 col-span-8">
                        <Input placeholder="Enter Value" />
                      </div>
                      <div className="col-span-1 flex justify-end items-center">
                        <Button variant="ghost">
                          <Trash className="w-4 h-4 text-primary" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Button>Add new</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
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
                          <SelectValue placeholder="Select Status" />
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
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button size="sm">Save Template</Button>
          </div>
        </form>
      </Form>
    </ContentLayout>
  );
}
