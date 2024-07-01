import React from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import OrderList from "./_components/orders-list";
import { OrdersPagination } from "./_components/orders-pagination";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Orders",
    href: "/admin/orders",
    isCurrentPage: true,
  },
];
export default function AdminOrdersPage() {
  return<ContentLayout title="Orders">
  <DynamicBreadcrumb items={breadcrumbItems} />
  <OrderList />
  <OrdersPagination />
</ContentLayout>
}
