import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import BrandList from "./_components/brand-list";
import BrandTableHeader from "./_components/brand-table-header";
import { Status } from "@prisma/client";
import BrandsLoading from "./_components/brands-loadint";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Brands",
    href: "/admin/brands",
    isCurrentPage: true,
  },
];

type SearchParams = Promise<{
  search?: string;
  page?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filter_status?: Status;
}>;

export default async function AdminBrandsPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  return (
    <ContentLayout title="Brands">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <BrandTableHeader />
      <Suspense fallback={<BrandsLoading />}>
        <BrandList searchParams={searchParams} />
      </Suspense>
    </ContentLayout>
  );
}
