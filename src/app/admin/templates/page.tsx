import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import TemplateList from "./_components/template-list";
import TemplateTableHeader from "./_components/template-table-header";
import TemplatesLoading from "./_components/templates-loading";
import { Status } from "@prisma/client";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Templates", href: "/admin/templates", isCurrentPage: true },
];

type SearchParams = Promise<{
  search?: string;
  page?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filter_status?: Status;
}>;

export default async function AdminTemplatesPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  return (
    <ContentLayout title="Templates">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <TemplateTableHeader />
      <Suspense fallback={<TemplatesLoading />}>
        <TemplateList searchParams={searchParams} />
      </Suspense>
    </ContentLayout>
  );
}
