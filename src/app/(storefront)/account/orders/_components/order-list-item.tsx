import { Button } from "@/components/ui/button";
import { OrderStatus, Prisma } from "@prisma/client";
import { ArrowRight, CalendarDays, Clock, Truck } from "lucide-react";
import Link from "next/link";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        product: true;
      };
    };
  };
}>;

const statusColorMap: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-800 border border-blue-200",
  COMPLETED: "bg-green-100 text-green-800 border border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border border-red-200",
  DRAFT: "bg-gray-100 text-gray-800 border border-gray-200",
  SHIPPED: "bg-purple-100 text-purple-800 border border-purple-200",
  DELIVERED: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  RETURNED: "bg-orange-100 text-orange-800 border border-orange-200",
  RETURNED_REFUND: "bg-red-100 text-red-800 border border-red-200",
  AWAITING_PAYMENT: "bg-blue-100 text-blue-800 border border-blue-200",
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  DRAFT: "Draft",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  RETURNED: "Returned",
  RETURNED_REFUND: "Returned & Refunded",
  AWAITING_PAYMENT: "Awaiting Payment",
};

interface OrderListItemProps {
  order: OrderWithItems;
}

export function OrderListItem({ order }: OrderListItemProps) {
  return (
    <div className="p-6 hover:bg-gray-50/50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Link
              href={`/account/orders/${order.id}`}
              className="text-lg font-semibold hover:text-primary transition-colors"
            >
              {order.orderNumber}
            </Link>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                statusColorMap[order.orderStatus]
              }`}
            >
              {statusLabels[order.orderStatus]}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mt-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(order.createdAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {order.shippingAddress && (
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>{order.shippingAddress}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-lg font-bold">£{order.totalPrice.toFixed(2)}</p>
          </div>
          <Button size="sm" className="shrink-0" asChild>
            <Link href={`/account/orders/${order.id}`}>
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
