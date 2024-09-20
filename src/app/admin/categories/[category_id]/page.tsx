import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import CategoryForm from "../_components/category-form";
import { getCategoryById } from "../actions";

export default async function AdminEditCategoryPage({
  params,
}: {
  params: {
    category_id: string;
  };
  searchParams: {
    category_type?: string;
    parent_primary_id?: string;
    parent_secondary_id?: string;
  };
}) {
  const { category_id } = params;
  const categoryDetails = await getCategoryById(category_id as string);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Categories", href: "/admin/categories" },
    {
      label: "Add New Category",
      href: `/admin/categories/${categoryDetails?.name}`,
      isCurrentPage: true,
    },
  ];

  return (
    <ContentLayout title={`Edit ${categoryDetails?.name}`}>
      <DynamicBreadcrumb items={breadcrumbItems} />
      <CategoryForm categoryDetails={categoryDetails} />
    </ContentLayout>
  );
}
