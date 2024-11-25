"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CategoryWithChildParent } from "@/types/storefront-products";
import MobileCategoryNavCarousel from "./mobile-category-nav-carousel";

export default function MobileCategoryNav({
  categories,
}: {
  categories: CategoryWithChildParent[];
}) {
  return (
    <div className="lg:hidden mt-5">
      <div className="px-4 mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Categories</h2>
        <Link
          href="/categories"
          className="flex items-center text-sm text-primary"
        >
          Explore All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <MobileCategoryNavCarousel categories={categories} />
    </div>
  );
}
