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
  const categoryDetails = await getCategoryById(category_id as string);

  const parentPrimaryCategories = await getParentCategories("PRIMARY");
  const parentSecondaryCategories = await getParentCategories("SECONDARY");
  const parentTertiaryCategories = await getParentCategories("TERTIARY");

  return (
    <EditCategoryForm
      parentPrimaryCategories={parentPrimaryCategories}
      parentSecondaryCategories={parentSecondaryCategories}
      parentTertiaryCategories={parentTertiaryCategories}
      categoryDetails={categoryDetails}
    />
  );
}
