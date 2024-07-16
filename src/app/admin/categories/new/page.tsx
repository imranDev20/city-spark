import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import CreateCategoryForm from "./_components/create-category-form";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Category", href: "/admin/categories" },
  {
    label: "Create Category",
    href: "/admin/categories/new",
    isCurrentPage: true,
  },
];

export default function CreateCategoryPage() {
  return (
    <ContentLayout title="Create Category">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <CreateCategoryForm />
    </ContentLayout>
  );
}
