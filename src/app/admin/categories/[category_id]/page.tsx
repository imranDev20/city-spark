import { ContentLayout } from "../../_components/content-layout";
import EditCategoryForm from "./_components/category-edit-form";

export default function AdminCreateProductPage({
  params,
}: {
  params: {
    category_id: string;
  };
}) {
  const { category_id } = params;
  return (
    <>
      <EditCategoryForm />
    </>
  );
}
