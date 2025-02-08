"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import SidebarFilterBrandSection from "./sidebar-filter-brand-section";
import SidebarFilterOptionsSection from "./sidebar-filter-options-section";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { removeQueryString } = useQueryString();

  const resetFilters = () => {
    let currentParams = new URLSearchParams(searchParams.toString());

    // Keep only these parameters
    const preserveParams = new Set(["p_id", "s_id", "t_id", "q_id", "search"]);

    // Remove all parameters except those in preserveParams
    let queryString = searchParams.toString();
    for (const param of currentParams.keys()) {
      if (!preserveParams.has(param)) {
        queryString = removeQueryString(param);
      }
    }

    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newPath, { scroll: false });
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

      <Card className="border overflow-hidden transition-all duration-300 hover:shadow-md bg-white shadow">
        <div className="divide-y divide-gray-200">
          {/* Brand Section */}
          <SidebarFilterBrandSection />
          <SidebarFilterOptionsSection filterOptions={filterOptions} />
        </div>
      </Card>
    </aside>
  );
}
