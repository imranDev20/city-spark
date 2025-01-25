"use client";

import { Prisma } from "@prisma/client";
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "@/app/(storefront)/_components/product-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PackageX } from "lucide-react";
import { useSearchParams } from "next/navigation";

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

type InventoryItemWithRelations = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
        brand: true;
      };
    };
  };
}>;

interface ProductCardsLoadMoreProps extends ProductCardsContainerProps {
  initialData: InventoryItemWithRelations[];
  initialTotalCount: number;
}

async function fetchInventoryProducts(
  page: number,
  queryParams: ProductCardsContainerProps & Record<string, any>
) {
  // Create base URLSearchParams
  const params = new URLSearchParams();

  // Add pagination
  params.set("page", page.toString());
  params.set("limit", ITEMS_PER_PAGE.toString());

  // Add category params
  if (queryParams.primaryCategoryId) {
    params.set("primaryCategoryId", queryParams.primaryCategoryId);
  }
  if (queryParams.secondaryCategoryId) {
    params.set("secondaryCategoryId", queryParams.secondaryCategoryId);
  }
  if (queryParams.tertiaryCategoryId) {
    params.set("tertiaryCategoryId", queryParams.tertiaryCategoryId);
  }
  if (queryParams.quaternaryCategoryId) {
    params.set("quaternaryCategoryId", queryParams.quaternaryCategoryId);
  }

  // Add required flags
  if (queryParams.isPrimaryRequired) {
    params.set("isPrimaryRequired", queryParams.isPrimaryRequired.toString());
  }
  if (queryParams.isSecondaryRequired) {
    params.set(
      "isSecondaryRequired",
      queryParams.isSecondaryRequired.toString()
    );
  }
  if (queryParams.isTertiaryRequired) {
    params.set("isTertiaryRequired", queryParams.isTertiaryRequired.toString());
  }
  if (queryParams.isQuaternaryRequired) {
    params.set(
      "isQuaternaryRequired",
      queryParams.isQuaternaryRequired.toString()
    );
  }

  // Add search
  if (queryParams.search) {
    params.set("search", queryParams.search);
  }

  // Add any additional filter params
  Object.entries(queryParams).forEach(([key, value]) => {
    if (
      ![
        "primaryCategoryId",
        "secondaryCategoryId",
        "tertiaryCategoryId",
        "quaternaryCategoryId",
        "isPrimaryRequired",
        "isSecondaryRequired",
        "isTertiaryRequired",
        "isQuaternaryRequired",
        "search",
        "page",
        "limit",
      ].includes(key) &&
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      if (typeof value === "string") {
        // For comma-separated values, keep them as is
        params.set(key, value);
      } else {
        params.set(key, value.toString());
      }
    }
  });

  const queryString = params.toString();
  console.log("Fetching with query:", queryString);

  const response = await fetch(`/api/inventory?${queryString}`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  return {
    items: data.data,
    pagination: data.pagination,
  };
}

export default function ProductCardsLoadMore({
  initialData,
  initialTotalCount,
  ...queryParams
}: ProductCardsLoadMoreProps) {
  const searchParams = useSearchParams();

  // Check if we have any filter params other than category/search
  const hasAdditionalFilters = Array.from(searchParams.keys()).some(
    (key) =>
      ![
        "primaryCategoryId",
        "secondaryCategoryId",
        "tertiaryCategoryId",
        "quaternaryCategoryId",
        "search",
        "page",
        "limit",
      ].includes(key)
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["products", queryParams, Array.from(searchParams.entries())],
      queryFn: async ({ pageParam }) => {
        // Include all search params in the fetch
        return fetchInventoryProducts(pageParam, {
          ...queryParams,
          ...Object.fromEntries(searchParams.entries()),
        });
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.pagination.hasMore) {
          return lastPage.pagination.page + 1;
        }
        return undefined;
      },
      initialPageParam: hasAdditionalFilters ? 1 : 2,
      // Only provide initial data if we don't have additional filters
      initialData: hasAdditionalFilters
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

  // Use CSR data when we have additional filters, otherwise combine SSR + CSR
  const allItems = hasAdditionalFilters
    ? data?.pages.flatMap((page) => page.items) || []
    : [
        ...initialData,
        ...(data?.pages.slice(1).flatMap((page) => page.items) ?? []),
      ];

  const shouldShowLoadMore = hasAdditionalFilters
    ? (data?.pages[0]?.pagination.totalCount || 0) > ITEMS_PER_PAGE &&
      hasNextPage
    : initialTotalCount > ITEMS_PER_PAGE && hasNextPage;

  if (isPending) {
    return (
      <div className="w-full flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {allItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {allItems.map((item) => (
              <ProductCard key={item.id} inventoryItem={item} />
            ))}
          </div>

          {shouldShowLoadMore && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="h-11 px-8 font-medium bg-primary hover:bg-primary-hover active:bg-primary-active transition-colors duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
                size="lg"
              >
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <span>Load More Products</span>
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
