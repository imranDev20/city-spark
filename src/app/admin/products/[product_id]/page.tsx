import {
  getBrands,
  getCategories,
  getProductById,
  getTemplateById,
  getTemplates,
} from "../actions";
import EditProductForm from "./_components/edit-product-form";

export default async function AdminProductDetailsPage({
  params,
  searchParams,
}: {
  params: {
    product_id: string;
  };
  searchParams: {
    template_id: string;
  };
}) {
  const { product_id } = params;
  const { template_id } = searchParams;

  const productDetails = await getProductById(product_id);
  const brands = await getBrands();
  const templates = await getTemplates();
  const categories = await getCategories();
  const templateDetails = await getTemplateById(
    (template_id || productDetails.templateId) as string
  );

  return (
    <>
      <EditProductForm
        productDetails={productDetails}
        brands={brands}
        templates={templates}
        categories={categories}
        templateDetails={templateDetails}
      />
    </>
  );
}
