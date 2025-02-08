"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaHeart } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Heart } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { Prisma } from "@prisma/client";
import ProductCard from "../../_components/product-card";

// Using the same type as your ProductCard
type InventoryItemWithRelation = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        brand: true;
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
      };
    };
  };
}>;

// Dummy data matching the required type
const dummyWishlistItems: InventoryItemWithRelation[] = [];

export default function AccountWishlistPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Filter logic remains the same
  const filteredItems = dummyWishlistItems.filter((item) => {
    const matchesSearch = item.product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      item.product.primaryCategory?.name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalValue = dummyWishlistItems.reduce(
    (acc, item) =>
      acc + (item.product.promotionalPrice || item.product.retailPrice || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
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
        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Total Items
            </p>
            <p className="text-2xl font-bold mt-2">
              {dummyWishlistItems.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">
              In Stock Items
            </p>
            <p className="text-2xl font-bold mt-2">
              {dummyWishlistItems.filter((item) => item.stockCount > 0).length}
            </p>
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
            <SelectItem value="Boilers">Boilers</SelectItem>
            <SelectItem value="Radiators">Radiators</SelectItem>
            <SelectItem value="Controls">Controls</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Saved Items</h2>
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} items
          </p>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              No items found
            </h3>
            <p className="text-gray-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search or filter to find what you&apos;re
              looking for
            </p>
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
