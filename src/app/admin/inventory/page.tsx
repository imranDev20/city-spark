import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import InventoryList from "./_components/inventory-list";
import InventoryTableHeader from "./_components/inventory-table-header";
import { getAllInventory } from "./actions";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Inventory", href: "/admin/inventory", isCurrentPage: true },
];

export default async function InventoryPage() {
  const inventories = await getAllInventory();

  return (
    <ContentLayout title="Inventory">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <InventoryTableHeader />
      <Suspense fallback="Loading...">
      <InventoryList inventories={inventories} />
      </Suspense>
     
    </ContentLayout>
  );
}
