import { getBrandById } from "../actions";
import EditBrandForm from "./_components/edit-brand-form";

export default async function AdminBrandDetailsPage({
  params,
}: {
  params: { brand_id: string };
}) {
  const { brand_id } = params;
  const brandDetails = await getBrandById(brand_id);
  return (
    <div>
      <EditBrandForm brandDetails={brandDetails} />
    </div>
  );
}
