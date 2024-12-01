import axios from "axios";
import { Prisma, CategoryType } from "@prisma/client";

/**
 * Type definition for a category with its parent relationships
 */
export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    parentPrimaryCategory: true;
    parentSecondaryCategory: true;
    parentTertiaryCategory: true;
  };
}>;

/**
 * Response structure for paginated categories data
 */
export interface CategoriesResponse {
  status: "success" | "error";
  data: {
    categories: CategoryWithRelations[];
    pagination: {
      currentPage: number;
      totalCount: number;
      totalPages: number;
      page_size: number;
    };
  };
}

/**
 * Parameters for category fetching
 */
export interface FetchCategoriesParams {
  page?: string;
  page_size?: string;
  search?: string;
  sort_by?: "name" | "createdAt";
  sort_order?: "asc" | "desc";
  filter_type?: CategoryType;
}

/**
 * Fetches categories with pagination, sorting, and filtering capabilities
 *
 * @param params - Object containing query parameters
 * @param params.page - Current page number (default: 1)
 * @param params.page_size - Number of items per page (default: 10)
 * @param params.search - Search term for filtering categories
 * @param params.sort_by - Field to sort by ('name' or 'createdAt')
 * @param params.sort_order - Sort direction ('asc' or 'desc')
 * @param params.filter_type - Filter by category type (PRIMARY, SECONDARY, etc.)
 *
 * @returns Promise containing categories data and pagination information
 *
 * @throws Will throw an error if the API request fails
 *
 * @example
 * ```typescript
 * const result = await fetchCategories({
 *   page: '1',
 *   page_size: '10',
 *   search: 'heating',
 *   sort_by: 'name',
 *   sort_order: 'desc',
 *   filter_type: 'PRIMARY'
 * });
 * ```
 */
export async function fetchCategories(
  params: FetchCategoriesParams
): Promise<CategoriesResponse> {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const { data } = await axios.get<CategoriesResponse>(
      `/api/categories?${queryParams.toString()}`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch categories: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("Failed to fetch categories");
  }
}

/**
 * Fetches a single category by ID
 *
 * @param categoryId - The ID of the category to fetch
 *
 * @returns Promise containing the category data
 *
 * @throws Will throw an error if the API request fails
 *
 * @example
 * ```typescript
 * const category = await fetchCategory('123');
 * ```
 */
export async function fetchCategory(
  categoryId: string
): Promise<{ status: "success" | "error"; data: CategoryWithRelations }> {
  const { data } = await axios.get(`/api/categories/${categoryId}`);
  return data;
}
