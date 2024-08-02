import React from "react";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import { getBrands } from "../../brands/actions";
import CreateProductForm from "./_components/create-product-form";
import { getCategories, getTemplateById, getTemplates } from "../actions";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  {
    label: "Add New Product",
    href: "/admin/products/new",
    isCurrentPage: true,
  },
];

export default async function AdminCreateProductPage({
  params,
  searchParams,
}: {
  params: {
    product_id: string;
  };
  searchParams: {
    template_id: string;
    primary_category_id: string;
    secondary_category_id: string;
    tertiary_category_id: string;
  };
}) {
  const {
    template_id,
    primary_category_id,
    secondary_category_id,
    tertiary_category_id,
  } = searchParams;

  const brands = await getBrands();
  const templates = await getTemplates();
  const templateDetails = await getTemplateById(template_id as string);

  const primaryCategories = await getCategories("PRIMARY");
  const secondaryCategories = await getCategories(
    "SECONDARY",
    primary_category_id
  );
  const tertiaryCategories = await getCategories(
    "TERTIARY",
    secondary_category_id
  );
  const quaternaryCategories = await getCategories(
    "QUATERNARY",
    tertiary_category_id
  );

  return (
    <ContentLayout title="Add New Product">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <CreateProductForm
        brands={brands}
        templates={templates}
        primaryCategories={primaryCategories}
        secondaryCategories={secondaryCategories}
        tertiaryCategories={tertiaryCategories}
        quaternaryCategories={quaternaryCategories}
        templateDetails={templateDetails}
      />
    </ContentLayout>
  );
}
