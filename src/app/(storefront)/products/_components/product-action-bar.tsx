"use client";

import React from "react";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ActionBarProps {
  onSort?: () => void;
  onFilter?: () => void;
}

const ProductActionBar = ({ onSort, onFilter }: ActionBarProps) => {
  const pathname = usePathname();

  const includedRoutes = [
    "/products",
    "/products/c",
    "/brands",
    "/categories",
    "/search",
  ];

  const shouldShowActionBar = () => {
    return includedRoutes.some((route) => pathname.startsWith(route));
  };

  if (!shouldShowActionBar()) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="h-14 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="h-full grid grid-cols-2 divide-x divide-gray-200">
          {/* Sort Button */}
          <button
            onClick={onSort}
            className={cn(
              "flex items-center justify-center gap-2",
              "active:bg-gray-50 transition-colors duration-200"
            )}
          >
            <ArrowUpDown className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900 uppercase tracking-wider">
              Sort
            </span>
          </button>

          {/* Filter Button */}
          <button
            onClick={onFilter}
            className={cn(
              "flex items-center justify-center gap-2",
              "active:bg-gray-50 transition-colors duration-200"
            )}
          >
            <SlidersHorizontal className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900 uppercase tracking-wider">
              Filter
            </span>
          </button>
        </div>
      </div>

      {/* Safe area padding for mobile browsers */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </div>
  );
};

export default ProductActionBar;
