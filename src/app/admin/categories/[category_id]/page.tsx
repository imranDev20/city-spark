import { CategoryType } from "@prisma/client";
import { getCategoryById, getParentCategories } from "../actions";
import EditCategoryForm from "./_components/edit-category-form";

export default async function AdminEditProductPage({
  params,
  searchParams,
}: {
  params: {
    category_id: string;
  };
  searchParams: {
    category_type: string;
  };
}) {
  const { category_id } = params;
  const { category_type } = searchParams;
  const categoryDetails = await getCategoryById(category_id as string);

  const parentCategories = await getParentCategories(
    category_type as CategoryType
  );

  return (
    <EditCategoryForm
      parentCategories={parentCategories}
      categoryDetails={categoryDetails}
    />
  );
}
