import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import ProductList from "./_components/product-list";
import ProductTableHeader from "./_components/product-table-header";
import ProductsLoading from "./_components/products-loading";
import { Status } from "@prisma/client";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products", isCurrentPage: true },
];

export default function AdminProductsPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    page?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    filter_status?: Status;
  };
}) {
  return (
    <ContentLayout title="Products">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductTableHeader />
      <Suspense fallback={<ProductsLoading />}>
        <ProductList searchParams={searchParams} />
      </Suspense>
    </ContentLayout>
  );
}
