import { CategoryType } from "@prisma/client";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import { getParentCategories } from "../actions";
import CreateCategoryForm from "./_components/create-category-form";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Category", href: "/admin/categories" },
  {
    label: "Add New Category",
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
  const parentPrimaryCategories = await getParentCategories("PRIMARY");
  const parentSecondaryCategories = await getParentCategories("SECONDARY");
  const parentTertiaryCategories = await getParentCategories("TERTIARY");

  return (
    <ContentLayout title="Create Category">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <CreateCategoryForm
        parentPrimaryCategories={parentPrimaryCategories}
        parentSecondaryCategories={parentSecondaryCategories}
        parentTertiaryCategories={parentTertiaryCategories}
      />
    </ContentLayout>
  );
}
