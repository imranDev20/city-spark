"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "@/app/(storefront)/_components/product-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PackageX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import BannerImage from "@/images/category-banner.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchInventoryProducts,
  InventoryItemWithRelations,
  InventoryQueryParams,
} from "@/services/inventory";

const ITEMS_PER_PAGE = 12;

type ProductCardsContainerProps = {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
  isPrimaryRequired?: boolean;
  isSecondaryRequired?: boolean;
  isTertiaryRequired?: boolean;
  isQuaternaryRequired?: boolean;
  isSearch?: boolean;
  search?: string;
};

interface ProductCardsLoadMoreProps extends ProductCardsContainerProps {
  initialData: InventoryItemWithRelations[];
  initialTotalCount: number;
}

export default function ProductCardsLoadMore({
  initialData,
  initialTotalCount,
  ...queryParams
}: ProductCardsLoadMoreProps) {
  const searchParams = useSearchParams();

  // Extract filter-specific search params
  const getFilterParams = () => {
    const filterParams: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      if (
        ![
          "p_id",
          "s_id",
          "t_id",
          "q_id",
          "search",
          "page",
          "limit",
          "isPrimaryRequired",
          "isSecondaryRequired",
          "isTertiaryRequired",
          "isQuaternaryRequired",
        ].includes(key)
      ) {
        filterParams[key] = value;
      }
    }
    return filterParams;
  };

  const filterParams = getFilterParams();
  const hasFilters = Object.keys(filterParams).length > 0;

  // Convert queryParams to a format matching the API
  const apiQueryParams: InventoryQueryParams = {
    ...queryParams,
    p_id: queryParams.primaryCategoryId,
    s_id: queryParams.secondaryCategoryId,
    t_id: queryParams.tertiaryCategoryId,
    q_id: queryParams.quaternaryCategoryId,
    limit: ITEMS_PER_PAGE.toString(),
    ...filterParams,
  };

  // Create a stable key for the query based on all relevant parameters
  const queryKey = JSON.stringify({
    ...apiQueryParams,
    filters: Object.fromEntries(searchParams.entries()),
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["products", queryKey],
      queryFn: async ({ pageParam }) => {
        return fetchInventoryProducts(pageParam, apiQueryParams);
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.pagination.hasMore) {
          return lastPage.pagination.page + 1;
        }
        return undefined;
      },
      initialPageParam: hasFilters ? 1 : 2, // Start from page 1 if we have filters, otherwise page 2
      // Only provide initial data if we don't have filters
      initialData: hasFilters
        ? undefined
        : {
            pages: [
              {
                items: initialData,
                pagination: {
                  page: 1,
                  limit: ITEMS_PER_PAGE,
                  totalCount: initialTotalCount,
                  totalPages: Math.ceil(initialTotalCount / ITEMS_PER_PAGE),
                  hasMore: initialTotalCount > ITEMS_PER_PAGE,
                },
              },
            ],
            pageParams: [1],
          },
    });

  // If we have filters, use only the CSR data; otherwise, combine SSR + CSR data
  const allItems = hasFilters
    ? data?.pages.flatMap((page) => page.items) || []
    : [
        ...initialData,
        ...(data?.pages.slice(1).flatMap((page) => page.items) ?? []),
      ];

  const totalCount = hasFilters
    ? data?.pages[0]?.pagination.totalCount || 0
    : initialTotalCount;

  const shouldShowLoadMore = totalCount > ITEMS_PER_PAGE && hasNextPage;

  if (isPending && hasFilters) {
    return (
      <div className="w-full flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-muted-foreground block lg:hidden">
        {totalCount} Products
      </p>

      <div className="h-24 lg:h-52 relative">
        <Image
          src={BannerImage}
          alt=""
          className="w-full h-auto rounded-lg"
          placeholder="blur"
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
        />
      </div>

      <div className="flex justify-between items-center mb-6 flex-wrap gap-4 lg:mt-6">
        <p className="text-base text-gray-600 hidden lg:block">
          <span className="font-semibold text-gray-900">{totalCount}</span>{" "}
          {totalCount === 1 ? "product" : "products"}
        </p>

        <div className="items-center gap-2 hidden lg:flex">
          <div className="flex items-center">
            <label
              htmlFor="sort-select"
              className="text-sm text-gray-600 mr-2 hidden sm:inline"
            >
              Sort by:
            </label>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-[140px] sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price_low_to_high">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price_high_to_low">
                  Price: High to Low
                </SelectItem>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="bestselling">Best Selling</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {allItems.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allItems.map((item) => (
              <ProductCard key={item.id} inventoryItem={item} />
            ))}
          </div>

          {shouldShowLoadMore && (
            <div className="flex flex-col items-center justify-center mt-8 mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {allItems.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">{totalCount}</span>{" "}
                products
              </p>

              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                size="lg"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="w-full h-64 flex items-center justify-center shadow-none border-0">
          <CardContent className="text-center">
            <PackageX className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-gray-900">
              No products found
            </p>
            <p className="text-gray-600">
              Try adjusting your search or filter to find what you&apos;re
              looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
