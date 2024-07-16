import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import TemplateList from "./_components/template-list";
import { TemplatePagination } from "./_components/template-pagination";
import TemplateTableHeader from "./_components/template-table-header";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Templates", href: "/admin/templates", isCurrentPage: true },
];

export default function TemplatesPage() {
  return (
    <ContentLayout title="Templates">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <TemplateTableHeader />
      <Suspense fallback="Loading">
        <TemplateList />
      </Suspense>
      <TemplatePagination />
    </ContentLayout>
  );
}
