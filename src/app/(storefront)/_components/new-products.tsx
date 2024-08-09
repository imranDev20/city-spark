import { getInventorItems } from "@/app/admin/inventory/actions";
import NewProductsCard from "./new-products-card";

export default async function NewProducts() {
  const items = await getInventorItems();
  console.log(items);
  return (
    <div>
      <NewProductsCard items={items} />
    </div>
  );
}
