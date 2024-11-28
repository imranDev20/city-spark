import axios from "axios";
import { Prisma } from "@prisma/client";

/**
 * Type definition for a product with its related entities
 */
export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    primaryCategory: true;
    secondaryCategory: true;
    tertiaryCategory: true;
  };
}>;

/**
 * Response structure for paginated products data
 */
export interface ProductsResponse {
  products: ProductWithRelations[];
  pagination: {
    currentPage: number;
    totalCount: number;
    totalPages: number;
    pageSize: number;
  };
}

/**
 * Parameters for product fetching
 */
export interface FetchProductsParams {
  page?: string | number;
  pageSize?: string | number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filter_status?: string;
}

/**
 * Fetches products with pagination, sorting, and filtering capabilities
 *
 * @param params - Object containing query parameters
 * @param params.page - Current page number (default: 1)
 * @param params.pageSize - Number of items per page (default: 10)
 * @param params.search - Search term for filtering products
 * @param params.sort_by - Field to sort by (e.g., 'name', 'updatedAt')
 * @param params.sort_order - Sort direction ('asc' or 'desc')
 * @param params.filter_status - Filter by product status
 *
 * @returns Promise containing products data and pagination information
 *
 * @throws Will throw an error if the API request fails
 *
 * @example
 * ```typescript
 * const result = await fetchProducts({
 *   page: '1',
 *   pageSize: '10',
 *   search: 'boiler',
 *   sort_by: 'updatedAt',
 *   sort_order: 'desc',
 *   filter_status: 'ACTIVE'
 * });
 * ```
 */
export async function fetchProducts(
  params: FetchProductsParams
): Promise<ProductsResponse> {
  try {
    // Convert params object to URLSearchParams
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    // Make the API request
    const { data } = await axios.get<ProductsResponse>(
      `/api/products?${queryParams.toString()}`
    );
    return data;
  } catch (error) {
    // Re-throw the error with a more specific message
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch products: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("Failed to fetch products");
  }
}
