"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type FilterBrand = {
  id: string;
  name: string;
  count: number;
};

type BrandsResponse = {
  data: FilterBrand[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
};

interface SeeMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const SeeMoreButton: React.FC<SeeMoreButtonProps> = ({
  onClick,
  isLoading,
  disabled,
}) => (
  <div className="flex items-center mt-5">
    <button
      className="text-sm text-gray-600 hover:underline"
      onClick={onClick}
      disabled={disabled}
    >
      See More
    </button>
    {isLoading && (
      <div className="ml-2">
        <Loader2 className="animate-spin text-gray-400" size={18} />
      </div>
    )}
  </div>
);

async function fetchBrands({
  pageParam = 1,
  queryKey,
}: any): Promise<BrandsResponse> {
  const [_, search] = queryKey;
  const response = await axios.get("/api/brands", {
    params: { search, limit: 5, page: pageParam },
  });
  return response.data;
}

export default function FilterSidebar({
  initialBrands,
}: {
  initialBrands: FilterBrand[];
}) {
  const [brandSearch, setBrandSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    width: false,
    price: true,
  });
  const [isClientBrands, setIsClientBrands] = useState(false);
  const [priceRange, setPriceRange] = useState([99, 546]);
  const debouncedBrandSearch = useDebounce(brandSearch, 300);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["brands", debouncedBrandSearch],
    queryFn: fetchBrands,
    initialPageParam: brandSearch !== "" ? 1 : 2,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    enabled: isClientBrands,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSeeMore = async () => {
    if (!isClientBrands) {
      setIsClientBrands(true);
      // Fetch first two pages
      await queryClient.prefetchInfiniteQuery({
        queryKey: ["brands", debouncedBrandSearch],
        queryFn: fetchBrands,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
          lastPage.pagination.hasMore
            ? lastPage.pagination.page + 1
            : undefined,
        pages: 2,
      });
      refetch();
    } else {
      fetchNextPage();
    }
  };

  const allBrands = debouncedBrandSearch
    ? data?.pages.flatMap((page) => page.data) || []
    : data?.pages.flatMap((page) => page.data) || initialBrands;

  console.log(hasNextPage);

  return (
    <aside className="w-full max-w-xs">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold">Filters by</h4>
        <button className="text-sm text-gray-600 hover:underline">
          Clean all
        </button>
      </div>

      <Card className="shadow-sm border-gray-350">
        <div className="p-5 space-y-6">
          <div>
            <button
              className="w-full flex justify-between items-center pb-2"
              onClick={() => toggleSection("brands")}
            >
              <span className="font-semibold text-lg">Brands</span>
              <ChevronDown
                className={`transform transition-transform duration-200 ease-in-out ${
                  expandedSections.brands ? "rotate-180" : ""
                }`}
                size={20}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                expandedSections.brands ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-3 px-0.5">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      placeholder="Search in brand"
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="pl-10 bg-gray-100 border-gray-300"
                    />
                    {isFetching && !isFetchingNextPage && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2
                          className="animate-spin  text-gray-400"
                          size={18}
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-4 mt-5 ml-1">
                    {allBrands.map((brand) => (
                      <div key={brand.id} className="flex items-center">
                        <Checkbox
                          id={brand.id}
                          className="mr-3 border-gray-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                          htmlFor={brand.id}
                          className="text-sm cursor-pointer"
                        >
                          {brand.name}{" "}
                          <span className="text-gray-500">({brand.count})</span>
                        </label>
                      </div>
                    ))}
                  </div>

                  {!isFetching &&
                    !isFetchingNextPage &&
                    allBrands.length === 0 && (
                      <div className="text-sm text-gray-500">
                        No brands found.
                      </div>
                    )}

                  {(!isClientBrands || isFetching || hasNextPage) && (
                    <SeeMoreButton
                      onClick={handleSeeMore}
                      isLoading={isFetching}
                      disabled={isFetchingNextPage}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Width section */}
          <div>
            <button
              className="w-full flex justify-between items-center pb-2"
              onClick={() => toggleSection("width")}
            >
              <span className="font-semibold text-lg">Width</span>
              <ChevronDown
                className={`transform transition-transform duration-200 ease-in-out ${
                  expandedSections.width ? "rotate-180" : ""
                }`}
                size={20}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                expandedSections.width ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-3">
                  {/* Add width filter content here */}
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Price section */}
          <div>
            <button
              className="w-full flex justify-between items-center pb-2"
              onClick={() => toggleSection("price")}
            >
              <span className="font-semibold text-lg">Price</span>
              <ChevronDown
                className={`transform transition-transform duration-200 ease-in-out ${
                  expandedSections.price ? "rotate-180" : ""
                }`}
                size={20}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                expandedSections.price ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-3 space-y-4 px-0.5">
                  <DualRangeSlider
                    min={0}
                    max={1000}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="w-full"
                    label={() => null}
                  />
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-full"
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full"
                    />
                  </div>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </aside>
  );
}
