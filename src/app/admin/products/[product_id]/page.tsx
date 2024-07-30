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
    primary_category_id: string;
    secondary_category_id: string;
    tertiary_category_id: string;
  };
}) {
  const { product_id } = params;
  const {
    template_id,
    primary_category_id,
    secondary_category_id,
    tertiary_category_id,
  } = searchParams;

  const productDetails = await getProductById(product_id);
  const brands = await getBrands();
  const templates = await getTemplates();

  console.log(templates);

  const primaryCategories = await getCategories("PRIMARY");

  const secondaryCategories = await getCategories(
    "SECONDARY",
    productDetails.primaryCategoryId || primary_category_id
  );

  const tertiaryCategories = await getCategories(
    "TERTIARY",
    productDetails.secondaryCategoryId || secondary_category_id
  );

  const quaternaryCategories = await getCategories(
    "QUATERNARY",
    productDetails.tertiaryCategoryId || tertiary_category_id
  );

  const templateDetails = await getTemplateById(
    (template_id || productDetails.templateId) as string
  );

  return (
    <>
      <EditProductForm
        productDetails={productDetails}
        brands={brands}
        templates={templates}
        primaryCategories={primaryCategories || []}
        secondaryCategories={secondaryCategories || []}
        tertiaryCategories={tertiaryCategories || []}
        quaternaryCategories={quaternaryCategories || []}
        templateDetails={templateDetails}
      />
    </>
  );
}
