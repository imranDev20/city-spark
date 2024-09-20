import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import TemplateForm from "../_components/template-form";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Templates", href: "/admin/templates" },
  {
    label: "Add New Template",
    href: "/admin/templates/new",
    isCurrentPage: true,
  },
];

export default function AdminCreateTemplatePage() {
  return (
    <ContentLayout title="Create Template">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <TemplateForm />
    </ContentLayout>
  );
}
