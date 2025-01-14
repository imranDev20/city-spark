"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import SidebarFilterBrandSection from "./sidebar-filter-brand-section";
import useQueryString from "@/hooks/use-query-string";

type FilterOption = {
  id: string;
  name: string;
  options: string[];
};

export default function FilterSidebar({
  filterOptions,
}: {
  filterOptions: FilterOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createQueryString, removeQueryString } = useQueryString();

  const [isPriceExpanded, setIsPriceExpanded] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState<
    Record<string, boolean>
  >({});

  // Initialize price range from URL or defaults
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 1000,
  ]);

  const toggleFilter = (filterId: string) => {
    setExpandedFilters((prev) => ({ ...prev, [filterId]: !prev[filterId] }));
  };

  const updateFilter = (key: string, value: string, checked: boolean) => {
    const currentParam = searchParams.get(key);
    let currentValues = currentParam ? currentParam.split(",") : [];

    if (checked) {
      // Add value if it's not already included
      if (!currentValues.includes(value)) {
        currentValues.push(value);
      }
    } else {
      // Remove value
      currentValues = currentValues.filter((v) => v !== value);
    }

    // If there are values, update them; otherwise, remove the parameter
    if (currentValues.length > 0) {
      const queryString = createQueryString({ [key]: currentValues.join(",") });
      router.push(`?${queryString}`, { scroll: false });
    } else {
      const queryString = removeQueryString(key);
      router.push(queryString ? `?${queryString}` : "/products", {
        scroll: false,
      });
    }
  };

  const applyPriceRange = () => {
    const queryString = createQueryString({
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
    });
    router.push(`?${queryString}`, { scroll: false });
  };

  const resetFilters = () => {
    router.push("/products", { scroll: false });
  };

  const isOptionChecked = (key: string, value: string) => {
    const param = searchParams.get(key);
    if (!param) return false;

    // Split the comma-separated values and check if our value is included
    return param.split(",").includes(value);
  };

  return (
    <aside className="w-full max-w-xs flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-900">Filter Products</h4>
        <button
          onClick={resetFilters}
          className="text-sm text-primary hover:text-primary/90 font-medium transition-colors"
        >
          Reset All
        </button>
      </div>

      <Card className="border-gray-300 overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="divide-y divide-gray-200">
          {/* Brand Section */}
          <SidebarFilterBrandSection />

          {/* Filter Options */}
          {filterOptions.map((option) => (
            <div key={option.id} className="p-5">
              <button
                className="w-full flex justify-between items-center group"
                onClick={() => toggleFilter(option.id)}
              >
                <span className="font-semibold text-gray-900 capitalize">
                  {option.name}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-all duration-200 ${
                    expandedFilters[option.id] ? "rotate-180" : ""
                  } group-hover:text-primary`}
                />
              </button>

              <div
                className={`grid transition-all duration-200 ${
                  expandedFilters[option.id]
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-1.5 mt-5">
                    {option.options.map((value) => (
                      <div
                        key={value}
                        className="flex items-center hover:bg-secondary/5 rounded-md transition-colors p-1.5"
                      >
                        <Checkbox
                          id={`${option.id}_${value}`}
                          checked={isOptionChecked(option.id, value)}
                          onCheckedChange={(checked) =>
                            updateFilter(option.id, value, checked as boolean)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-secondary 
                            focus:ring-secondary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                        />
                        <label
                          htmlFor={`${option.id}_${value}`}
                          className="ml-3 text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
                        >
                          {value}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Price Range */}
          <div className="p-5">
            <button
              className="w-full flex justify-between items-center group"
              onClick={() => setIsPriceExpanded(!isPriceExpanded)}
            >
              <span className="font-semibold text-gray-900">Price Range</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-all duration-200 ${
                  isPriceExpanded ? "rotate-180" : ""
                } group-hover:text-primary`}
              />
            </button>

            <div
              className={`grid transition-all duration-200 ${
                isPriceExpanded
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-4 mt-5">
                  <DualRangeSlider
                    min={0}
                    max={1000}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="w-full"
                  />

                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="h-10 bg-white border-gray-300 hover:border-secondary transition-colors
                        focus-visible:ring-1 focus-visible:ring-secondary/20 focus-visible:border-secondary"
                      placeholder="£ Min"
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="h-10 bg-white border-gray-300 hover:border-secondary transition-colors
                        focus-visible:ring-1 focus-visible:ring-secondary/20 focus-visible:border-secondary"
                      placeholder="£ Max"
                    />
                  </div>

                  <Button
                    onClick={applyPriceRange}
                    className="w-full bg-secondary hover:bg-secondary/90 transition-colors"
                  >
                    Apply Filter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </aside>
  );
}
