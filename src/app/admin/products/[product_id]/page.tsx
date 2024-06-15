import { ContentLayout } from "../../_components/content-layout";

export default function AdminProductDetailsPage({
  params,
}: {
  params: {
    product_id: string;
  };
}) {
  const { product_id } = params;

  return <ContentLayout title={product_id}>Product details</ContentLayout>;
}
