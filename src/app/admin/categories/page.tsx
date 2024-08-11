import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import CategoryList from "./_components/category-list";
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

export default function AdminCategoriesPage() {
  return (
    <ContentLayout title="Categories">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <CategoryTableHeader />
      <Suspense fallback="Loading...">
        <CategoryList />
      </Suspense>
      <CategoriesPagination />
    </ContentLayout>
  );
}
