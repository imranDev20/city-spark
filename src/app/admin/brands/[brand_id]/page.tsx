import React from "react";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Brands",
    href: "/admin/brands",
    isCurrentPage: true,
  },
];

export default function AdminBrandDetailsPage() {
  return (
    <ContentLayout title="Create Brand">
      <DynamicBreadcrumb items={breadcrumbItems} />
    </ContentLayout>
  );
}
