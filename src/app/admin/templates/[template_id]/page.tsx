import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import TemplateForm from "../_components/template-form";
import { getTemplateById } from "../actions";

export default async function AdminEditTemplatePage({
  params,
}: {
  params: { template_id: string };
}) {
  const { template_id } = params;
  const templateDetails = await getTemplateById(template_id);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Templates", href: "/admin/templates" },
    {
      label: templateDetails?.name || "Edit Template",
      href: `/admin/templates/${template_id}`,
      isCurrentPage: true,
    },
  ];

  return (
    <ContentLayout title={`Edit ${templateDetails?.name}`}>
      <DynamicBreadcrumb items={breadcrumbItems} />
      <TemplateForm templateDetails={templateDetails} />
    </ContentLayout>
  );
}
