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
import { Package, Search, ArrowLeft, ArrowRight, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders, type OrdersResponse } from "@/services/account-orders";
import { useDebounce } from "@/hooks/use-debounce";
import { OrderStatus } from "@prisma/client";
import { OrderStatCard } from "./_components/order-stat-card";
import { OrderListItem } from "./_components/order-list-item";
import { Skeleton } from "@/components/ui/skeleton";

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

  // Calculate stats from orders data
  const stats = React.useMemo(() => {
    if (!data?.data) {
      return {
        deliveryOrdersCount: 0,
        collectionOrdersCount: 0,
        totalSpent: 0,
      };
    }

    const delivery = data.data.filter((order) =>
      order.orderItems.some((item) => item.type === "FOR_DELIVERY")
    ).length;

    const collection = data.data.filter((order) =>
      order.orderItems.some((item) => item.type === "FOR_COLLECTION")
    ).length;

    const total = data.data.reduce((acc, order) => acc + order.totalPrice, 0);

    return {
      deliveryOrdersCount: delivery,
      collectionOrdersCount: collection,
      totalSpent: total,
    };
  }, [data?.data]);

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
    if (data?.pagination.hasMore) {
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
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
              <Package className="h-8 w-8" />
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
          value={data?.pagination.totalCount || 0}
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

      {/* Orders List with integrated search */}
      <Card className="bg-white">
        <CardHeader className="flex flex-col space-y-4 px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Order History</CardTitle>

            {/* Status filter moved to header */}
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

          {/* Search integrated inside orders card */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by order number..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Active filters indicator */}
          {(searchQuery || status !== "all") && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {searchQuery && (
                  <span className="mr-2">Search: "{searchQuery}"</span>
                )}
                {status !== "all" && (
                  <span>Status: {statusLabels[status]}</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </CardHeader>

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
          ) : data?.data.length === 0 ? (
            <div className="text-center py-12">
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
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {data?.data.map((order) => (
                <OrderListItem key={order.id} order={order} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
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
                  Page {page} of {data.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.pagination.hasMore}
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
                    <span className="font-medium">{(page - 1) * 10 + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(page * 10, data.pagination.totalCount)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {data.pagination.totalCount}
                    </span>{" "}
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
                      Page {page} of {data.pagination.totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-r-md"
                      disabled={!data.pagination.hasMore}
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
    </div>
  );
}

// Improved skeleton that better matches the OrderListItem structure
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
