"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Heart, ShoppingBag } from "lucide-react";
import { NumericFormat } from "react-number-format";
import ProductCard from "../../_components/product-card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import {
  fetchWishlist,
  WishlistInventoryItem,
  getProductPrice,
  isInventoryAvailable,
} from "@/services/account-wishlist";
import { useToast } from "@/components/ui/use-toast";

// Skeleton loader for the wishlist items
const WishlistItemSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-48 w-full rounded-lg" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex justify-between">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

// Skeleton loader for the stats cards
const StatsCardSkeleton = () => (
  <Card className="bg-white">
    <CardContent className="p-6">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-12" />
    </CardContent>
  </Card>
);

export default function AccountWishlistPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { toast } = useToast();

  const {
    data: wishlistItems,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
  });

  // Get unique categories from wishlist inventory items for filter dropdown
  const categories = useMemo(() => {
    if (!wishlistItems) return [];

    const categorySet = new Set<string>();
    wishlistItems.forEach((item) => {
      if (item.product.primaryCategory?.name) {
        categorySet.add(item.product.primaryCategory.name);
      }
    });

    return Array.from(categorySet);
  }, [wishlistItems]);

  // Filter logic
  const filteredItems = useMemo(() => {
    if (!wishlistItems) return [];

    return wishlistItems.filter((item) => {
      const matchesSearch = item.product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        item.product.primaryCategory?.name === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [wishlistItems, searchQuery, categoryFilter]);

  // Calculate total value
  const totalValue = useMemo(() => {
    if (!wishlistItems) return 0;

    return wishlistItems.reduce((acc, item) => {
      const price = getProductPrice(item) || 0;
      return acc + price;
    }, 0);
  }, [wishlistItems]);

  // Count in-stock items
  const inStockCount = useMemo(() => {
    if (!wishlistItems) return 0;

    return wishlistItems.filter((item) => isInventoryAvailable(item)).length;
  }, [wishlistItems]);

  if (error) {
    return (
      <div className="space-y-8">
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white/10 flex items-center justify-center rounded-full">
                <FaHeart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">My Wishlist</h1>
                <p className="text-primary-foreground/90 mt-1">
                  View and manage your saved items
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 text-center">
          <p className="text-red-500">
            {error instanceof Error
              ? error.message
              : "Failed to load wishlist data"}
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Consistent with other account pages */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white/10 flex items-center justify-center rounded-full">
              <FaHeart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Wishlist</h1>
              <p className="text-primary-foreground/90 mt-1">
                View and manage your saved items
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {isLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <Card className="bg-white">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Items
                </p>
                <p className="text-2xl font-bold mt-2">
                  {wishlistItems?.length || 0}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">
                  In Stock Items
                </p>
                <p className="text-2xl font-bold mt-2">{inStockCount}</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Value
                </p>
                <p className="text-2xl font-bold mt-2">
                  <NumericFormat
                    value={totalValue}
                    displayType="text"
                    prefix="£"
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search wishlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Saved Items</h2>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading..."
              : `${filteredItems.length} item${
                  filteredItems.length !== 1 ? "s" : ""
                }`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <WishlistItemSkeleton key={`skeleton-${index}`} />
              ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mt-1 max-w-sm mx-auto">
              Browse our products and save your favorites for later
            </p>
            <Link href="/products">
              <Button className="mt-6">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ProductCard key={item.id} inventoryItem={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
