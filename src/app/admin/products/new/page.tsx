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
  };
}) {
  const { template_id } = searchParams;

  const brands = await getBrands();
  const templates = await getTemplates();
  const categories = await getCategories();
  const templateDetails = await getTemplateById(template_id as string);

  return (
    <ContentLayout title="Add New Product">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <CreateProductForm
        brands={brands}
        templates={templates}
        categories={categories}
        templateDetails={templateDetails}
      />
    </ContentLayout>
  );
}
