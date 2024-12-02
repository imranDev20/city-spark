import axios from "axios";
import { Prisma } from "@prisma/client";

/**
 * Type definition for a template with its related fields
 */
export type TemplateWithFields = Prisma.TemplateGetPayload<{
  include: {
    fields: true;
  };
}>;

/**
 * Fetches all templates with their fields
 *
 * @returns Promise containing array of templates with their fields
 *
 * @throws Will throw an error if the API request fails
 *
 * @example
 * ```typescript
 * const templates = await fetchTemplates();
 * ```
 */
export async function fetchTemplates(): Promise<TemplateWithFields[]> {
  try {
    const { data } = await axios.get<{
      success: boolean;
      message: string;
      data: TemplateWithFields[];
    }>("/api/templates");

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to fetch templates");
    }

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch templates: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("Failed to fetch templates");
  }
}

/**
 * Fetches details of a specific template by ID
 *
 * @param templateId - The ID of the template to fetch
 * @returns Promise containing template details with its fields
 *
 * @throws Will throw an error if the API request fails
 *
 * @example
 * ```typescript
 * const templateDetails = await fetchTemplateDetails('template-123');
 * ```
 */
export async function fetchTemplateDetails(
  templateId: string
): Promise<TemplateWithFields> {
  try {
    const { data } = await axios.get<{
      success: boolean;
      message: string;
      data: TemplateWithFields;
    }>(`/api/templates/${templateId}`);

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to fetch template details");
    }

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch template details: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("Failed to fetch template details");
  }
}
