import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import ProductTableHeader from "./_components/product-table-header";
import ProductsLoading from "./_components/products-loading";
import DesktopProductList from "./_components/desktop-product-list";
import MobileProductList from "./_components/mobile-product-list";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products", isCurrentPage: true },
];

// const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function AdminProductsPage() {
  // await wait(3000);

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
