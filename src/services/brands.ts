import { Prisma, Status } from "@prisma/client";
import axios from "axios";

/**
 * Type definition for a brand with its related product count
 */
export type BrandWithProducts = Prisma.BrandGetPayload<{
  select: {
    id: true;
    name: true;
    updatedAt: true;
    description: true;
    status: true;
    image: true;
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
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface FetchBrandsParams {
  page?: string | number;
  page_size?: string | number;
  search?: string;
  sort_by?: string;
  sort_order?: Prisma.SortOrder;
  filter_status?: Status;
  primary_category_id?: string;
  secondary_category_id?: string;
  tertiary_category_id?: string;
  quaternary_category_id?: string;
  product_search?: string; // Added for main search term
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
    return response.data;
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

export type BrandWithDetails = Prisma.BrandGetPayload<{
  include: {
    products: true;
  };
}>;

export async function fetchBrandDetails(
  brandId: string
): Promise<BrandWithDetails> {
  try {
    const { data } = await axios.get(`/api/brands/${brandId}`);

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch brand details");
    }

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch brand details"
      );
    }
    throw error;
  }
}
