import { getTemplateById } from "../actions";
import EditTemplateForm from "./_components/edit-template-form";

export default async function TemplateDetailsPage({
  params,
}: {
  params: { template_id: string };
}) {
  const { template_id } = params;
  const templateDetails = await getTemplateById(template_id);

  return (
    <div>
      {templateDetails && (
        <EditTemplateForm templateDetails={templateDetails} />
      )}
    </div>
  );
}
