"use client";

import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import { useQuery } from "@tanstack/react-query";
import OrderDetailsHeader from "./_components/order-details-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCopy } from "lucide-react";
import { useParams } from "next/navigation";
import { fetchOrderDetails } from "@/services/admin-orders";
import OrderItemsSection from "./_components/order-items-section";
import OrderTimelineSection from "./_components/order-timeline";
import OrderSummarySection from "./_components/order-summary-section";
import PaymentDetailsSection from "./_components/payment-details-section";
import CustomerDetailsSection from "./_components/customer-details-section";
import { Button } from "@/components/ui/button";
import { FulFillmentType } from "@prisma/client";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Orders Details", href: "/admin/orders/id", isCurrentPage: true },
];

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const orderId = params.order_id as string;

  const { data: orderDetails, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderDetails(orderId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!orderDetails) {
    return <div>Order not found</div>;
  }

  const deliveryItems = orderDetails.orderItems.filter(
    (item) => item.type === FulFillmentType.FOR_DELIVERY
  );

  const collectionItems = orderDetails.orderItems.filter(
    (item) => item.type === FulFillmentType.FOR_COLLECTION
  );

  return (
    <ContentLayout title="Orders Details" isContainer={false}>
      <div className="container pt-8 pb-4 px-4 sm:px-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
      </div>
      <OrderDetailsHeader orderDetails={orderDetails} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 container px-4 sm:px-8 py-6">
        {/* Main Content - Left Side (2 columns) */}
        <div className="md:col-span-2 space-y-6">
          {deliveryItems.length > 0 && (
            <OrderItemsSection
              items={deliveryItems}
              title="Delivery Items"
              type={FulFillmentType.FOR_DELIVERY}
              deliveryAddress={orderDetails.shippingAddress}
            />
          )}

          {collectionItems.length > 0 && (
            <OrderItemsSection
              items={collectionItems}
              title="Collection Items"
              type={FulFillmentType.FOR_COLLECTION}
            />
          )}

          <OrderTimelineSection timeline={orderDetails.timeline} />
        </div>

        {/* Sidebar - Right Side (1 column) */}
        <div className="space-y-6">
          <OrderSummarySection order={orderDetails} />
          <PaymentDetailsSection order={orderDetails} />
          <CustomerDetailsSection order={orderDetails} />

          {/* Quick Actions Card */}
          <Card className="bg-white">
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
