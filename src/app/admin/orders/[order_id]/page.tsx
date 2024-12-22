"use client";

import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import { useQuery } from "@tanstack/react-query";
import OrderDetailsHeader from "./_components/order-details-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardCopy, Clock, CreditCard, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { FulFillmentType, OrderItem, Prisma, Status } from "@prisma/client";
import { useParams } from "next/navigation";
import { fetchOrderDetails } from "@/services/admin-orders";
import PlaceholderImage from "@/images/placeholder-image.png";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderItemsSection from "./_components/order-items-section";
import OrderTimeline from "./_components/order-timeline";
import OrderSummaryCard from "./_components/order-summary-section";
import PaymentDetailsSection from "./_components/payment-details-section";
import CustomerDetailsSection from "./_components/customer-details-section";
import { Button } from "@/components/ui/button";

const orderStatuses = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-800" },
  SHIPPED: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

const paymentStatuses = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  PAID: { label: "Paid", color: "bg-green-100 text-green-800" },
  FAILED: { label: "Failed", color: "bg-red-100 text-red-800" },
  REFUNDED: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
};

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Orders Details", href: "/admin/orders/id", isCurrentPage: true },
];

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const orderId = params.order_id as string;

  const {
    data: orderDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderDetails(orderId),
  });

  const [orderStatus, setOrderStatus] = useState(
    orderDetails?.status || "PENDING"
  );
  const [paymentStatus, setPaymentStatus] = useState(
    orderDetails?.paymentStatus || "PENDING"
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!orderDetails) {
    return <div>Order not found</div>;
  }

  const deliveryItems = orderDetails.cart.cartItems.filter(
    (item) => item.type === "FOR_DELIVERY"
  );

  const collectionItems = orderDetails.cart.cartItems.filter(
    (item) => item.type === "FOR_COLLECTION"
  );

  return (
    <ContentLayout title="Orders Details" isContainer={false}>
      <div className="container pt-8 pb-4 px-4 sm:px-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
      </div>
      <OrderDetailsHeader orderDetails={orderDetails} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 container">
        {/* Main Content - Left Side (2 columns) */}
        <div className="md:col-span-2 space-y-6">
          <OrderItemsSection
            items={deliveryItems}
            title="Delivery Items"
            type="FOR_DELIVERY"
            deliveryAddress="IG11 7YA"
          />

          {/* Collection Items */}
          <OrderItemsSection
            items={collectionItems}
            title="Collection Items"
            type="FOR_COLLECTION"
          />

          <OrderTimeline order={orderDetails} />
        </div>

        {/* Sidebar - Right Side (1 column) */}
        <div className="space-y-6">
          {/* Payment Details Card */}
          <PaymentDetailsSection order={orderDetails} />

          {/* Customer Details Card */}
          <CustomerDetailsSection order={orderDetails} />

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <ClipboardCopy className="w-4 h-4" />
                Copy Order ID
              </Button>
              <Button className="w-full" variant="default">
                Download Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  );
}
