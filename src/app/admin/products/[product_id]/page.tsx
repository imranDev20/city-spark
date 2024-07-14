import {
  getBrands,
  getCategories,
  getProductById,
  getTemplates,
} from "../actions";
import EditProductForm from "./_components/edit-product-form";

export default async function AdminProductDetailsPage({
  params,
}: {
  params: {
    product_id: string;
  };
}) {
  const { product_id } = params;

  const productDetails = await getProductById(product_id);
  const brands = await getBrands();
  const templates = await getTemplates();
  const categories = await getCategories();

  return (
    <>
      <EditProductForm
        productDetails={productDetails}
        brands={brands}
        templates={templates}
        categories={categories}
      />
    </>
  );
}
