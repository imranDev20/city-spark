import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Dashboard", href: "/admin" },
  {
    label: "New Inventory",
    href: "/admin/inventory/new",
    isCurrentPage: true,
  },
];

export default function InventoryDetailsPage() {
  return (
    <ContentLayout title="Inventory Detail">
      <DynamicBreadcrumb items={breadcrumbItems} />
    </ContentLayout>
  );
}
