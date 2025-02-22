"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaBox } from "react-icons/fa";
import {
  ArrowDownToLine,
  ClipboardCopy,
  Clock,
  Package,
  Check,
  AlertTriangle,
  Ban,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";
import { fetchOrderById } from "@/services/account-orders";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import OrderStatusTracker from "./_components/order-status-tracker";

const statusStyles: Record<OrderStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  RETURNED: "bg-orange-100 text-orange-800",
  RETURNED_REFUND: "bg-orange-100 text-orange-800",
  AWAITING_PAYMENT: "bg-yellow-100 text-yellow-800",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  UNPAID: "bg-red-100 text-red-800",
  REFUND: "bg-orange-100 text-orange-800",
  CANCELLED: "bg-red-100 text-red-800",
};

// Order status tracking steps with icons and descriptions
const orderStatusSteps = [
  {
    key: "PENDING",
    label: "Order Placed",
    icon: Clock,
    description: "We've received your order and are processing it.",
  },
  {
    key: "PROCESSING",
    label: "Processing",
    icon: Package,
    description: "Your order is being prepared for shipping.",
  },
  {
    key: "SHIPPED",
    label: "Shipped",
    icon: Package,
    description: "Your order is on its way to you.",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: Check,
    description: "Your order has been delivered.",
  },
  {
    key: "CANCELLED",
    label: "Cancelled",
    icon: Ban,
    description: "This order has been cancelled.",
  },
];

// Component for the order status tracker

export default function AccountOrderDetailsPage() {
  const params = useParams<{ order_id: string }>();
  const orderId = params.order_id;
  const { toast } = useToast();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
  });

  const handleCopyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      toast({
        description: "Order number copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
          <CardContent className="p-6">
            <div className="animate-pulse flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20" />
              <div className="space-y-3">
                <div className="h-6 w-32 bg-white/20 rounded" />
                <div className="h-4 w-48 bg-white/20 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="animate-pulse bg-white rounded-lg h-20 w-full" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardContent className="p-6 space-y-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Order not found</h2>
          <p className="text-gray-600 mt-2">
            The order you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
        </div>
      </Card>
    );
  }

  const deliveryItems = order.orderItems.filter(
    (item) => item.type === "FOR_DELIVERY"
  );
  const collectionItems = order.orderItems.filter(
    (item) => item.type === "FOR_COLLECTION"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
              <FaBox className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
              <p className="text-primary-foreground/90 mt-1">
                Placed on{" "}
                {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Status Tracker */}
      <OrderStatusTracker currentStatus={order.orderStatus} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="bg-white">
            <CardContent className="divide-y divide-gray-200">
              {/* Order Status Section */}
              <div className="py-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Order Status
                    </div>
                    <div
                      className={cn(
                        "mt-2 px-3 py-1 rounded-full text-sm font-medium inline-block",
                        statusStyles[order.orderStatus]
                      )}
                    >
                      {order.orderStatus}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Payment Status
                    </div>
                    <div
                      className={cn(
                        "mt-2 px-3 py-1 rounded-full text-sm font-medium inline-block",
                        paymentStatusStyles[order.paymentStatus]
                      )}
                    >
                      {order.paymentStatus}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Items */}
              {deliveryItems.length > 0 && (
                <div className="py-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-semibold">Delivery Items</h2>
                    {order.shippingAddress && (
                      <div className="text-sm text-right">
                        <div className="font-medium">Delivery Address</div>
                        <div className="text-gray-600 mt-1">
                          {order.shippingAddress}
                        </div>
                        {order.shippingDate && (
                          <div className="text-gray-600 mt-1">
                            Expected delivery:{" "}
                            {format(
                              new Date(order.shippingDate),
                              "dd MMM yyyy"
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {deliveryItems.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex gap-4">
                          <div className="relative h-24 w-24 bg-white rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.images[0] || "/placeholder.jpg"}
                              alt={item.product.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900">
                              {item.product.name}
                            </h3>
                            <div className="mt-1 text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </div>
                            <div className="mt-2 text-sm">
                              <span className="font-medium">
                                £{item.totalPrice.toFixed(2)}
                              </span>
                              <span className="text-gray-500 ml-1">
                                inc. VAT
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Collection Items */}
              {collectionItems.length > 0 && (
                <div className="py-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Collection Items
                  </h2>
                  <div className="space-y-4">
                    {collectionItems.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex gap-4">
                          <div className="relative h-24 w-24 bg-white rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.images[0] || "/placeholder.jpg"}
                              alt={item.product.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900">
                              {item.product.name}
                            </h3>
                            <div className="mt-1 text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </div>
                            <div className="mt-2 text-sm">
                              <span className="font-medium">
                                £{item.totalPrice.toFixed(2)}
                              </span>
                              <span className="text-gray-500 ml-1">
                                inc. VAT
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="py-6">
                <h2 className="text-lg font-semibold mb-4">Order Updates</h2>
                <div className="space-y-4">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-32 flex-shrink-0 text-sm text-gray-500">
                        {format(new Date(event.createdAt), "dd MMM yyyy")}
                        <div className="text-xs">
                          {format(new Date(event.createdAt), "HH:mm")}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{event.eventType}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {event.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal (exc. VAT)</span>
                  <span>£{order.cart.subTotalWithoutVat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT</span>
                  <span>£{order.cart.vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span>£{order.cart.deliveryCharge.toFixed(2)}</span>
                </div>
                {/* {order.cart.promoDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-£{order.cart.promoDiscount.toFixed(2)}</span>
                  </div>
                )} */}
                <Separator className="my-3" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>£{order.cart.totalPriceWithVat.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {order.paymentMethod && `Paid via ${order.paymentMethod}`}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={handleCopyOrderNumber}
              >
                <ClipboardCopy className="h-4 w-4 mr-2" />
                Copy Order Number
              </Button>
              {order.invoice && (
                <Button className="w-full">
                  <ArrowDownToLine className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              )}
              {order.orderStatus === "PROCESSING" && (
                <Button className="w-full" variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Request Support
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Estimated Delivery Card */}
          {order.orderStatus !== "CANCELLED" &&
            order.orderStatus !== "DELIVERED" &&
            order.orderStatus !== "COMPLETED" && (
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Estimated Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    {order.shippingDate ? (
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {format(new Date(order.shippingDate), "dd MMM")}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.orderStatus === "SHIPPED"
                            ? "Your order is on its way!"
                            : "Expected delivery date"}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Delivery date will be provided once your order ships.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}
