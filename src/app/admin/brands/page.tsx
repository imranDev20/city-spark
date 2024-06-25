import React from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Brands",
    href: "/admin/brands",
    isCurrentPage: true,
  },
];

export default function AdminBrandsPage() {
  return (
    <ContentLayout title="Brands">
      <DynamicBreadcrumb items={breadcrumbItems} />
    </ContentLayout>
  );
}
