import { Prisma } from "@prisma/client";
import axios from "axios";

// Define the complex type for Order with all its relations
export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
        phone: true;
        addresses: true;
      };
    };
    cart: {
      include: {
        cartItems: {
          include: {
            inventory: {
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
          };
        };
        promoCode: true;
      };
    };
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
  };
}>;

// Define the API response structure
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function fetchOrderDetails(
  orderId: string
): Promise<OrderWithRelations> {
  try {
    const { data } = await axios.get<ApiResponse<OrderWithRelations>>(
      `/api/admin/orders/${orderId}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch order details");
    }

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch order details"
      );
    }
    throw error;
  }
}
