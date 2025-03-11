"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Search, ArrowLeft, ArrowRight, X } from "lucide-react";
import { FaShoppingBag } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders, type OrdersResponse } from "@/services/account-orders";
import { useDebounce } from "@/hooks/use-debounce";
import { OrderStatus } from "@prisma/client";
import { OrderStatCard } from "./_components/order-stat-card";
import { OrderListItem } from "./_components/order-list-item";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

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

export default function AccountOrdersPage() {
  // Local state for filters and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);

  // Debounce search query to avoid excessive API calls
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch orders with the current filters
  const { data, isLoading, isError, refetch } = useQuery<OrdersResponse>({
    queryKey: ["orders", debouncedSearch, status, page],
    queryFn: () =>
      fetchOrders({
        search: debouncedSearch,
        status: status === "all" ? undefined : status,
        page,
        limit: 10,
      }),
  });

  // Safely check if data exists and is in expected format
  const orderItems = data?.data || [];
  const hasOrders = Array.isArray(orderItems) && orderItems.length > 0;
  const totalCount = data?.pagination?.totalCount || 0;
  const totalPages = data?.pagination?.totalPages || 0;
  const hasMorePages = data?.pagination?.hasMore || false;

  // Calculate stats from orders data
  const stats = React.useMemo(() => {
    if (!hasOrders) {
      return {
        deliveryOrdersCount: 0,
        collectionOrdersCount: 0,
        totalSpent: 0,
      };
    }

    const delivery = orderItems.filter((order) =>
      order.orderItems?.some?.((item) => item.type === "FOR_DELIVERY")
    ).length;

    const collection = orderItems.filter((order) =>
      order.orderItems?.some?.((item) => item.type === "FOR_COLLECTION")
    ).length;

    const total = orderItems.reduce(
      (acc, order) => acc + (order.totalPrice || 0),
      0
    );

    return {
      deliveryOrdersCount: delivery,
      collectionOrdersCount: collection,
      totalSpent: total,
    };
  }, [hasOrders, orderItems]);

  // Handlers for pagination and filters
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page on new search
  };

  const handleStatusChange = (value: OrderStatus | "all") => {
    setStatus(value);
    setPage(1); // Reset to first page on status change
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMorePages) {
      setPage(page + 1);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatus("all");
    setPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header Card - Matching the style in other account pages */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white/10 flex items-center justify-center rounded-full">
              <FaShoppingBag className="h-8 w-8" />
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
        <OrderStatCard
          label="Total Orders"
          value={totalCount}
          isLoading={isLoading}
        />
        <OrderStatCard
          label="Delivery Orders"
          value={stats.deliveryOrdersCount}
          isLoading={isLoading}
        />
        <OrderStatCard
          label="Collection Orders"
          value={stats.collectionOrdersCount}
          isLoading={isLoading}
        />
        <OrderStatCard
          label="Total Spent"
          value={stats.totalSpent}
          isCurrency
          isLoading={isLoading}
        />
      </div>

      {/* Filters and Search - Matching the wishlist layout */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) =>
            handleStatusChange(value as OrderStatus | "all")
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            {Object.entries(statusLabels).map(([status, label]) => (
              <SelectItem key={status} value={status}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Order History</h2>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading..."
              : `${totalCount} order${totalCount !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Only show card if there are orders or loading */}
        {(isLoading || hasOrders || isError) && (
          <Card className="bg-white">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="divide-y divide-gray-200">
                  {[...Array(3)].map((_, index) => (
                    <OrderItemSkeleton key={index} />
                  ))}
                </div>
              ) : isError ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Error loading orders
                  </h3>
                  <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                    Something went wrong while retrieving your orders.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => refetch()}
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {orderItems.map((order) => (
                    <OrderListItem key={order.id} order={order} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t sm:px-6">
                  <div className="flex justify-between flex-1 sm:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={handlePrevPage}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Prev
                    </Button>
                    <span className="flex items-center text-sm font-medium">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hasMorePages}
                      onClick={handleNextPage}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {Math.min((page - 1) * 10 + 1, totalCount)}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(page * 10, totalCount)}
                        </span>{" "}
                        of <span className="font-medium">{totalCount}</span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="inline-flex rounded-md shadow-sm"
                        aria-label="Pagination"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-l-md"
                          disabled={page <= 1}
                          onClick={handlePrevPage}
                        >
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        <div className="flex items-center px-4 border-y border-r border-input bg-background text-sm font-medium">
                          Page {page} of {totalPages}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-r-md"
                          disabled={!hasMorePages}
                          onClick={handleNextPage}
                        >
                          Next
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty state outside the card */}
        {!isLoading && !isError && !hasOrders && (
          <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              No orders found
            </h3>
            <p className="text-gray-500 mt-1 max-w-sm mx-auto">
              {searchQuery || status !== "all"
                ? "We couldn't find any orders matching your filters. Try adjusting your search criteria."
                : "You haven't placed any orders yet. Browse our catalog to find products you might like."}
            </p>
            {(searchQuery || status !== "all") && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
            {!(searchQuery || status !== "all") && (
              <Link href="/products">
                <Button className="mt-6">
                  <FaShoppingBag className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Order item skeleton loader
function OrderItemSkeleton() {
  return (
    <div className="p-6 hover:bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-3">
          {/* Order number/ID */}
          <div className="flex items-start">
            <Skeleton className="h-6 w-44" />
            <div className="mx-2" />
            <Skeleton className="h-6 w-24 rounded-full" /> {/* Status badge */}
          </div>

          {/* Order date and other details */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" /> {/* Icon */}
              <Skeleton className="h-4 w-24" /> {/* Date */}
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" /> {/* Icon */}
              <Skeleton className="h-4 w-20" /> {/* Time */}
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" /> {/* Icon */}
              <Skeleton className="h-4 w-24" /> {/* Postal code */}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Price */}
          <div className="flex flex-col items-end">
            <div className="text-sm text-gray-500">Total</div>
            <Skeleton className="h-7 w-28" /> {/* Price */}
          </div>

          {/* View details button */}
          <Skeleton className="h-10 w-36 rounded" />
        </div>
      </div>
    </div>
  );
}
