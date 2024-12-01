"use client";

import * as React from "react";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import ProductForm from "../_components/product-form";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

type PageParams = Promise<{
  product_id: string;
}>;

export default function AdminProductDetailsPage(props: { params: PageParams }) {
  const { product_id } = React.use(props.params);

  const {
    data: productDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", product_id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${product_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      const data = await response.json();
      return data.data;
    },
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Products", href: "/admin/products" },
    {
      label: isLoading
        ? "Loading..."
        : `Edit ${productDetails?.name || "Product"}`,
      href: `/admin/products/${product_id}`,
      isCurrentPage: true,
    },
  ];

  if (isLoading) {
    return (
      <ContentLayout title="Edit Product">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (isError) {
    return (
      <ContentLayout title="Edit Product">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load product details"}
          </AlertDescription>
        </Alert>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Edit Product">
      <DynamicBreadcrumb items={breadcrumbItems} />
      {productDetails && <ProductForm productDetails={productDetails} />}
    </ContentLayout>
  );
}
