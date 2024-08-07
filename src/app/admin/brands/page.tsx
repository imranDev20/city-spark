import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import BrandsList from "./_components/brand-list";
import BrandTableHeader from "./_components/brand-table-header";
import { BrandPagination } from "./_components/brands-pagination";

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
      <BrandTableHeader />
      <Suspense fallback="Loading">
        <BrandsList />
      </Suspense>
      <BrandPagination />
    </ContentLayout>
  );
}
