import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import ProductTableHeader from "./_components/product-table-header";
import ProductsLoading from "./_components/products-loading";
import { Status } from "@prisma/client";
import DesktopProductList from "./_components/desktop-product-list";
import MobileProductList from "./_components/mobile-product-list";

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
        <DesktopProductList />
        <MobileProductList />
      </Suspense>
    </ContentLayout>
  );
}
