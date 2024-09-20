import React from "react";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import ProductForm from "../_components/product-form";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  {
    label: "Add New Product",
    href: "/admin/products/new",
    isCurrentPage: true,
  },
];

export default async function AdminCreateProductPage() {
  return (
    <ContentLayout title="Add New Product">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductForm />
    </ContentLayout>
  );
}
