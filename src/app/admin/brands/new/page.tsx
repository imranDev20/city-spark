"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import ImageUploader from "../_components/image-uploader";
import { createBrand } from "../actions";
import { brandSchema } from "./schema";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Brands", href: "/admin/brands" },
  { label: "Create Brand", href: "/admin/brands/new", isCurrentPage: true },
];

const defaultValues = {
  name: "",
  description: "",
  brandName: "",
  website: "",

  status: "",
};
export type FormInputType = z.infer<typeof brandSchema>;
export default function CreateBrandPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormInputType>({
    resolver: zodResolver(brandSchema),
  });
  const { control, handleSubmit } = form;
  const onCreateBrandSubmit: SubmitHandler<FormInputType> = async (data) => {
    console.log(data);
    const { brandName, website, images, status } = data;
    const payload = {
      brandName,
      website,
      images,
      status,
    };
    console.log(`payload`, payload);
    startTransition(async () => {
      const result = await createBrand(data);
      if (result.success) {
        // Handle successful deletion (e.g., show a success message, update UI)
        console.log(result.message);
        toast({
          title: "Brand Saved",
          description: result.message,
          variant: "success",
        });

        router.push("/admin/brands");
      } else {
        toast({
          title: "Brand Saved failed",
          description: result.message,
          variant: "destructive",
        });
        console.error(result.message);
      }
    });
  };
  return (
    <ContentLayout title="Create Brands">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Form {...form}>
        <form onSubmit={handleSubmit(onCreateBrandSubmit)}>
          <div className="flex items-center gap-4 mb-5 mt-7">
            <Link href="/admin/brands">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Pro Controller Brand
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              Active
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <LoadingButton
                type="submit"
                disabled={isPending}
                size="sm"
                loading={isPending}
                className="text-xs font-semibold h-8"
              >
                Save Brand
              </LoadingButton>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Details</CardTitle>
                  <CardDescription>
                    Please provide the brand details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="brandName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter brand name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3 mt-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              id="description"
                              className="min-h-32"
                              placeholder="Enter brand description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Brand Links</CardTitle>
                  <CardDescription>
                    Please provide the brand links.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter website URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                      <FormField
                        control={form.control}
                        name="status"
                        render={
                          ({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={(currentValue) => {
                                    if (currentValue !== "") {
                                      field.onChange(currentValue);
                                    }
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="ACTIVE">
                                      Active
                                    </SelectItem>
                                    <SelectItem value="ARCHIVED">
                                      Archived
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            );
                          }
                          //   (
                          //   <FormItem>
                          //     <FormLabel>Status</FormLabel>
                          //     <Select
                          //       onValueChange={field.onChange}
                          //       defaultValue={field.value}
                          //     >
                          //       <FormControl>
                          //         <SelectTrigger>
                          //           <SelectValue placeholder="Select status" />
                          //         </SelectTrigger>
                          //       </FormControl>
                          //       <SelectContent>
                          //         <SelectItem value="draft">Draft</SelectItem>
                          //         <SelectItem value="active">Active</SelectItem>
                          //         <SelectItem value="archived">
                          //           Archived
                          //         </SelectItem>
                          //       </SelectContent>
                          //     </Select>
                          //   </FormItem>
                          // )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-5">
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>
                    Upload your brand images here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem className="mx-auto ">
                        <FormLabel>
                          <h2 className="text-xl font-semibold tracking-tight"></h2>
                        </FormLabel>
                        <FormControl>
                          <ImageUploader {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </ContentLayout>
  );
}
