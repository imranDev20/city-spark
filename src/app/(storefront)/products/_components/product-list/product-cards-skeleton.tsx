"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ProductCardsContainerSkeleton() {
  return (
    <div className="space-y-6">
      {/* Title and count skeletons - mobile only */}
      <div className="lg:hidden space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Banner skeleton */}
      <Skeleton className="w-full aspect-[3/1] rounded-lg" />

      {/* Header section */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <Skeleton className="h-5 w-48 hidden lg:block" />
        <Skeleton className="h-10 w-[180px] hidden lg:block" />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(6)].map((_, index) => (
          <Card
            key={index}
            className="shadow-none lg:shadow-md group h-full flex flex-col bg-white border-gray-300 rounded-xl overflow-hidden lg:hover:shadow-lg transition-all duration-300"
          >
            {/* Product image skeleton */}
            <div className="relative">
              <Skeleton className="h-32 sm:h-48 md:h-56 lg:h-64 w-full" />
            </div>

            {/* Content section */}
            <div className="p-2 sm:p-4 space-y-3">
              {/* Brand/Category */}
              <Skeleton className="h-4 w-24 hidden sm:block" />

              {/* Rating */}
              <Skeleton className="h-4 w-28" />

              {/* Title */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-2">
                <Skeleton className="h-8 w-full" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
