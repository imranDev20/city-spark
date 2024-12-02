import { Prisma, Status } from "@prisma/client";
import axios from "axios";

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
