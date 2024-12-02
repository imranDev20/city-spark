import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import InventoryList from "./_components/inventory-list";
import InventoryTableHeader from "./_components/inventory-table-header";
import { getInventoryItems } from "./actions";
import InventoryLoading from "./_components/inventory-loading";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Inventory", href: "/admin/inventory", isCurrentPage: true },
];
type SearchParams = Promise<{
  search?: string;
  page?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filter_status?: string;
}>;

export default async function InventoryPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  const { inventories, pagination } = await getInventoryItems({
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    page_size: 10,
    sortBy: searchParams.sort_by as
      | "name"
      | "stockCount"
      | "soldCount"
      | "heldCount"
      | "createdAt"
      | undefined,
    sortOrder: searchParams.sort_order,
    filterStatus: searchParams.filter_status,
    searchTerm: searchParams.search,
  });

  return (
    <ContentLayout title="Inventory">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <InventoryTableHeader />
      <Suspense fallback={<InventoryLoading />}>
        <InventoryList inventories={inventories} pagination={pagination} />
      </Suspense>
    </ContentLayout>
  );
}
