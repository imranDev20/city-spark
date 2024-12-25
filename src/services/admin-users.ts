import axios from "axios";
import { Prisma } from "@prisma/client";

/**
 * Type for users list with minimal data
 */
export type UserListItem = Prisma.UserGetPayload<{
  include: {
    orders: {
      select: {
        id: true;
        orderNumber: true;
        createdAt: true;
        orderStatus: true;
      };
    };
    addresses: true;
    carts: {
      select: {
        id: true;
        totalPriceWithVat: true;
        createdAt: true;
      };
    };
    wishlist: {
      select: {
        id: true;
        name: true;
        images: true;
      };
    };
  };
}>;

/**
 * Type for detailed user data including all relations
 */
export type UserDetails = Prisma.UserGetPayload<{
  include: {
    orders: {
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                brand: true;
                primaryCategory: true;
                secondaryCategory: true;
                tertiaryCategory: true;
                quaternaryCategory: true;
              };
            };
          };
        };
        cart: {
          include: {
            cartItems: {
              include: {
                inventory: {
                  include: {
                    product: true;
                  };
                };
              };
            };
            promoCode: true;
          };
        };
      };
    };
    wishlist: {
      include: {
        brand: true;
        inventory: true;
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
      };
    };
    addresses: true;
    accounts: {
      select: {
        provider: true;
        providerAccountId: true;
        type: true;
        expires_at: true;
      };
    };
    sessions: {
      select: {
        expires: true;
        sessionToken: true;
      };
    };
  };
}>;

/**
 * Pagination response structure
 */
interface PaginationData {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * API Response data structure
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Users list response data structure
 */
export interface UsersData {
  users: UserListItem[];
  pagination: PaginationData;
}

/**
 * Query parameters for fetching users
 */
export interface FetchUsersParams {
  page?: string | number;
  page_size?: string | number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  role?: string;
}

/**
 * Fetches users list with pagination, sorting, and filtering
 */
export async function fetchUsers(params: FetchUsersParams): Promise<UsersData> {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const { data } = await axios.get<ApiResponse<UsersData>>(
      `/api/users?${queryParams.toString()}`
    );
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch users: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("Failed to fetch users");
  }
}

/**
 * Fetches detailed user data by ID
 */
export async function fetchUserDetails(userId: string): Promise<UserDetails> {
  try {
    const { data } = await axios.get<ApiResponse<UserDetails>>(
      `/api/users/${userId}`
    );
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch user: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("Failed to fetch user");
  }
}
