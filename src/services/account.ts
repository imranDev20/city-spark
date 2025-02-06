import axios from "axios";

export interface AccountStats {
  orders: number;
  wishlist: number;
  addresses: number;
}

export interface RecentOrder {
  id: string;
  date: string;
  status: string;
  total: number;
}

export interface AccountData {
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  stats: AccountStats;
  recentOrders: RecentOrder[];
}

interface ApiResponse {
  success: boolean;
  data?: AccountData;
  message?: string;
}

export async function fetchAccountData(): Promise<AccountData> {
  try {
    const { data: response } = await axios.get<ApiResponse>("/api/account");

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch account data");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch account data"
      );
    }
    throw error;
  }
}
