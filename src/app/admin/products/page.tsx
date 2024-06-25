import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products", isCurrentPage: true },
];

export default function AdminProductsPage() {
  return (
    <ContentLayout title="Products">
      <DynamicBreadcrumb items={breadcrumbItems} />
    </ContentLayout>
  );
}
