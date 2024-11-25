"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { categoryData } from "@/app/data";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function MobileCategoryNav() {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  return (
    <div className="lg:hidden mt-5">
      <div className="px-4 mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Categories</h2>
        <Link href="/categories" className="flex items-center">
          Explore All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="pl-4">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {categoryData.map((item, index) => (
              <div key={index} className="flex-none w-[31%] min-w-[110px] pr-3">
                <Link
                  href={`/category/${item.label.toLowerCase()}`}
                  className={cn(
                    "flex flex-col items-center p-4 w-full transition-all duration-200",
                    "hover:bg-primary/5 group rounded-xl",
                    "border border-border hover:border-primary/20",
                    "bg-white"
                  )}
                >
                  <item.Icon
                    className={cn(
                      "transition-all duration-200 text-gray-600",
                      "group-hover:text-primary group-hover:scale-110"
                    )}
                    height={32}
                    width={32}
                  />
                  <h5
                    className={cn(
                      "text-xs mt-3 text-center font-medium",
                      "group-hover:text-primary transition-colors duration-200"
                    )}
                  >
                    {item.label}
                  </h5>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
