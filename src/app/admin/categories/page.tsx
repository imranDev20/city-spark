import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import CategoryList from "./_components/category-list";
import CategoryTableHeader from "./_components/category-table-header";
import { CategoryType } from "@prisma/client";
import CategoriesLoading from "./_components/categories-loading";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Categories",
    href: "/admin/categories",
    isCurrentPage: true,
  },
];

export default function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    page?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    filter_type?: CategoryType;
  };
}) {
  return (
    <ContentLayout title="Categories">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <CategoryTableHeader />
      <Suspense fallback={<CategoriesLoading />}>
        <CategoryList searchParams={searchParams} />
      </Suspense>
    </ContentLayout>
  );
}
