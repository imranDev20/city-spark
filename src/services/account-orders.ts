import { OrderStatus, Prisma } from "@prisma/client";
import axios from "axios";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        product: true;
      };
    };
  };
}>;

export interface OrdersResponse {
  success: boolean;
  data: OrderWithItems[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
  };
}

export interface FetchOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus | "all";
}

export async function fetchOrders({
  page = 1,
  limit = 10,
  search = "",
  status,
}: FetchOrdersParams = {}): Promise<OrdersResponse> {
  const { data } = await axios.get<OrdersResponse>("/api/account/orders", {
    params: {
      page,
      limit,
      ...(search && { search }),
      ...(status && status !== "all" && { status }),
    },
  });

  return data;
}

export async function fetchOrderById(orderId: string): Promise<OrderWithItems> {
  const { data } = await axios.get<{ success: boolean; data: OrderWithItems }>(
    `/api/account/orders/${orderId}`
  );

  return data.data;
}
