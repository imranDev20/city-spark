"use client";

import React from "react";
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
import { Package, Search } from "lucide-react";
import { FaBox } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders, type OrdersResponse } from "@/services/account-orders";
import { useDebounce } from "@/hooks/use-debounce";
import { OrderStatus } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useCallback, useMemo } from "react";
import { OrderStatCard } from "./_components/order-stat-card";
import { OrderListItem } from "./_components/order-list-item";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current search params
  const currentSearchQuery = searchParams.get("search") || "";
  const currentStatus =
    (searchParams.get("status") as OrderStatus | "all") || "all";
  const currentPage = Number(searchParams.get("page")) || 1;

  // Debounce search query
  const debouncedSearch = useDebounce(currentSearchQuery, 300);

  // Update URL with new search params
  const updateSearchParams = useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Fetch orders
  const { data, isLoading, isError } = useQuery<OrdersResponse>({
    queryKey: ["orders", debouncedSearch, currentStatus, currentPage],
    queryFn: () =>
      fetchOrders({
        search: debouncedSearch,
        status: currentStatus === "all" ? undefined : currentStatus,
        page: currentPage,
        limit: 10,
      }),
  });

  // Memoize stats calculations
  const { deliveryOrdersCount, collectionOrdersCount, totalSpent } =
    useMemo(() => {
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

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      updateSearchParams({ page: String(currentPage - 1) });
    }
  }, [currentPage, updateSearchParams]);

  const handleNextPage = useCallback(() => {
    if (data?.pagination.hasMore) {
      updateSearchParams({ page: String(currentPage + 1) });
    }
  }, [currentPage, data?.pagination.hasMore, updateSearchParams]);

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
        <OrderStatCard
          label="Total Orders"
          value={data?.pagination.totalCount || 0}
          isLoading={isLoading}
        />
        <OrderStatCard
          label="Delivery Orders"
          value={deliveryOrdersCount}
          isLoading={isLoading}
        />
        <OrderStatCard
          label="Collection Orders"
          value={collectionOrdersCount}
          isLoading={isLoading}
        />
        <OrderStatCard
          label="Total Spent"
          value={totalSpent}
          isCurrency
          isLoading={isLoading}
        />
      </div>

      {/* Filters and Search */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order number..."
                value={currentSearchQuery}
                onChange={(e) =>
                  updateSearchParams({ search: e.target.value, page: "1" })
                }
                className="pl-9"
              />
            </div>
            <Select
              value={currentStatus}
              onValueChange={(value) =>
                updateSearchParams({
                  status: value,
                  page: "1",
                })
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
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card className="bg-white">
        <CardHeader className="px-6">
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y divide-gray-200">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="p-6 animate-pulse">
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-red-500">
                Error loading orders. Please try again.
              </p>
            </div>
          ) : data?.data.length === 0 ? (
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
                  disabled={currentPage <= 1}
                  onClick={handlePrevPage}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.pagination.hasMore}
                  onClick={handleNextPage}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * 10 + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, data.pagination.totalCount)}
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
                    className="inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-l-md"
                      disabled={currentPage <= 1}
                      onClick={handlePrevPage}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center px-4 text-sm font-semibold">
                      Page {currentPage} of {data.pagination.totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-r-md"
                      disabled={!data.pagination.hasMore}
                      onClick={handleNextPage}
                    >
                      Next
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
