import React from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Templates", href: "/admin/templates", isCurrentPage: true },
];

export default function TemplatesPage() {
  return (
    <ContentLayout title="Templates">
      <DynamicBreadcrumb items={breadcrumbItems} />
    </ContentLayout>
  );
}
