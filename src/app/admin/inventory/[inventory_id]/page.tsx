import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import InventoryForm from "../_components/inventory-form";
import { getInventoryItemById } from "../actions";

export default async function InventoryDetailsPage({
  params,
}: {
  params: {
    inventory_id: string;
  };
}) {
  const { inventory_id } = params;
  const inventoryDetails = await getInventoryItemById(inventory_id);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Inventory", href: "/admin/inventory" },
    {
      label: `Edit ${inventoryDetails?.product.name}`,
      isCurrentPage: true,
    },
  ];

  return (
    <ContentLayout title="Edit Inventory">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <InventoryForm inventoryDetails={inventoryDetails} />
    </ContentLayout>
  );
}
