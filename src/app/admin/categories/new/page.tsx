import { CategoryType } from "@prisma/client";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import { getParentCategories } from "../actions";
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

export default async function CreateCategoryPage({
  searchParams,
}: {
  searchParams: {
    category_type: string;
  };
}) {
  const { category_type } = searchParams;
  const parentCategories = await getParentCategories(
    category_type as CategoryType
  );

  return (
    <ContentLayout title="Create Category">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <CreateCategoryForm parentCategories={parentCategories} />
    </ContentLayout>
  );
}
