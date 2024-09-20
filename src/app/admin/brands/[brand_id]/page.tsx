import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import BrandForm from "../_components/brand-form";
import { getBrandById } from "../actions";

export default async function AdminBrandDetailsPage({
  params,
}: {
  params: { brand_id: string };
}) {
  const { brand_id } = params;
  const brandDetails = await getBrandById(brand_id);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Brands", href: "/admin/brands" },
    {
      label: `Edit ${brandDetails?.name}`,
      href: `/admin/brands/${brand_id}`,
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
