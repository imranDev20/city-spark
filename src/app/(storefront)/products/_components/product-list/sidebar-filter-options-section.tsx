"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import useQueryString from "@/hooks/use-query-string";

type FilterOption = {
  id: string;
  name: string;
  options: string[];
};

interface SidebarFilterOptionsSectionProps {
  filterOptions: FilterOption[];
}

export default function SidebarFilterOptionsSection({
  filterOptions,
}: SidebarFilterOptionsSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createQueryString, removeQueryString } = useQueryString();

  const [isPriceExpanded, setIsPriceExpanded] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState<
    Record<string, boolean>
  >({});

  // Initialize price range from URL or defaults
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("min_price")) || 0,
    Number(searchParams.get("max_price")) || 50000,
  ]);

  const toggleFilter = (filterId: string) => {
    setExpandedFilters((prev) => ({ ...prev, [filterId]: !prev[filterId] }));
  };

  const updateFilter = (key: string, value: string, checked: boolean) => {
    const currentParam = searchParams.get(key);
    let currentValues = currentParam ? currentParam.split(",") : [];

    if (checked) {
      if (!currentValues.includes(value)) {
        currentValues.push(value);
      }
    } else {
      currentValues = currentValues.filter((v) => v !== value);
    }

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

  const handlePriceRangeChange = (newRange: number[]) => {
    setPriceRange(newRange);
    const queryString = createQueryString({
      min_price: newRange[0].toString(),
      max_price: newRange[1].toString(),
    });

    router.push(`?${queryString}`, { scroll: false });
  };

  const handleInputChange = (index: 0 | 1, value: number) => {
    const newRange = [...priceRange];
    newRange[index] = value;
    handlePriceRangeChange(newRange);
  };

  const isOptionChecked = (key: string, value: string) => {
    const param = searchParams.get(key);
    return param ? param.split(",").includes(value) : false;
  };

  return (
    <>
      {/* Filter Options */}
      {filterOptions.map((option) => (
        <div
          key={option.id}
          className="p-5 border-b border-gray-100 last:border-0"
        >
          <button
            className="w-full flex justify-between items-center group"
            onClick={() => toggleFilter(option.id)}
          >
            <span className="font-semibold text-gray-900 capitalize text-left flex-grow">
              {option.name}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                expandedFilters[option.id] ? "rotate-180" : ""
              } group-hover:text-primary`}
            />
          </button>

          {/* Using display instead of max-height for better performance */}
          {expandedFilters[option.id] && (
            <div className="mt-5 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="space-y-1.5">
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
                      className="h-4 w-4 flex-shrink-0 rounded border-border text-secondary 
                        focus:ring-secondary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                    />
                    <label
                      htmlFor={`${option.id}_${value}`}
                      className="ml-3 text-sm text-gray-700 hover:text-gray-900 cursor-pointer text-left w-full"
                    >
                      {value}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
              isPriceExpanded ? "rotate-180" : ""
            } group-hover:text-primary`}
          />
        </button>

        {/* Using display instead of max-height for better performance */}
        {isPriceExpanded && (
          <div className="mt-5 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="space-y-4">
              <DualRangeSlider
                min={0}
                max={50000}
                step={1}
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                className="w-full"
              />

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handleInputChange(0, Number(e.target.value))}
                  className="h-10 bg-white border-border hover:border-secondary transition-colors
                    focus-visible:ring-1 focus-visible:ring-secondary/20 focus-visible:border-secondary"
                  placeholder="£ Min"
                />
                <span className="text-gray-400">-</span>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handleInputChange(1, Number(e.target.value))}
                  className="h-10 bg-white border-border hover:border-secondary transition-colors
                    focus-visible:ring-1 focus-visible:ring-secondary/20 focus-visible:border-secondary"
                  placeholder="£ Max"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
