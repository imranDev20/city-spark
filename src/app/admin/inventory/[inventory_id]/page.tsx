import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import { getProducts } from "../../products/actions";
import EditInventoryForm from "../_components/edit-inventory-form";
import { getInventoryItemById } from "../actions";

export default async function InventoryDetailsPage({
  params,
  searchParams,
}: {
  params: {
    inventory_id: string;
  };
  searchParams: {
    product_id: string;
  };
}) {
  const { inventory_id } = params;
  const inventoryDetails = await getInventoryItemById(inventory_id);
  const products = await getProducts();

  return (
    <EditInventoryForm
      inventoryDetails={inventoryDetails}
      products={products}
    />
  );
}
