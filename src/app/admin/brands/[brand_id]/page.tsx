import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import BrandForm from "../_components/brand-form";
import { getBrandById } from "../actions";

type PageParams = Promise<{
  brand_id: string;
}>;

export default async function AdminBrandDetailsPage(props: {
  params: PageParams;
}) {
  const params = await props.params;
  const brandDetails = await getBrandById(params.brand_id);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Brands", href: "/admin/brands" },
    {
      label: `Edit ${brandDetails?.name}`,
      href: `/admin/brands/${params.brand_id}`,
      isCurrentPage: true,
    },
  ];

  return (
    <ContentLayout title={`Edit ${brandDetails?.name}`}>
      <DynamicBreadcrumb items={breadcrumbItems} />
      <BrandForm brandDetails={brandDetails} />
    </ContentLayout>
  );
}
