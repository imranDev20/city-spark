"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Package2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchProducts, FetchProductsParams } from "@/services/admin-products";
import SwipeableProductCard from "./swipeable-product-card";
import { useToast } from "@/components/ui/use-toast";

export default function MobileProductList() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const currentParams: FetchProductsParams = {
    page: searchParams.get("page") || "1",
    pageSize: "10",
    search: searchParams.get("search") || "",
    sort_by: searchParams.get("sort_by") || "updatedAt",
    sort_order:
      (searchParams.get("sort_order") as FetchProductsParams["sort_order"]) ||
      "desc",
    filter_status: searchParams.get("filter_status") || "",
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", currentParams],
    queryFn: () => fetchProducts(currentParams),
  });

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/${productId}/edit`);
  };

  const handleDelete = (productId: string) => {
    toast({
      title: "Are you sure?",
      description: "This action cannot be undone.",
      variant: "destructive",
    });
  };

  if (isLoading) {
    return (
      <div className="flex lg:hidden items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        Error loading products. Please try again later.
      </div>
    );
  }

  if (!data || !data.products.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Package2 className="h-12 w-12 mb-4" />
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {data.products.map((product) => (
        <SwipeableProductCard
          key={product.id}
          product={product}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
