import { OrderStatus, Prisma } from "@prisma/client";
import axios from "axios";

// Type for list view of orders
export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        product: true;
      };
    };
  };
}>;

// Type for detailed view of a single order
export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    cart: {
      select: {
        subTotalWithVat: true;
        subTotalWithoutVat: true;
        vat: true;
        deliveryCharge: true;
        totalPriceWithVat: true;
        totalPriceWithoutVat: true;
      };
    };
    orderItems: {
      include: {
        product: {
          select: {
            name: true;
            images: true;
          };
        };
      };
    };
    timeline: {
      orderBy: {
        createdAt: "desc";
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

export interface OrderDetailsResponse {
  success: boolean;
  data: OrderWithDetails;
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

export async function fetchOrderById(
  orderId: string
): Promise<OrderWithDetails> {
  const { data } = await axios.get<OrderDetailsResponse>(
    `/api/account/orders/${orderId}`
  );

  if (!data.success) {
    throw new Error("Failed to fetch order details");
  }

  return data.data;
}
