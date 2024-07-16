import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import { getProducts } from "../../products/actions";
import CreateInventoryForm from "../_components/create-inventory-form";


const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Inventory", href: "/admin/inventory" },
  {
    label: "Add Inventory Item",
    href: "/admin/inventory/new",
    isCurrentPage: true,
  },
];


export default async function CreateInventoryPage() {
  const products  = await getProducts();
  return (
    <ContentLayout title="Add Inventory Item">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <CreateInventoryForm  products={products}/>
    </ContentLayout>
  );
}
