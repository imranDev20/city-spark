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
import {
  Badge,
  Check,
  ClipboardCopy,
  Clock,
  CreditCard,
  MapPin,
  Package,
  PenLine,
  User,
} from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
type PaymentMethod =
  | "CASH_ON_DELIVERY"
  | "CREDIT_CARD"
  | "PAYPAL"
  | "BANK_TRANSFER";
type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
type FulfillmentType = "FOR_DELIVERY" | "FOR_COLLECTION";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
  fulfillmentType: "FOR_DELIVERY" | "FOR_COLLECTION";
  collectionPoint?: {
    id: string;
    name: string;
    address: string;
    collectionTime?: string;
  };
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    shippingAddress: string;
    billingAddress: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  timeline: {
    status: string;
    date: string;
    description: string;
  }[];
}

// Updated dummy data with collection points
const dummyOrderDetails: OrderDetails = {
  id: "ord_123456",
  orderNumber: "SPRITE-100063",
  createdAt: "2022-10-09T21:22:00Z",
  updatedAt: "2022-10-20T22:42:00Z",
  status: "PROCESSING",
  paymentStatus: "PAID",
  paymentMethod: "CREDIT_CARD",
  customer: {
    id: "cust_789",
    name: "Mick Jeson Holder",
    email: "XNqQ4@example.com",
    phone: "+1234567890",
    shippingAddress: "1600 Amphiteatre Parkway, CA, USA 94043",
    billingAddress: "same as shipping address",
  },
  items: [
    {
      id: "item_1",
      productName:
        "Worcester Bosch Greenstar 8000 Life 30kW Natural Gas Combi Boiler with Horizontal Flue and Filter (10 Year Warranty)",
      quantity: 2,
      price: 99.99,
      total: 199.98,
      image: "/images/product-1.jpg",
      fulfillmentType: "FOR_DELIVERY",
    },
    {
      id: "item_2",
      productName:
        "Vaillant ecoTEC Plus 835 35kW System Boiler with Rear Flue Kit & Magnetic Central Heating Filter Pack - Natural Gas",
      quantity: 1,
      price: 149.99,
      total: 149.99,
      image: "/images/product-2.jpg",
      fulfillmentType: "FOR_COLLECTION",
      collectionPoint: {
        id: "loc_1",
        name: "Manchester Store",
        address: "123 Store Street, Manchester, M1 1AB",
        collectionTime: "Ready for collection in 2 hours",
      },
    },
    {
      id: "item_3",
      productName:
        "Ideal Logic Max H24 24kW Heat Only Boiler with Standard Horizontal Flue Kit & System Filter - 7 Year Warranty",
      quantity: 1,
      price: 299.99,
      total: 299.99,
      image: "/images/product-3.jpg",
      fulfillmentType: "FOR_DELIVERY",
    },
  ],
  subtotal: 649.96,
  tax: 130.0,
  shippingCost: 15.0,
  total: 794.96,
  timeline: [
    {
      status: "Order Placed",
      date: "2022-10-09T21:22:00Z",
      description: "Order was placed successfully",
    },
    {
      status: "Payment Confirmed",
      date: "2022-10-09T21:25:00Z",
      description: "Payment was confirmed",
    },
    {
      status: "Processing",
      date: "2022-10-10T10:00:00Z",
      description: "Order is being processed",
    },
  ],
};

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

interface OrderItemsSectionProps {
  items: OrderItem[];
  title: string;
  deliveryAddress?: string;
  type: "collection" | "delivery";
}

function OrderItemsSection({
  items,
  title,
  deliveryAddress,
  type,
}: OrderItemsSectionProps) {
  if (items.length === 0) return null;

  const handleChangeLocation = () => {
    console.log("Change location clicked");
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {items.length} items
              </p>
            </div>

            {/* Show delivery/collection info in header */}
            <div className="text-sm text-right">
              {type === "delivery" ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-end gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Delivery to:</span>
                    <button
                      onClick={handleChangeLocation}
                      className="text-primary hover:text-primary/90 font-medium"
                    >
                      {deliveryAddress}
                    </button>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Expected delivery:</span>
                    <span className="font-medium">Wednesday, 18 Dec 2024</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.productName}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium leading-tight">
                  {item.productName}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Quantity: {item.quantity}
                </p>

                {type === "collection" && item.collectionPoint && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Collection from:</span>
                      <button
                        onClick={handleChangeLocation}
                        className="text-primary hover:text-primary/90 font-medium"
                      >
                        {item.collectionPoint.name}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        Expected collection:
                      </span>
                      <span className="font-medium">
                        Wednesday, 18 Dec 2024
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-right flex-shrink-0">
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-lg font-semibold">
                    £{item.total.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">inc. VAT</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {item.quantity} x £{item.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminOrderDetailsPage() {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(
    dummyOrderDetails.status
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    dummyOrderDetails.paymentStatus
  );

  // Simulate fetching data with useQuery
  const { data: orderDetails, isLoading } = useQuery({
    queryKey: ["order", "ord_123456"],
    queryFn: () => Promise.resolve(dummyOrderDetails),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!orderDetails) {
    return <div>Order not found</div>;
  }

  const deliveryItems = orderDetails.items.filter(
    (item) => item.fulfillmentType === "FOR_DELIVERY"
  );

  const collectionItems = orderDetails.items.filter(
    (item) => item.fulfillmentType === "FOR_COLLECTION"
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
          <OrderItemsSection
            items={deliveryItems}
            title="Delivery Items"
            type="delivery"
            deliveryAddress="IG11 7YA"
          />

          {/* Collection Items */}
          <OrderItemsSection
            items={collectionItems}
            title="Collection Items"
            type="collection"
          />

          {/* Timeline Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Timeline
              </CardTitle>
              <CardDescription>Track the order's journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6">
                {/* Continuous vertical line */}
                <div
                  className="absolute left-[5.5px] top-1 bottom-1 w-px bg-gray-200"
                  aria-hidden="true"
                />

                <div className="space-y-8">
                  {orderDetails.timeline.map((event, index) => (
                    <div key={index} className="relative">
                      {/* Dot with outline */}
                      <div
                        className="absolute -left-6 mt-1.5 w-3 h-3 rounded-full border-2 border-white bg-primary ring-[3px] ring-primary/20"
                        aria-hidden="true"
                      />

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {event.status}
                          </h4>
                          <div
                            className="h-px flex-1 bg-gray-100"
                            aria-hidden="true"
                          />
                          <time className="flex-shrink-0 text-sm text-gray-500">
                            {format(new Date(event.date), "MMM d, yyyy")}
                          </time>
                        </div>
                        <div className="mt-1.5">
                          <time className="text-sm text-gray-500">
                            {format(new Date(event.date), "h:mm a")}
                          </time>
                          <p className="mt-1 text-sm text-gray-600 leading-normal">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Side (1 column) */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="text-gray-600 flex items-baseline gap-2">
                    <span>Subtotal</span>
                    <span className="text-xs">(exc. VAT)</span>
                  </div>
                  <span>£{orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT</span>
                  <span>£{orderDetails.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span>£{orderDetails.shippingCost.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>£{orderDetails.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total (exc. VAT)</span>
                  <span>
                    £{(orderDetails.total - orderDetails.tax).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment Method</span>
                {orderDetails.paymentMethod.replace(/_/g, " ")}
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="text-sm text-gray-600">Payment Status</span>
                <div className="flex items-center gap-2">
                  <Select
                    value={paymentStatus}
                    onValueChange={(value: PaymentStatus) =>
                      setPaymentStatus(value)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(paymentStatuses).map((status) => (
                        <SelectItem key={status} value={status}>
                          {paymentStatuses[status as PaymentStatus].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center gap-2">
                <span className="text-sm text-gray-600">Order Status</span>
                <div className="flex items-center gap-2">
                  <Select
                    value={orderStatus}
                    onValueChange={(value: OrderStatus) =>
                      setOrderStatus(value)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(orderStatuses).map((status) => (
                        <SelectItem key={status} value={status}>
                          {orderStatuses[status as OrderStatus].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{orderDetails.customer.name}</h4>
                <p className="text-sm text-gray-500">
                  {orderDetails.customer.email}
                </p>
                {orderDetails.customer.phone && (
                  <p className="text-sm text-gray-500">
                    {orderDetails.customer.phone}
                  </p>
                )}
              </div>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Shipping Address</span>
                </div>
                <p className="text-sm text-gray-600">
                  {orderDetails.customer.shippingAddress}
                </p>
              </div>
              {orderDetails.customer.billingAddress !==
                "same as shipping address" && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Billing Address</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {orderDetails.customer.billingAddress}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
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
