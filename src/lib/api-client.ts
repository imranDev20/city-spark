import axios from "axios";
import { Category, Template, Brand, CategoryType } from "@prisma/client";

// You might want to define these types in a separate file
type TemplateWithFields = Template & { fields: any[] };

export const fetchCategories = async (
  type: CategoryType,
  parentId?: string
): Promise<Category[]> => {
  const { data } = await axios.get("/api/categories", {
    params: { type, parentId },
  });
  return data.data;
};

export const fetchTemplates = async (): Promise<Template[]> => {
  const { data } = await axios.get("/api/templates");
  return data.data;
};

export const fetchTemplateDetails = async (
  templateId?: string
): Promise<TemplateWithFields> => {
  const { data } = await axios.get(`/api/templates/${templateId}`);
  return data.data;
};

export const fetchBrands = async (): Promise<Brand[]> => {
  const { data } = await axios.get("/api/brands");
  return data.data;
};
