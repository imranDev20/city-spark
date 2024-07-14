import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import CategoriesList from "./_components/categories-list";
import { CategoriesPagination } from "./_components/categories-pagination";
import CategoryTableHeader from "./_components/category-table-header";
const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Categories",
    href: "/admin/categories",
    isCurrentPage: true,
  },
];
export default function AdminCreateProductPage() {
  return (
    <ContentLayout title="Brands">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <CategoryTableHeader />
      <Suspense fallback="Loading...">
      <CategoriesList />
      </Suspense>
      <CategoriesPagination />
    </ContentLayout>
  );
}
