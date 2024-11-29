import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import CategoryForm from "../_components/category-form";
import { getCategoryById } from "../actions";

type PageParams = Promise<{
  category_id: string;
}>;

type SearchParams = Promise<{
  category_type?: string;
  parent_primary_id?: string;
  parent_secondary_id?: string;
}>;

export default async function AdminEditCategoryPage(props: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const categoryDetails = await getCategoryById(params.category_id);

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
