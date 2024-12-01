import axios from "axios";
import { Prisma, Status } from "@prisma/client";

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
    page_size: number;
  };
}

/**
 * Parameters for product fetching
 */
export interface FetchProductsParams {
  page?: string | number;
  page_size?: string | number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filter_status?: string;
  primary_category_id?: string;
  secondary_category_id?: string;
  tertiary_category_id?: string;
  quaternary_category_id?: string;
}

/**
 * Fetches products with pagination, sorting, and filtering capabilities
 *
 * @param params - Object containing query parameters
 * @param params.page - Current page number (default: 1)
 * @param params.page_size - Number of items per page (default: 10)
 * @param params.search - Search term for filtering products
 * @param params.sort_by - Field to sort by (e.g., 'name', 'updatedAt')
 * @param params.sort_order - Sort direction ('asc' or 'desc')
 * @param params.filter_status - Filter by product status
 * @param params.primary_category_id - Filter by primary category ID
 * @param params.secondary_category_id - Filter by secondary category ID
 * @param params.tertiary_category_id - Filter by tertiary category ID
 * @param params.quaternary_category_id - Filter by quaternary category ID
 *
 * @returns Promise containing products data and pagination information
 *
 * @throws Will throw an error if the API request fails
 *
 * @example
 * ```typescript
 * const result = await fetchProducts({
 *   page: '1',
 *   page_size: '10',
 *   search: 'boiler',
 *   sort_by: 'updatedAt',
 *   sort_order: 'desc',
 *   filter_status: 'ACTIVE',
 *   primary_category_id: '123',
 *   secondary_category_id: '456'
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
      if (value !== undefined && value !== "" && value !== null) {
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

/**
 * Type definition for a brand with its related product count
 */
export type BrandWithProducts = Prisma.BrandGetPayload<{
  include: {
    _count: {
      select: {
        products: true;
      };
    };
  };
}>;

/**
 * Response structure for paginated brands data
 */
export interface BrandsResponse {
  data: BrandWithProducts[];
  pagination: {
    currentPage: number;
    totalCount: number;
    totalPages: number;
    page_size: number;
  };
}

export interface FetchBrandsParams {
  page?: string | number;
  page_size?: string | number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filter_status?: Status;
}

export async function fetchBrands(
  params?: FetchBrandsParams
): Promise<BrandsResponse> {
  try {
    let queryString = "";
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      queryString = `?${queryParams.toString()}`;
    }

    const response = await axios.get<BrandsResponse>(
      `/api/brands${queryString}`
    );
    return response.data; // Return the full response data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch brands: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("Failed to fetch brands");
  }
}
