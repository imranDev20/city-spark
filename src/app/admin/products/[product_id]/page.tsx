import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import ProductForm from "../_components/product-form";
import { getProductById } from "../actions";

export default async function AdminProductDetailsPage({
  params,
}: {
  params: {
    product_id: string;
  };
}) {
  const { product_id } = params;
  const productDetails = await getProductById(product_id);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Products", href: "/admin/products" },
    {
      label: `Edit ${productDetails.name}`,
      href: `/admin/products/${productDetails.id}`,
      isCurrentPage: true,
    },
  ];

  return (
    <>
      <ContentLayout title="Add New Product">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <ProductForm productDetails={productDetails} />
      </ContentLayout>
    </>
  );
}
