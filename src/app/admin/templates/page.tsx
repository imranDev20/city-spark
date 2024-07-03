import React from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import { TemplatePagination } from "./_components/template-pagination";
import TemplateList  from "./_components/template-list";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Templates", href: "/admin/templates", isCurrentPage: true },
];

export default function TemplatesPage() {
  return (
    <ContentLayout title="Templates">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <TemplateList />
      <TemplatePagination />
    </ContentLayout>
  );
}
