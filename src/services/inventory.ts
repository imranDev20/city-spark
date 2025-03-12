import axios from "axios";
import { Prisma } from "@prisma/client";

// Types
export type InventoryItemWithRelations = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
        brand: true;
      };
    };
  };
}>;

export interface PaginatedInventoryResponse {
  success: boolean;
  message: string;
  data: InventoryItemWithRelations[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface RecentlyViewedResponse {
  success: boolean;
  message: string;
  data: InventoryItemWithRelations[];
}

export type InventoryQueryParams = {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
  isPrimaryRequired?: boolean;
  isSecondaryRequired?: boolean;
  isTertiaryRequired?: boolean;
  isQuaternaryRequired?: boolean;
  isSearch?: boolean;
  search?: string;
  p_id?: string;
  s_id?: string;
  t_id?: string;
  q_id?: string;
  sort_by?: string;
  sort_order?: string;
  min_price?: string;
  max_price?: string;
  [key: string]: any;
};

export async function fetchInventoryProducts(
  page: number,
  queryParams: InventoryQueryParams
) {
  // Create base URLSearchParams
  const params = new URLSearchParams();

  // Add pagination
  params.set("page", page.toString());
  params.set("limit", queryParams.limit?.toString() || "12");

  // Add category params - use consistent parameter names with the API
  if (queryParams.primaryCategoryId || queryParams.p_id) {
    params.set(
      "p_id",
      (queryParams.primaryCategoryId || queryParams.p_id)?.toString() || ""
    );
  }
  if (queryParams.secondaryCategoryId || queryParams.s_id) {
    params.set(
      "s_id",
      (queryParams.secondaryCategoryId || queryParams.s_id)?.toString() || ""
    );
  }
  if (queryParams.tertiaryCategoryId || queryParams.t_id) {
    params.set(
      "t_id",
      (queryParams.tertiaryCategoryId || queryParams.t_id)?.toString() || ""
    );
  }
  if (queryParams.quaternaryCategoryId || queryParams.q_id) {
    params.set(
      "q_id",
      (queryParams.quaternaryCategoryId || queryParams.q_id)?.toString() || ""
    );
  }

  // Add required flags
  if (queryParams.isPrimaryRequired) {
    params.set("isPrimaryRequired", "true");
  }
  if (queryParams.isSecondaryRequired) {
    params.set("isSecondaryRequired", "true");
  }
  if (queryParams.isTertiaryRequired) {
    params.set("isTertiaryRequired", "true");
  }
  if (queryParams.isQuaternaryRequired) {
    params.set("isQuaternaryRequired", "true");
  }

  // Add search
  if (queryParams.search) {
    params.set("search", queryParams.search);
  }

  // Add any additional filter params
  Object.entries(queryParams).forEach(([key, value]) => {
    if (
      ![
        "primaryCategoryId",
        "secondaryCategoryId",
        "tertiaryCategoryId",
        "quaternaryCategoryId",
        "isPrimaryRequired",
        "isSecondaryRequired",
        "isTertiaryRequired",
        "isQuaternaryRequired",
        "isSearch",
        "search",
        "limit",
        "p_id",
        "s_id",
        "t_id",
        "q_id",
      ].includes(key) &&
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      params.set(key, value.toString());
    }
  });

  try {
    const { data } = await axios.get<PaginatedInventoryResponse>(
      `/api/inventory?${params.toString()}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch inventory items");
    }

    return {
      items: data.data,
      pagination: data.pagination,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch inventory items"
      );
    }
    throw error;
  }
}

export async function fetchRecentlyViewedInventory(
  inventoryIds: string[]
): Promise<InventoryItemWithRelations[]> {
  try {
    if (!inventoryIds.length) {
      return [];
    }

    const { data } = await axios.get<RecentlyViewedResponse>(
      `/api/inventory/recently-viewed?ids=${inventoryIds.join(",")}`
    );

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch recently viewed items"
      );
    }
    throw error;
  }
}
