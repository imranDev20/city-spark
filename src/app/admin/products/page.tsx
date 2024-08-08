import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import { ProductPagination } from "./_components/product-pagination";
import ProductList from "./_components/product-list";
import ProductTableHeader from "./_components/product-table-header";
import ProductsLoading from "./_components/products-loading";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products", isCurrentPage: true },
];

export default function AdminProductsPage() {
  return (
    <ContentLayout title="Products">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductTableHeader />
      <Suspense fallback={<ProductsLoading />}>
        <ProductList />
      </Suspense>
      <ProductPagination />
    </ContentLayout>
  );
}
