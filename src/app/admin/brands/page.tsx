import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import BrandList from "./_components/brand-list";
import BrandTableHeader from "./_components/brand-table-header";
import BrandsLoading from "./_components/brands-loadint";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Brands",
    href: "/admin/brands",
    isCurrentPage: true,
  },
];

export default async function AdminBrandsPage() {
  return (
    <ContentLayout title="Brands">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <BrandTableHeader />
      <Suspense fallback={<BrandsLoading />}>
        <BrandList />
      </Suspense>
    </ContentLayout>
  );
}
