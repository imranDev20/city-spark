import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import PromoCodeForm from "../_components/promocode-form";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Promo Codes", href: "/admin/promocodes" },
  {
    label: "Add New Promo Code",
    href: "/admin/promocodes/new",
    isCurrentPage: true,
  },
];

export default function CreatePromocodePage() {
  return (
    <ContentLayout title="Create Promo Code" isContainer={false}>
      <div className="container pt-8 pb-4 px-4 sm:px-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
      </div>
      <PromoCodeForm />
    </ContentLayout>
  );
}
