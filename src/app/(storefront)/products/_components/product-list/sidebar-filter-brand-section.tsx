"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import useQueryString from "@/hooks/use-query-string";
import { fetchBrands } from "@/services/brands";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function BrandSkeleton() {
  return (
    <div className="flex items-center p-1.5">
      <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
      <div className="flex justify-between items-center flex-1 ml-3">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function SidebarFilterBrandSection() {
  const [brandSearch, setBrandSearch] = useState("");
  const [isBrandsExpanded, setIsBrandsExpanded] = useState(true);
  const debouncedBrandSearch = useDebounce(brandSearch, 300);
  const params = useSearchParams();
  const { createQueryString, removeQueryString } = useQueryString();
  const router = useRouter();

  // Get the main search term from URL
  const mainSearchTerm = params.get("search") || "";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: [
        "brands",
        debouncedBrandSearch,
        mainSearchTerm, // Add main search term to query key
        params.get("p_id"),
        params.get("s_id"),
        params.get("t_id"),
        params.get("q_id"),
      ],
      queryFn: ({ pageParam = 1 }) =>
        fetchBrands({
          search: debouncedBrandSearch,
          page: pageParam,
          page_size: 5,
          product_search: mainSearchTerm, // Include the main search term
          primary_category_id: params.get("p_id") ?? undefined,
          secondary_category_id: params.get("s_id") ?? undefined,
          tertiary_category_id: params.get("t_id") ?? undefined,
          quaternary_category_id: params.get("q_id") ?? undefined,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.pagination.hasMore
          ? lastPage.pagination.currentPage + 1
          : undefined,
      initialPageParam: 1,
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
      refetchOnWindowFocus: false, // Prevent refetching when window regains focus
    });

  const brands = data?.pages.flatMap((page) => page.data) || [];
  const shouldShowMore = hasNextPage && brands.length >= 5;

  const updateBrandFilter = (brandId: string, checked: boolean) => {
    const currentParam = params.get("brand_id");
    let currentBrands = currentParam ? currentParam.split(",") : [];

    if (checked) {
      if (!currentBrands.includes(brandId)) {
        currentBrands.push(brandId);
      }
    } else {
      currentBrands = currentBrands.filter((id) => id !== brandId);
    }

    if (currentBrands.length > 0) {
      const queryString = createQueryString({
        brand_id: currentBrands.join(","),
      });
      router.push(`?${queryString}`, { scroll: false });
    } else {
      const queryString = removeQueryString("brand_id");
      router.push(queryString ? `?${queryString}` : window.location.pathname, {
        scroll: false,
      });
    }
  };

  const isBrandChecked = (brandId: string) => {
    const param = params.get("brand_id");
    return param ? param.split(",").includes(brandId) : false;
  };

  return (
    <div className="p-5">
      <button
        className="w-full flex justify-between items-center group"
        onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
      >
        <span className="font-semibold text-gray-900">Brands</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-all duration-200 ${
            isBrandsExpanded ? "rotate-180" : ""
          } group-hover:text-primary`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isBrandsExpanded ? "max-h-[400px] mt-5" : "max-h-0 mt-0"
        }`}
      >
        <div className="space-y-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
              size={16}
            />
            <Input
              placeholder="Search brands"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className={`pl-9 h-10 bg-white border-border hover:border-secondary transition-colors
                 focus-visible:ring-1 focus-visible:ring-secondary/20 focus-visible:border-secondary
                 ${isPending ? "pr-9" : ""}`}
            />
            {isFetchingNextPage && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="animate-spin" size={16} />
              </div>
            )}
          </div>

          <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
            {isPending ? (
              // Show loading skeletons during initial load
              <>
                <BrandSkeleton />
                <BrandSkeleton />
                <BrandSkeleton />
                <BrandSkeleton />
                <BrandSkeleton />
              </>
            ) : brands.length > 0 ? (
              brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex items-center group/item hover:bg-secondary/5 rounded-md transition-colors p-1.5"
                >
                  <Checkbox
                    id={brand.id}
                    checked={isBrandChecked(brand.id)}
                    onCheckedChange={(checked) =>
                      updateBrandFilter(brand.id, checked as boolean)
                    }
                    className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                  />
                  <label
                    htmlFor={brand.id}
                    className="ml-3 text-sm text-gray-700 flex-1 flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate group-hover/item:text-gray-900">
                      {brand.name}
                    </span>
                    <span className="text-gray-400 text-xs">
                      ({brand._count.products})
                    </span>
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-2 text-center">
                No brands found
              </p>
            )}
          </div>

          {shouldShowMore && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full text-sm font-medium text-secondary hover:text-secondary/90 disabled:opacity-50 flex items-center justify-center gap-2 py-2 transition-colors border-t border-border"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Loading...
                </>
              ) : (
                "Show More"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
