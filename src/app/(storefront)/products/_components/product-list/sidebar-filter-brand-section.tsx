"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchBrands } from "@/services/brands";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SidebarFilterBrandSection() {
  const [brandSearch, setBrandSearch] = useState("");
  const [isBrandsExpanded, setIsBrandsExpanded] = useState(true);
  const debouncedBrandSearch = useDebounce(brandSearch, 300);
  const params = useSearchParams();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["brands", debouncedBrandSearch, params.toString()],
      queryFn: ({ pageParam = 1 }) =>
        fetchBrands({
          search: debouncedBrandSearch,
          page: pageParam,
          page_size: 5,
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
    });

  const brands = data?.pages.flatMap((page) => page.data) || [];
  const shouldShowMore = hasNextPage && brands.length >= 5;

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
        className={`grid transition-all duration-200 ${
          isBrandsExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="space-y-4 mt-5">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
              size={16}
            />
            <Input
              placeholder="Search brands"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className={`pl-9 h-10 bg-white border-gray-300 hover:border-secondary transition-colors
                 focus-visible:ring-1 focus-visible:ring-secondary/20 focus-visible:border-secondary
                 ${isFetching ? "pr-9" : ""}`}
            />
            {isFetching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="animate-spin" size={16} />
              </div>
            )}
          </div>

          <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center group/item hover:bg-secondary/5 rounded-md transition-colors p-1.5"
              >
                <Checkbox
                  id={brand.id}
                  className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
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
            ))}

            {!isFetching && brands.length === 0 && (
              <p className="text-sm text-gray-500 py-2 text-center">
                No brands found
              </p>
            )}
          </div>

          {shouldShowMore && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full text-sm font-medium text-secondary hover:text-secondary/90 disabled:opacity-50 flex items-center justify-center gap-2 py-2 transition-colors border-t border-gray-100"
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
