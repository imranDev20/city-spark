import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Inventory", href: "/admin/inventory", isCurrentPage: true },
];

export default function InventoryPage() {
  return (
    <ContentLayout title="Inventory">
      <DynamicBreadcrumb items={breadcrumbItems} />
    </ContentLayout>
  );
}