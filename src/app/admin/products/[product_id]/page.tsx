import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import ProductForm from "../_components/product-form";
import { getProductById } from "../actions";

type PageParams = Promise<{
  product_id: string;
}>;

export default async function AdminProductDetailsPage(props: {
  params: PageParams;
}) {
  const params = await props.params;
  const productDetails = await getProductById(params.product_id);

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
    <ContentLayout title="Add New Product">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductForm productDetails={productDetails} />
    </ContentLayout>
  );
}
