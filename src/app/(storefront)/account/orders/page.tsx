"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Package,
  ArrowRight,
  CalendarDays,
  Clock,
  Store,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { FaBox } from "react-icons/fa";
import { NumericFormat } from "react-number-format";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
type FulfillmentType = "FOR_DELIVERY" | "FOR_COLLECTION";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string;
  collectionPoint?: string;
}

// Dummy data with delivery and collection orders
const dummyOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    date: "2024-02-05T14:30:00Z",
    status: "completed",
    total: 299.99,
    fulfillmentType: "FOR_DELIVERY",
    deliveryAddress: "123 Main St, London, E1 6AN",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    date: "2024-02-03T09:15:00Z",
    status: "processing",
    total: 458.5,
    fulfillmentType: "FOR_COLLECTION",
    collectionPoint: "Manchester Store",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    date: "2024-02-01T11:45:00Z",
    status: "pending",
    total: 189.99,
    fulfillmentType: "FOR_DELIVERY",
    deliveryAddress: "45 Park Lane, Birmingham, B1 1AA",
  },
];

const statusColorMap = {
  pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border border-blue-200",
  completed: "bg-green-100 text-green-800 border border-green-200",
  cancelled: "bg-red-100 text-red-800 border border-red-200",
};

const statusLabels = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function AccountOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  // Filter orders based on search query and status
  const filteredOrders = dummyOrders.filter((order) => {
    const matchesSearch = order.orderNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const deliveryOrdersCount = dummyOrders.filter(
    (order) => order.fulfillmentType === "FOR_DELIVERY"
  ).length;

  const collectionOrdersCount = dummyOrders.filter(
    (order) => order.fulfillmentType === "FOR_COLLECTION"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
              <FaBox className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Orders</h1>
              <p className="text-primary-foreground/90 mt-1">
                View and track your order history
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Orders",
            value: dummyOrders.length,
            isNumber: true,
          },
          {
            label: "Delivery Orders",
            value: deliveryOrdersCount,
            isNumber: true,
          },
          {
            label: "Collection Orders",
            value: collectionOrdersCount,
            isNumber: true,
          },
          {
            label: "Total Spent",
            value: dummyOrders.reduce((acc, order) => acc + order.total, 0),
            isCurrency: true,
          },
        ].map((stat, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-2xl font-bold mt-2">
                {stat.isCurrency ? (
                  <NumericFormat
                    value={stat.value}
                    displayType="text"
                    prefix="£"
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale
                  />
                ) : (
                  <NumericFormat
                    value={stat.value}
                    displayType="text"
                    thousandSeparator
                  />
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as OrderStatus | "all")
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card className="bg-white">
        <CardHeader className="px-6">
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                No orders found
              </h3>
              <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                We couldn&apos;t find any orders matching your criteria
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 hover:bg-gray-50/50 transition-colors"
                >
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
                            statusColorMap[order.status]
                          }`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mt-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            {new Date(order.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(order.date).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {order.fulfillmentType === "FOR_DELIVERY" ? (
                            <>
                              <Truck className="h-4 w-4" />
                              <span>{order.deliveryAddress}</span>
                            </>
                          ) : (
                            <>
                              <Store className="h-4 w-4" />
                              <span>{order.collectionPoint}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-bold">
                          £{order.total.toFixed(2)}
                        </p>
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
