import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import CategoriesList from "./_components/categories-list";
import { CategoriesPagination } from "./_components/categories-pagination";

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
      <CategoriesList />
      <CategoriesPagination />
    </ContentLayout>
  );
}
