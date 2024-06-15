import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import { ContentLayout } from "../_components/content-layout";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard", isCurrentPage: true },
];

export default function AdminPage({
  params,
}: {
  params: {
    slug: string[];
  };
}) {
  const { slug } = params;

  const renderContent = (title: string) => (
    <ContentLayout title={title}>
      <DynamicBreadcrumb items={breadcrumbItems} />
    </ContentLayout>
  );

  // Check if the slug matches "dashboard" or is undefined for the main /admin route
  if (!slug || (slug.length === 1 && slug[0] === "dashboard")) {
    return renderContent("Dashboard");
  }

  // For any other sub-routes, render an error message
  throw new Error("Page not found");
}
