import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import InventoryList from "./_components/inventory-list";
import { InventoryPagination } from "./_components/inventory-pagination";
import InventoryTableHeader from "./_components/inventory-table-header";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Inventory", href: "/admin/inventory", isCurrentPage: true },
];

export default function InventoryPage() {
  return (
    <ContentLayout title="Inventory">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <InventoryTableHeader />
      <Suspense fallback="Loading...">
      <InventoryList />
      </Suspense>
      <InventoryPagination />
    </ContentLayout>
  );
}
