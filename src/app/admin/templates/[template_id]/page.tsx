import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import TemplateForm from "../_components/template-form";
import { getTemplateById } from "../actions";

type PageParams = Promise<{
  template_id: string;
}>;

export default async function AdminEditTemplatePage(props: {
  params: PageParams;
}) {
  const params = await props.params;
  const templateDetails = await getTemplateById(params.template_id);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Templates", href: "/admin/templates" },
    {
      label: templateDetails?.name || "Edit Template",
      href: `/admin/templates/${params.template_id}`,
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
