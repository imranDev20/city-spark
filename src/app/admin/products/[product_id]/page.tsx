import { getProductById } from "../actions";
import EditProductForm from "./_components/edit-product-form";

export default async function AdminProductDetailsPage({
  params,
}: {
  params: {
    product_id: string;
  };
}) {
  const { product_id } = params;

  return (
    <>
      <EditProductForm />
    </>
  );
}
