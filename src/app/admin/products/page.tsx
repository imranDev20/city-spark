// AdminProductsPage.tsx
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import ProductTableHeader from "./_components/product-table-header";
import DesktopProductList from "./_components/desktop-product-list";
import MobileProductList from "./_components/mobile-product-list";
import { Suspense } from "react";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products", isCurrentPage: true },
];

interface Props {
  searchParams: Promise<{
    primary_category_id?: string;
    secondary_category_id?: string;
    tertiary_category_id?: string;
    quaternary_category_id?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <ContentLayout title="Products">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductTableHeader />

      <DesktopProductList
        primaryCategoryId={params.primary_category_id}
        secondaryCategoryId={params.secondary_category_id}
        tertiaryCategoryId={params.tertiary_category_id}
        quaternaryCategoryId={params.quaternary_category_id}
      />
      <MobileProductList />
    </ContentLayout>
  );
}
