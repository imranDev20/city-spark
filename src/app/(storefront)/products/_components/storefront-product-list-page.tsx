import React, { Suspense } from "react";

import { cn } from "@/lib/utils";
import PageHeaderContainer from "./product-list/page-header-container";
import PageHeaderSkeleton from "./product-list/page-header-skeleton";
import FilterSidebarContainer from "./product-list/filter-sidebar-container";
import FilterSidebarSkeleton from "./product-list/filter-sidebar-skeleton";
import ProductCardsContainer from "./product-list/product-cards-container";
import ProductCardsContainerSkeleton from "./product-list/product-cards-container-skeleton";
import ProductActionBarSkeleton from "./product-action-bar-skeleton";
import ProductActionBarContainer from "./product-action-bar-container";
import MobileProductHeader from "./product-list/mobile-product-header";

type PageHeaderContainerProps = {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
  isPrimaryRequired?: boolean;
  isSecondaryRequired?: boolean;
  isTertiaryRequired?: boolean;
  isQuaternaryRequired?: boolean;
  isSearch?: boolean;
  search?: string;
};

export default function StorefrontProductListPage(
  props: PageHeaderContainerProps
) {
  return (
    <main>
      <MobileProductHeader />

      <Suspense fallback={<PageHeaderSkeleton />}>
        <PageHeaderContainer {...props} />
      </Suspense>

      <section
        className={cn(
          "flex-grow mx-auto my-5 lg:my-10",
          "container max-w-screen-xl",
          "px-4 md:px-6 lg:px-8"
        )}
      >
        <div className="grid grid-cols-12 lg:gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block col-span-3">
            <Suspense fallback={<FilterSidebarSkeleton />}>
              <FilterSidebarContainer {...props} />
            </Suspense>
          </div>

          <div className="col-span-12 md:col-span-9">
            <Suspense fallback={<ProductCardsContainerSkeleton />}>
              <ProductCardsContainer {...props} />
            </Suspense>
          </div>
        </div>
      </section>

      <Suspense fallback={<ProductActionBarSkeleton />}>
        <ProductActionBarContainer {...props} />
      </Suspense>
    </main>
  );
}
