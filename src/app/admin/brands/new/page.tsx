import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import BrandForm from "../_components/brand-form";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Brands", href: "/admin/brands" },
  {
    label: "Add New Brand",
    href: "/admin/brands/new",
    isCurrentPage: true,
  },
];

export default async function CreateBrandPage() {
  return (
    <ContentLayout title="Create Brand">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <BrandForm />
    </ContentLayout>
  );
}
